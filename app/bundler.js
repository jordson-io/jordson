#!/usr/bin/env node
import logSys from "./server/msgSystem.js";
import Terser from "terser";
import fs from "fs";
import path from "path";

const dirPath = path.join("public/assets/structures.html");
let htmlFiles = [];

/**
 * Compiling HTML structures
 * @function
 * @param {string} [pathOrigin] Folder in "components/ressources/html/"
 * @returns {Promise<void>}
 */
async function getHTMLFiles(pathOrigin = path.join("components/ressources/html/")) {
  fs.writeFileSync(dirPath, "", (e) => {
    logSys(e, "error");
  });
  fs.readdir(pathOrigin, (e, files) => {
    if (e) logSys(e, "error");
    files.forEach((file) => {
      if (path.extname(file) === ".html") {
        fs.appendFileSync(
          dirPath,
          `<div data-id="${file.replace(path.extname(file), "")}">${fs
            .readFileSync(pathOrigin + file)
            .toString()}</div>`,
          (err) => {
            logSys(err, "error");
          }
        );
        if (process.argv.includes("--watch")) {
          fs.watchFile(pathOrigin + file, compile);
        }
        htmlFiles.push(pathOrigin + file);
      } else if (path.extname(file) === "") {
        getHTMLFiles(`${pathOrigin}${file}/`);
      }
    });
  });
}
// Compil JAVASCRIPT
const scripts = ["app/client/_router.js", "app/client/events.js"];

scripts.push("components/ressources/js/script.js");

let destFile = process.argv.slice(-1);
destFile = destFile[0];
// let destFile = process.argv.pop();

let compile = async () => {
  try {
    let dist = scripts.map((script) => fs.readFileSync(script, { encoding: "utf8" })).join("\n");
    if (process.argv.includes("--compress")) dist = Terser.minify(dist).code;
    fs.writeFileSync(destFile, dist);
    await getHTMLFiles();
    logSys(`------ START COMPILING ------`, "info");
  } catch (e) {
    logSys(e, "error");
  } finally {
    logSys("Compiling Javascript Done with success !", "success");
    logSys("Compiling HTML Done with success !", "success");
  }
};

if (process.argv.includes("--watch")) {
  logSys(`Ready to watch files : `, "info");
  logSys(`---------------`, "info");
  scripts.forEach((e) => {
    fs.watchFile(e, compile);
    logSys(e, "info");
  });
  logSys(`---------------`, "info");
  logSys(`Toward [${destFile}]`, "info");
  logSys("First Javascript Compilation", "info");
  await compile();
  logSys("JS is now watching for Change...", "info");
  logSys("HTML is now watching for Change...", "info");
} else if (process.argv.includes("--fonts")) {
  logSys("Import FONTS files", "info");
  fs.readdir("./components/assets/fonts", (e, files) => {
    if (e) logSys(e, "error");
    files.forEach((file) => {
      fs.copyFile(`./components/assets/fonts/${file}`, `./public/assets/fonts/${file}`, (err) => {
        if (err) {
          logSys(err, "error");
        } else {
          logSys(`${file} was copied into public/assets/fonts`, "info");
        }
      });
    });
  });
} else {
  await compile();
}
