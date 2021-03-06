logSys("-----------------------------------------------");
logSys("---------------- SERVER STARTS ----------------");

/**
 * TODO:
 *  - Créer système auth + token
 *  - Créer api email
 *    - Créer un honeypot
 *    - Créer un captcha
 *    - Requete au serveur
 *    - Envoie de l'email
 *    - Reponse au client
 */

import http2 from "http2";
import fs from "fs";
import path from "path";
import logSys from "./app/server/msgSystem.js";
import Database from "./app/server/database.js";
import { gConfig } from "./app/config.js";

let db = new Database();
const port = gConfig.global.port;
const mimeTypes = gConfig.mimeTypes;
const publicCollection = gConfig.db.publicCollections;

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

  } catch (e) {

    if (e.code === "ENOENT") throw new Error("404 Not Found");
    throw e;

  }
}

async function prepareResponse(res, data) {

  res.headers["content-type"] = "application/json";
  res.data = JSON.stringify(data);

}

async function handleRequest(req, res) {

  if (req.url.pathname.startsWith("/api")) {

    if (req.param.action === "get" && publicCollection.some((elt) => elt === req.param.name)){
      await prepareResponse(res, await db.getCollection(req.param.name));
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
  // logSys( JSON.stringify(stream.session.socket.remoteAddress), 'debug' )
  stream.on("error", (err) => logSys(err, "error"));
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

logSys(`Server READY at https://localhost:${port}`, "success");
logSys("-----------------------------------------------");
