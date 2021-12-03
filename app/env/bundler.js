#!/usr/bin/env node
'use strict'

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
import css from "css";
import path from "path";
import { minify } from "terser";
import { log } from "./logSystem.js";

const PATH_SRC_DIRECTORY = "src/";
const PATH_CLIENT_DIRECTORY = "app/client/";
const PATH_SRC_FONTS_DIRECTORY = "src/assets/fonts/";
const PATH_PUBLIC_FONTS_DIRECTORY = "public/assets/fonts/";
const PATH_APP_JS_FILE = "public/assets/app.js";
const PATH_APP_HTML_FILE = "public/assets/app.html";

let watching = false;
let htmlFiles = [];
let jsFiles = [];

const isHtmlFile = (file) => {
  return path.extname(file) === ".html";
};

const isJsFile = (file) => {
  return path.extname(file) === '.js';
};

const isDirectory = (file) => {
  return path.extname(file) === "";
};

const fileExtension = (file)=> {
  return path.extname(file);
};

const fileNameWithoutExt = ({file, extension}) => {
  return file.replace(extension, "");
};

const fileContent = (file) => {
  return fs.readFileSync(file).toString();
};

/**
 * Transpilation HTML/JS structures
 * @function
 * @param {string} [pathOrigin]
 * @param {string} [type] HTML or JS
 * @param data
 */
function compileFiles({pathOrigin, type, data = ''}) {

  const files = fs.readdirSync(pathOrigin);

  const isHtml = (file) => {
    return type === 'HTML' && isHtmlFile(file);
  };

  const isJs = (file) => {
    return type === 'JS' && (isJsFile(file));
  };

  const watchProcessEnable = () => {
    return process.argv.includes("--watch");
  };

  const watchFile = ({file, filesList}) => {
    fs.watch(pathOrigin + file, watchFiles);
    log.info(`${pathOrigin}${file}`);
    filesList[file] = `${pathOrigin}${file}`;
  };

  const addToData = (newData) => {
    data = data.concat(newData);
  };

  files.forEach(file => {

    if( isJs(file) || isHtml(file) ) {
      log.info(pathOrigin + file);
    }

    const fileName = isDirectory(file) ? null : fileNameWithoutExt({file: file, extension: fileExtension(file)});
    const fileContentString = isDirectory(file) ? null : fileContent(pathOrigin + file);


    if( isHtml(file) ) {

      const htmlData = `<div data-id="${ fileName }">${ fileContentString }</div>`;

      addToData(htmlData);

      if( watchProcessEnable() ) {
        watchFile({
          file: file,
          filesList: htmlFiles
        });
      }

    } else if( isJs(file) ) {

      const jsData = `//${ pathOrigin }${ fileName }\n
        ${ fileContentString }\n
        //${ pathOrigin }${ fileName }\n`;

      addToData(jsData);

      if( watchProcessEnable() ) {
        watchFile({
          file: file,
          filesList: jsFiles,
        });
      }

    } else if (isDirectory(file)) {

      const recursiveData = compileFiles({
        pathOrigin: `${pathOrigin}${file}/`,
        type: type
      });

      addToData(recursiveData);
    }
  })

  return data;
}

/**
 * Function trigger when html/js file was changed
 * @function
 * @param {string} [eventType] change or rename
 * @param {string} [filename]
 */
function watchFiles(eventType, filename){

  try {
    if(!watching){

      watching = true;

      const appPath = isJsFile(filename) ? PATH_APP_JS_FILE : PATH_APP_HTML_FILE;
      const files = isJsFile(filename) ? jsFiles : htmlFiles;
      let appData = fs.readFileSync(appPath, "utf-8");

      const updateData = ({ regexValue, regexFlag, newData }) => {
        const regex = new RegExp(regexValue, regexFlag);
        appData = appData.replace(regex, newData);
      };

      const filePath = () => {
        for (const key in files) {
          if(key === filename) {
            return files[key];
          }
        }
      }

      if( isHtmlFile(filename) ) {

        const fileName = fileNameWithoutExt({file: filename, extension: fileExtension(filename)});

        updateData({
          regexValue: `<div data-id="${ fileName }">(.*?)(?=<div data-id)`,
          regexFlag: 's',
          newData: `<div data-id="${ fileName }">${ fileContent( filePath() ) }</div>`
        });

      } else if( isJsFile(filename) ) {

        const fileName = fileNameWithoutExt({file: filePath(), extension: fileExtension(filename)})

        updateData({
          regexValue: `\/\/${ fileName }(.*?)${ fileName }`,
          regexFlag: 's',
          newData: `\/\/${ fileName }\n
            ${ fileContent( filePath() ) }\n
            \/\/${ fileName }\n`
        });
      }

      log.success(`app${ fileExtension(filename) } update (${ filename })`);
      fs.writeFileSync(appPath, appData);
      setTimeout(() => watching = false, 100);
    }
  } catch (error){
    log.error(error.message);
    log.error(error.stack);
  }
}

