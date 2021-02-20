#!/usr/bin/env node
import logSys from "./server/msgSystem.js";
import Terser from "terser";
import fs from "fs";
import path from "path";

const directoryHTMLPath = path.join("public/assets/structures.html");
let watching = false;
const scripts = [
  "app/client/_router.js",
  "app/client/events.js"
];
scripts.push("components/ressources/js/script.js");

/**
 * Transpilation HTML structures
 * @function
 * @param {string} [pathOrigin] Folder in "components/ressources/html/"
 * @returns {Promise<void>}
 */
async function compileHTMLFiles(pathOrigin = path.join("components/ressources/html/")) {
// TODO : Créer une variable structure et la remplir avec le html puis tout envoyer en un bloc sur le fichier
//  structure.html
  fs.readdir(pathOrigin, (e, files) => {

    if (e) logSys(e, "error");

    files.forEach((file) => {

      if (path.extname(file) === ".html") {

        fs.appendFileSync(
            directoryHTMLPath,
          `<div data-id="${file.replace(path.extname(file), "")}">${fs
            .readFileSync(pathOrigin + file)
            .toString()}</div>`,
          (err) => {
            logSys(err, "error");
          }
        );

        if (process.argv.includes("--watch")) {

          fs.watch(pathOrigin + file, watchHTMLFiles);
          logSys(`${pathOrigin}${file}`, 'info');

        }

      } else if (path.extname(file) === "") {

        compileHTMLFiles(`${pathOrigin}${file}/`);

      }
    })
  })
}

/**
 * Function trigger when html file was changed
 * @function
 * @param {string} [eventType] change or rename
 * @param {string} [filename]
 */
function watchHTMLFiles(eventType, filename){

  if(!watching){

    watching = true;

    let structure = fs.readFileSync(directoryHTMLPath, "utf-8");

    let fileName = filename.replace('.html', '');

    let newFileData = `<div data-id="${filename.replace(path.extname(filename), "")}">${fs
        .readFileSync(getHTMLFilesPath(fileName))
        .toString()}</div>`;

    let regex = new RegExp(`<div data-id="${fileName}">(.*)(?=<div data-id)`);

    structure = structure.replace(regex, newFileData);

    logSys(`structures.html update (${filename})`, 'success');

    fs.writeFileSync(directoryHTMLPath, structure);

    setTimeout(() => watching = false, 100);

  }

}

/**
 * Create and return the path of the current change file.
 * @function
 * @param {string} [fileSearch]
 * @param {string} [currentPath]
 * @returns {string|*}
 */
function getHTMLFilesPath(fileSearch, currentPath= path.join("components/ressources/html/")) {

  let files = fs.readdirSync(currentPath);

  for (let i in files) {

    let curFile = path.join(currentPath, files[i]);

    if (fs.statSync(curFile).isFile() && curFile === `${currentPath}/${fileSearch}.html`)
      return curFile;
    else if (fs.statSync(curFile).isDirectory())
      return getHTMLFilesPath(fileSearch, curFile);

  }
}

/**
 * Transpilation and watch JS files
 * @function
 * @returns {Promise<void>}
 */
async function compileJSFiles() {

  await writeCompileJSFile();

  if (process.argv.includes("--watch")) {

    scripts.forEach((file) => {

      fs.watch(file, writeCompileJSFile);
      logSys(file, "info");

    });

  }

}

/**
 * Write on the app.js file
 * @function
 * @param {string} [eventType]
 * @param {string} [filename]
 * @returns {Promise<void>}
 */
async function writeCompileJSFile(eventType = 'none', filename = 'none') {

  if(!watching){

    watching = true;

    const destinationFile = 'public/app.js';

    let dist = scripts.map((script) => fs.readFileSync(script, { encoding: "utf8" })).join("\n");

    if (process.argv.includes('--compress'))
      dist = Terser.minify(dist).code;

    fs.writeFileSync(destinationFile, dist);

    if(filename !== 'none')
      logSys(`app.js update (${filename})`, 'success');

    setTimeout(() => watching = false, 100);

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
  logSys(`---------- START COMPILE (${arg}) ----------`, 'success');
  logSys(`-------------------------------------------`, 'success');
  console.log();
  logSys(`---------- START ${arg} JS FILES -----------`, 'success');
  await compileJSFiles();
  console.log();
  logSys(`---------- START ${arg} HTML FILES -----------`, 'success');
  fs.writeFileSync(directoryHTMLPath, "", (e) => {
    logSys(e, "error");
  });
  await compileHTMLFiles();
}


if (process.argv.includes("--watch")) {

  await compile('WATCH');

} else if (process.argv.includes("--fonts")) {

  logSys("Import FONTS files", "info");

  fs.readdir("./components/assets/fonts", (e, files) => {

    if (e) logSys(e, "error");

    files.forEach((file) => {

      fs.copyFile(`./components/assets/fonts/${file}`, `./public/assets/fonts/${file}`, (err) => {
        err ? logSys(err, "error") : logSys(`${file} was copied into public/assets/fonts`, "info");
      })

    })
  })

} else {

  await compile('COMPRESS');

}
