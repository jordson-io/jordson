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
import { minify } from "terser";
import logSys from "./msgSystem.js";
import css from "css";

const sourceDirectoryPath = path.join("src/");
const publicAppHTMLPath = path.join("public/assets/app.html");
const publicAppJSPath = path.join("public/assets/app.js");
const appClientJSPath = path.join("app/client/");
let watching = false;
let htmlFiles = [];
let jsFiles = [];


/**
 * Transpilation HTML structures
 * @function
 * @param {string} [pathOrigin]
 * @param {string} [type] HTML or JS
 * @param data
 */
function compileFiles(pathOrigin, type, data = '') {

  let files = fs.readdirSync(pathOrigin)

  files.forEach(file => {
    if (type === 'HTML' && path.extname(file) === ".html") {

      data += `<div data-id="${file.replace(path.extname(file), "")}">
        ${fs.readFileSync(pathOrigin + file).toString()}</div>`;

      if (process.argv.includes("--watch")) {

        fs.watch(pathOrigin + file, watchFiles);
        logSys(`${pathOrigin}${file}`, 'info');
        htmlFiles[file] = `${pathOrigin}${file}`;

      }
    } else if (type === 'JS' && (path.extname(file) === '.js')){

      data += `//${pathOrigin}${file.replace(path.extname(file), "")}\n
      ${fs.readFileSync(pathOrigin + file).toString()}\n
      //${pathOrigin}${file.replace(path.extname(file), "")}\n`;

      if (process.argv.includes("--watch")) {

        fs.watch(pathOrigin + file, watchFiles);
        logSys(`${pathOrigin}${file}`, 'info');
        jsFiles[file] = `${pathOrigin}${file}`;

      }
    } else if (path.extname(file) === "") {
      data += compileFiles(`${pathOrigin}${file}/`, type);
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
async function compile(arg){

  logSys(`-------------------------------------------`, 'success');
  logSys(`---------- START BUILD (${arg}) ----------`, 'success');
  logSys(`-------------------------------------------`, 'success');
  console.log();
  logSys(`---------- START ${arg} JS FILES -----------`, 'success');

  let type = 'JS'

  let jsData = process.argv.includes('--compress')
      ? (await minify(compileFiles(appClientJSPath, type))).code
      : compileFiles(appClientJSPath, type);

  fs.writeFile(publicAppJSPath, jsData, 'utf-8', error => {
    if(error){
      logSys(error.message, 'error')
      logSys(error.stack, 'error')
    }
  })

  jsData = process.argv.includes('--compress')
      ? (await minify(compileFiles(sourceDirectoryPath, type))).code
      : compileFiles(sourceDirectoryPath, type);

  jsData = compileFiles(sourceDirectoryPath, type);

  fs.appendFile(publicAppJSPath, jsData, 'utf-8', error => {
    if(error){
      logSys(error.message, 'error')
      logSys(error.stack, 'error')
    }
  })

  console.log();
  logSys(`---------- START ${arg} HTML FILES -----------`, 'success');

  type = 'HTML'
  let HTMLdata = compileFiles(sourceDirectoryPath, type);

  fs.writeFile(publicAppHTMLPath, HTMLdata, 'utf-8', error => {
    if(error){
      logSys(error.message, 'error')
      logSys(error.stack, 'error')
    }
  });

  if(arg === 'COMPRESS') {
    console.log();
    logSys(`--------- START CLEAN APP.CSS FILE ----------`, 'success');

    // TODO: Add ids
    // TODO: Refacto and clean the code

    let classes = [];
    let ids = [];
    let classRegex = new RegExp(`(?<= class=")(.*?)(?=")`, 'gm');
    let idRegex = new RegExp(`(?<= id=")(.*?)(?=")`, 'gm');

    HTMLdata.match(classRegex).forEach(element => {
      classes = classes.concat(element.split(' '));
    });

    classes = [...new Set(classes)]
    for (const key in classes) {
      if (Object.hasOwnProperty.call(classes, key)) {
        const element = classes[key];
        classes[key] = '.' + element
      }
    }
    classes = classes.concat([':root', '*', 'body', 'html'])

    ids = [...new Set(HTMLdata.match(idRegex))];

    const cssParse = css.parse(fs.readFileSync('./public/assets/app.css').toString(), { source: './public/assets/app.css' });

    cssParse.stylesheet.rules.forEach(rules => {
      if(rules.type === 'rule') {
        classes.filter(element => {
          const index = rules.selectors.indexOf(element);
          if(index === -1) {
            cssParse.stylesheet.rules.splice(index, 1);
          }
        })
      }
    });

    const cssStringify = css.stringify(cssParse, { compress:true, sourcemap: true });

    fs.writeFile('./public/assets/app.css', cssStringify.code, 'utf-8', error => {
      if(error){
        logSys(error.message, 'error')
        logSys(error.stack, 'error')
      }
    });

    fs.writeFile('./public/assets/app.css.map', cssStringify.map.mappings, 'utf-8', error => {
      if(error) {
        logSys(error.message, 'error');
        logSys(error.stack, 'error');
      }
    })
  }
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
} else if (process.argv.includes("--compress")) {
  await compile('COMPRESS');
}
