/** Copyright © 2021 André LECLERCQ
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
 **/


logSys("-----------------------------------------------");
logSys("---------------- JORDSON DOCS STARTS ----------------");

import http2 from "http2";
import fs from "fs";
import path from "path";
import logSys from "./app/env/msgSystem.js";
import marked from "marked";
const gConfig = {
    global: {
        port: '9999'
    },
    mimeTypes: {
        html: "text/html",
        js: "text/javascript",
        css: "text/css",
        json: "application/json",
        png: "image/png",
        jpg: "image/jpg",
        gif: "image/gif",
        svg: "image/svg+xml",
        wav: "audio/wav",
        mp4: "video/mp4",
        woff: "application/font-woff",
        ttf: "application/font-ttf",
        eot: "application/vnd.ms-fontobject",
        otf: "application/font-otf",
        wasm: "application/wasm",
    }
}

const port = gConfig.global.port;
const mimeTypes = gConfig.mimeTypes;

async function parseRequest(stream, headers, req) {

    req.url = new URL(headers[":path"], `https://localhost:${port}`);
    req.param = Object.fromEntries(req.url.searchParams.entries());
    req.path = req.url.pathname.split("/");

    await req.path.shift();

    stream.setEncoding("utf8");
    req.body = "";

    for await (const chunk of stream) req.body += chunk;
}

async function readFile(req, res) {

    const fileName = req.path.join(path.sep);
    let filePath = "doc/" + (fileName === "" ? "index.html" : fileName);
    const ext = path.extname(filePath).substring(1);
    res.headers["content-type"] = ext in mimeTypes ? mimeTypes[ext] : "text/plain";

    try {

        res.data = await fs.promises.readFile(filePath);

    } catch (error) {

        if (error.code === "ENOENT") throw new Error("404 Not Found");
        throw error;

    }
}

async function prepareResponse(res, data) {

    res.headers["content-type"] = "application/json";
    res.data = typeof data === "object" ? JSON.stringify(data) : data;

}

async function handleRequest(req, res) {

    /**
     * Get Markdown files
     */
    if(req.url.pathname === '/getdata'){

        let pathOrigin = path.join("doc/");
        let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

        let docsName = [];
        let docsData = '';
        let data = {};

        fs.readdirSync(pathOrigin).sort(collator.compare).forEach( file => {
            if(path.extname(file) === ".md"){
                let fileName = file.replace(path.extname(file), '');
                fileName = fileName.replace(/^([0-9]*\.)/, '');
                fileName = fileName.replace(' ', '-');
                fileName = fileName.replace('.', '-');
                docsName.push(fileName.toLowerCase());
                docsData += `<div data-id="${fileName.toLowerCase()}">
                    ${marked(fs.readFileSync(pathOrigin + file).toString())}</div>`
            }
        })

        data.mainNavigation = {chapterName: '', docsName: docsName, docsData: docsData };

        fs.readdirSync(pathOrigin).sort(collator.compare).forEach( dir => {
            let dirPath = path.join(`doc/${dir}`);
            let dirName = dir.replace(/^([0-9]*\.)/, '')
            let chapterName = dirName.replace(/-/g, ' ');

            if(fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()){
                docsName = [];
                docsData = '';

                fs.readdirSync(dirPath).sort(collator.compare).forEach( file => {
                    if(path.extname(file) === '.md'){
                        let fileName = file.replace(path.extname(file), '');
                        fileName = fileName.replace(/^([0-9]*\.)/, '');
                        fileName = fileName.replace(' ', '-');
                        fileName = fileName.replace('.', '-');
                        docsName.push(`${dirName.toLowerCase()}_${fileName.toLowerCase()}`);
                        docsData += `<div data-id="${dirName.toLowerCase()}_${fileName.toLowerCase()}">
                            ${marked(fs.readFileSync(dirPath + '/' + file).toString())}</div>`
                    }
                })
                data[`${dirName}`] = {chapterName: chapterName, docsName: docsName, docsData: docsData };
            }
        })

        await prepareResponse(res, data);

    } else if (path.extname(String(req.url)) === "") {

        let params = "";

        if (Object.keys(req.param).length >= 1) {
            params = "?" + Object.entries(req.param).map(([key,value]) => `${key}=${value}`).join("&")
        }

        if (String(req.url.pathname) !== "/") {

            res.headers["Location"] = "/#" + String(req.url.pathname).replace("/", "") + params;
            res.headers[":status"] = 302;

        } else {

            res.headers["Location"] = "/#" + params;
            await readFile(req, res);

        }

    } else {
        await readFile(req, res);
    }
}

async function executeRequest(stream, headers) {
    // logSys( JSON.stringify(stream.session.socket.remoteAddress), 'debug' )
    stream.on("error", (error) => {
        logSys(error.message, 'error')
        logSys(error.stack, 'error')
    });
    const req = {
        headers: headers,
    };
    let res = {
        data: "",
        compress: false,
        headers: {
            server: "Server JORDSON Made with NodeJS by aLeclercq",
            ":status": 200,
        },
    };
    try {
        await parseRequest(stream, headers, req, res);
        await handleRequest(req, res, headers);
    } catch (err) {
        let error = err.message.match(/^(\d{3}) (.+)$/);
        if (error) error.shift();
        else error = ["500", "Internal Server Error"];
        res.headers[":status"] = error[0];
        res.headers["content-type"] = "text/html";
        res.data = `<h1>${error[0]} ${error[1]}</h1><pre>${err.stack}</pre>\n<pre>Request : ${JSON.stringify(
            req,
            null,
            2
        )}</pre>`;
    } finally {
        stream.respond(res.headers);
        stream.end(res.data);
    }
}

const server = http2.createSecureServer({

    key: fs.readFileSync("./app/server/certSSL/localhost-privkey.pem"),
    cert: fs.readFileSync("./app/server/certSSL/localhost-cert.pem"),

});

server.on("error", (err) => logSys(err, "error"));
server.on("stream", executeRequest);
server.listen(port);

logSys(`Jordson doc READY at https://localhost:${port}`, "success");
logSys("-----------------------------------------------");
