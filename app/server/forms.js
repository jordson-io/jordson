import logSys from "./msgSystem.js";
import fs from "fs";
import crypto from "crypto";

const structureHTML = fs.readFileSync('public/assets/structures.html');

/**
 * Manage Forms
 * @class
 */
export default class Form {
    // constructor() {
    //
    // }

    async cfi(data) {
        // logSys(data, 'debug');
        let resData = JSON.parse(data);
        let dataId = resData.dataId;
        let hashForm = resData.hashForm;

        logSys(hashForm, 'debug')

        let regexDataId = new RegExp(`<div data-id="${resData.dataId}">(.*?)(?=<div data-id)`, 's');
        let regexForm = new RegExp(`<form(.*?)(</form>)`, 's');
        let page = regexDataId.exec(structureHTML);

        let forms = JSON.stringify(page).match(regexForm);
        forms.forEach(form => {
            console.log(typeof form);
            let hash = crypto.createHash('sha256');
            let formHash = hash.update(form);
            console.log(formHash.digest('hex'));
        })

        // TODO: Créer une fonction de hashage identique côté client et serveur pour avoir le même résultat des deux côté.
        // logSys(dataId, 'debug');
        // logSys(sha512, 'debug');



    }
}
