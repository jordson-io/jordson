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


log.success("-----------------------------------------------");
log.success("---------------- SERVER STARTS ----------------");

import http2 from "http2";
import fs from "fs";
import path from "path";
import { log } from "./app/env/logSystem.js";
import loadConfig from "./app/server/loadConfig.mjs";
import { apiRoutes } from "./app/server/apiRequests.mjs";

import { Blob } from "buffer";


const gConfig = new loadConfig();

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
  let filePath = "public/" + (fileName === "" ? "index.html" : fileName);
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

  if (req.url.pathname.startsWith("/api")) {

    for (const key in apiRoutes) {
      if (Object.hasOwnProperty.call(apiRoutes, key) && key === req.param.action) {
        await prepareResponse(res, await (await import(apiRoutes[key]))[key](req))
      }
    }

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
  // log.error( JSON.stringify(stream.session.socket.remoteAddress) )
  stream.on("error", (error) => {
    log.error(error.message);
    log.error(error.stack);
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

server.on("error", (err) => log.error(err));
server.on("stream", executeRequest);
server.listen(port);

log.success(`Server READY at https://localhost:${port}`);
log.success("-----------------------------------------------");
