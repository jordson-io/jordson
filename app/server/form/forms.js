import fs from "fs";
import sha256 from "./encode.js"

const structureHTML = fs.readFileSync('public/assets/app.html', 'utf-8');

/**
 * Manage Forms
 * @class
 */
export default class Form {

    async cfi(data) {
        let resData = JSON.parse(data);

        let regexDataId = new RegExp(`<div data-id="${resData.dataId}">(.*?)(?=<div data-id)`, 's');
        let regexForm = new RegExp(`<form(.*?)(</form>)`, 's');
        let page = regexDataId.exec(structureHTML);

        let cfiCheck = false;
        let forms = JSON.stringify(page).match(regexForm);

        forms.forEach(form => {

            let hashForm = sha256(form.split(' ').join('')
                .replace('/>', '>')
                .replace(/\\n/g, '')
                .replace(/\\b/g, '')
                .replace(/\\f/g, '')
                .replace(/\\r/g, '')
                .replace(/\\v/g, '')
                .replace(/\\s/g, '')
                .replace(/\\t/g, '')
                .replace(/\\/g, '')
                .replace(/=""/g, ''));


            if(hashForm === resData.hashForm){
                cfiCheck = true;
            }
        })

        return cfiCheck.toString();
    }
}
