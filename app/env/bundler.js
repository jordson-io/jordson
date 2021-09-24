#!/usr/bin/env node

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

import fs from "fs";
import path from "path";
import Terser from "terser";
import logSys from "./msgSystem.js";

const appHTMLPath = path.join("public/assets/app.html");
const directoryHTMLPath = path.join("src/components/");
const appJSPath = path.join("public/assets/app.js");
const appTSPath = path.join("public/assets/app-uncompiled.ts");
const directoryJSPath = path.join("app/client/");
let watching = false;
let htmlFiles = [];
let jsFiles = [];

/**
 * Transpilation HTML structures
 * @function
 * @param {string} [pathOrigin] Root folder for HTML files. Default value "src/components/"
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
    } else if (path.extname(file) === '.js' || path.extname(file) === '.ts'){

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

      if(path.extname(filename) === '.js' || path.extname(filename) === '.ts'){
        appPath = appTSPath;
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

      } else if(path.extname(filename) === '.js' || path.extname(filename) === '.ts'){

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
  logSys(`---------- START BUILD (${arg}) ----------`, 'success');
  logSys(`-------------------------------------------`, 'success');
  console.log();
  logSys(`---------- START ${arg} JS FILES -----------`, 'success');

  let jsData = process.argv.includes('--compress')
      ? Terser.minify(compileFiles(directoryJSPath)).code
      : compileFiles(directoryJSPath);

  fs.writeFile(appTSPath, jsData, 'utf-8', error => {
    if(error){
      logSys(error.message, 'error')
      logSys(error.stack, 'error')
    }
  })

  jsData = process.argv.includes('--compress')
      ? Terser.minify(compileFiles(path.join("src/js/"))).code
      : compileFiles(path.join("src/js/"));

  fs.appendFile(appTSPath, jsData, 'utf-8', error => {
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
  fs.readdir("./src/assets/fonts", (error, files) => {
    if (error) {
      logSys(error.message, 'error')
      logSys(error.stack, 'error')
    }
    files.forEach((file) => {

      fs.copyFile(`./src/assets/fonts/${file}`, `./public/assets/fonts/${file}`, (error) => {
        err
            ? (logSys(error.message, 'error'), logSys(error.stack, 'error'))
            : logSys(`${file} was copied into public/assets/fonts`, "info");
      })
    })
  })
} else {
  await compile('COMPRESS');
}