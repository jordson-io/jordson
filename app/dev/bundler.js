#!/usr/bin/env node
import logSys from "../core/msgSystem.js";
import Terser from "terser";
import fs from "fs";
import path from "path";

const appHTMLPath = path.join("public/assets/app.html");
const directoryHTMLPath = path.join("components/ressources/html/");
const appJSPath = path.join("public/assets/app.js");
const directoryJSPath = path.join("app/client/");
let watching = false;
let htmlFiles = [];
let jsFiles = [];

// TODO: Tester les watch en synchrone

/**
 * Transpilation HTML structures
 * @function
 * @param {string} [pathOrigin] Root folder for HTML files. Default value "components/ressources/html/"
 * @param data
 */
function compileFiles(pathOrigin, data = '') {

  let files = fs.readdirSync(pathOrigin)

  files.forEach(file => {
    if (path.extname(file) === ".html") {

      data += `<div data-id="${file.replace(path.extname(file), "")}">
        ${fs.readFileSync(pathOrigin + file).toString()}</div>`;

      if (process.argv.includes("--watch")) {

        fs.watch(pathOrigin + file, watchFiles);
        logSys(`${pathOrigin}${file}`, 'info');
        htmlFiles[file] = `${pathOrigin}${file}`;

      }
    } else if (path.extname(file) === '.js'){

      data += `//${pathOrigin}${file.replace(path.extname(file), "")}\n
      ${fs.readFileSync(pathOrigin + file).toString()}\n
      //${pathOrigin}${file.replace(path.extname(file), "")}\n`;

      if (process.argv.includes("--watch")) {

        fs.watch(pathOrigin + file, watchFiles);
        logSys(`${pathOrigin}${file}`, 'info');
        jsFiles[file] = `${pathOrigin}${file}`;

      }
    } else if (path.extname(file) === "") {
      data += compileFiles(`${pathOrigin}${file}/`);
    }
  })
  return data
}

/**
 * Function trigger when html file was changed
 * @function
 * @param {string} [eventType] change or rename
 * @param {string} [filename]
 */
function watchFiles(eventType, filename){

  try {
    if(!watching){
      watching = true;
      let appPath = appHTMLPath;
      let files = htmlFiles;
      let newFileData;
      let regex;

      if(path.extname(filename) === '.js'){
        appPath = appJSPath;
        files = jsFiles;
      }

      let appData = fs.readFileSync(appPath, "utf-8");
      let filePath

      for (const key in files) {
        if(key === filename) {
          filePath = files[key];
          break;
        }
      }

      let name = filename.replace(path.extname(filename), '');

      if(path.extname(filename) === '.html'){

        newFileData = `<div data-id="${name}">${fs
            .readFileSync(filePath)
            .toString()}</div>`;

        regex = new RegExp(`<div data-id="${name}">(.*?)(?=<div data-id)`, 's');

      } else if(path.extname(filename) === '.js'){

        newFileData = `\/\/${filePath.replace(path.extname(filename), '')}\n
          ${fs.readFileSync(filePath).toString()}\n
          \/\/${filePath.replace(path.extname(filename), '')}\n`;

        regex = new RegExp(`\/\/${filePath.replace(path.extname(filename), '')}(.*?)${filePath.replace(path.extname(filename), '')}`, 's');
      }

      appData = appData.replace(regex, newFileData);
      logSys(`app${path.extname(filename)} update (${filename})`, 'success');
      fs.writeFileSync(appPath, appData);
      setTimeout(() => watching = false, 100);
    }
  } catch (error){
    logSys(error.message, 'error')
    logSys(error.stack, 'error')
  }
}

/**
 * Launch HTML and JS transpilation
 * @function
 * @param {string} [arg] watch or compress
 * @returns {Promise<void>}
 */
function compile(arg){

  logSys(`-------------------------------------------`, 'success');
  logSys(`---------- START COMPILE (${arg}) ----------`, 'success');
  logSys(`-------------------------------------------`, 'success');
  console.log();
  logSys(`---------- START ${arg} JS FILES -----------`, 'success');

  let jsData = process.argv.includes('--compress')
      ? Terser.minify(compileFiles(directoryJSPath)).code
      : compileFiles(directoryJSPath);

  fs.writeFile(appJSPath, jsData, 'utf-8', error => {
    if(error){
      logSys(error.message, 'error')
      logSys(error.stack, 'error')
    }
  })

  jsData = process.argv.includes('--compress')
      ? Terser.minify(compileFiles(path.join("components/ressources/js/"))).code
      : compileFiles(path.join("components/ressources/js/"));

  fs.appendFile(appJSPath, jsData, 'utf-8', error => {
    if(error){
      logSys(error.message, 'error')
      logSys(error.stack, 'error')
    }
  })

  console.log();
  logSys(`---------- START ${arg} HTML FILES -----------`, 'success');

  fs.writeFile(appHTMLPath, compileFiles(directoryHTMLPath), 'utf-8', error => {
    if(error){
      logSys(error.message, 'error')
      logSys(error.stack, 'error')
    }
  });

}

if (process.argv.includes("--watch")) {

  compile('WATCH');

} else if (process.argv.includes("--fonts")) {

  // TODO: Sortir ce code dans une fonction dédiée au fonts
  logSys("Import FONTS files", "info");
  fs.readdir("./components/assets/fonts", (error, files) => {
    if (error) {
      logSys(error.message, 'error')
      logSys(error.stack, 'error')
    }
    files.forEach((file) => {

      fs.copyFile(`./components/assets/fonts/${file}`, `./public/assets/fonts/${file}`, (error) => {
        err
            ? (logSys(error.message, 'error'), logSys(error.stack, 'error'))
            : logSys(`${file} was copied into public/assets/fonts`, "info");
      })
    })
  })
} else {
  await compile('COMPRESS');
}