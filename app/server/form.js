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
import Email from "./email.js";

const structureHTML = fs.readFileSync('public/assets/app.html', 'utf-8');

/**
 * TODO: Vérifier toutes les vulnérabilités possible sur TOUS les champs
 */

/**
 * Manage Forms
 * @class
 */
export default class Form {

    constructor(id) {
        this.filename = id.split('|')[0];
        this.formId = Number(id.split('|')[1]);
        let regexPage = new RegExp(`<div data-id="${this.filename}">(.*?)(?=<div data-id)`, 's');
        this.structurePage = structureHTML.match(regexPage)[0];
        this.structureForm = this.structurePage.match(/<form(.*?)(<\/form>)/gs)[this.formId];
    }

    check(data){
        this.inputs = this.structureForm.match(/<input(.*?)(>)/gs);
        this.textareas = this.structureForm.match(/<textarea(.*?)(<\/textarea>)/gs);

        for( let inputKey in this.inputs ){
            if(!this.inputs[inputKey].match(/data-hnpt=/gs) && !this.inputs[inputKey].match(/data-input-remove/gs)){
				let input = this.inputs[inputKey];
				let inputType = input.match(/(?<=type=(['"])).*(?=\1)/gs)[0];
				if(inputType){
                    let id = input.match(/(?<=id=(['"])).*(?=\1)/)[0];
                    switch (inputType) {
                        case "email":
                            if(!this.checkTypeEmail(data[id]))
                                return false;
                            break;
                    }
				}
            }
        }

        this.textareas.forEach(textarea => {
            // console.log(textarea);
        })

        return this.action(this.structureForm.match(/(?<=data-form-action=(['"])).*?(?=\1)/g)[0], data);
    }

	checkTypeEmail(inputData){
		if(inputData.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i)){
		    return true;
        }else {
		    return false;
        }
	}

    async action(type, data){

        switch (type) {
            case "sendEmail":
                data.from =  this.structureForm.match(/(?<=data-from=)(['"]).*1/)[0];
                data.to = this.structureForm.match(/(?<=data-to=(['"])).*(?=\1)/)[0];
                data.replyto = this.structureForm.match(/(?<=data-replyto=(['"])).*(?=\1)/)[0];
                data.subject = this.structureForm.match(/(?<=data-subject=(['"])).*(?=\1)/)[0];

                const email = new Email();
                if(await email.send(data) === 'success'){
                    return true
                } else {
                    return false
                }
        }
    }
}