/**
 * Launch HTML and JS transpilation
 * @function
 * @param {string} [arg] watch or compress
 * @returns {Promise<void>}
 */
async function compile(arg){

  log.success(`-------------------------------------------`);
  log.success(`---------- START BUILD (${arg}) ----------`);
  log.success(`-------------------------------------------`);
  console.log();
  log.success(`---------- START ${arg} JS FILES -----------`);

  let jsData = process.argv.includes('--compress')
    ? (await minify(compileFiles({ pathOrigin: PATH_CLIENT_DIRECTORY, type: 'JS' }))).code
    : compileFiles({ pathOrigin: PATH_CLIENT_DIRECTORY, type: 'JS' });

  fs.writeFile(PATH_APP_JS_FILE, jsData, 'utf-8', error => {
    if(error){
      log.error(error.message);
      log.error(error.stack);
    }
  })

  jsData = process.argv.includes('--compress')
    ? (await minify(compileFiles({ pathOrigin: PATH_SRC_DIRECTORY, type: 'JS' }))).code
    : compileFiles({ pathOrigin: PATH_SRC_DIRECTORY, type: 'JS' });

  fs.appendFile(PATH_APP_JS_FILE, jsData, 'utf-8', error => {
    if(error){
      log.error(error.message);
      log.error(error.stack);
    }
  })

  console.log();
  log.success(`---------- START ${arg} HTML FILES -----------`);

  const HTMLdata = compileFiles({ pathOrigin: PATH_SRC_DIRECTORY, type: 'HTML'});

  fs.writeFile(PATH_APP_HTML_FILE, HTMLdata, 'utf-8', error => {
    if(error){
      log.error(error.message);
      log.error(error.stack);
    }
  });

  if(arg === 'COMPRESS') {
    console.log();
    log.success(`--------- START CLEAN APP.CSS FILE ----------`);

    let classes = [];
    let ids = [];
    const classRegex = new RegExp(`(?<= class=")(.*?)(?=")`, 'gm');
    const idRegex = new RegExp(`(?<= id=")(.*?)(?=")`, 'gm');

    HTMLdata.match(classRegex).forEach(element => {
      classes = classes.concat(element.split(' '));
    });

    classes = [...new Set(classes)].filter(Boolean);
    for (const key in classes) {
      if (Object.hasOwnProperty.call(classes, key)) {
        const element = classes[key];
        if(element.length !== 0) {
          classes[key] = '.' + element
        }
      }
    }

    ids = [...new Set(HTMLdata.match(idRegex))].filter(Boolean);
    for (const key in ids) {
      if (Object.hasOwnProperty.call(ids, key)) {
        const element = ids[key];
        ids[key] = '#' + element;
      }
    }

    // TODO: Add data-class in default css rules
    const cssRules = classes.concat([':root', '*', 'body', 'html', 'input', 'textarea', 'select', 'option', 'button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'p', 'div', 'span', 'ol', 'ul', 'li', 'img'])

    const cssParse = css.parse(fs.readFileSync('./public/assets/app.css').toString(), { source: './public/assets/app.css' });

    cssParse.stylesheet.rules.forEach(rules => {
      if(rules.type === 'rule') {
        cssRules.filter(element => {
          const index = rules.selectors.indexOf(element);
          if(index === -1) {
            cssParse.stylesheet.rules.splice(index, 1);
          }
        });
      }
    });

    const cssStringify = css.stringify(cssParse, { compress:true, sourcemap: true });

    fs.writeFile('./public/assets/app.css', cssStringify.code, 'utf-8', error => {
      if(error){
        log.error(error.message);
        log.error(error.stack);
      }
    });

    fs.writeFile('./public/assets/app.css.map', cssStringify.map.mappings, 'utf-8', error => {
      if(error) {
        log.error(error.message);
        log.error(error.stack);
      }
    })
  }
}

if (process.argv.includes("--watch")) {

  compile('WATCH');

} else if (process.argv.includes("--fonts")) {

  log.info("------- Import FONTS files -------");

  fs.readdir(PATH_SRC_FONTS_DIRECTORY, (error, files) => {
    if (error) {
      log.error(error.message)
      log.error(error.stack)
    }
    files.forEach((file) => {

      fs.copyFile(`${ PATH_SRC_FONTS_DIRECTORY }${ file }`, `${ PATH_PUBLIC_FONTS_DIRECTORY }${ file }`, (error) => {
        err
            ? (log.error(error.message), log.error(error.stack))
            : log.info(`${file} was copied into ${PATH_PUBLIC_FONTS_DIRECTORY}`);
      })
    })
  })
} else if (process.argv.includes("--compress")) {
  await compile('COMPRESS');
}
