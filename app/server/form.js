import fs from "fs";
import logSys from "../core/msgSystem.js";

const structureHTML = fs.readFileSync('public/assets/app.html', 'utf-8');

/**
 * TODO: Vérifier sur toutes les entitées précédement récupérées le type et les rules
 * TODO: Vérifier toutes les vulnérabilités possible sur TOUS les champs
 * TODO: Si tout est OK lancer la fonction relative à l'action du formulaire
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
        let regexForm = new RegExp(`<form(.*?)(</form>)`, 'gs');
        this.structurePage = structureHTML.match(regexPage)[0];
        this.structureForm = this.structurePage.match(regexForm)[this.formId];
    }

    check(data){

        let regexInput = new RegExp('<input(.*?)(>)', 'gs');
        let regexTextarea = new RegExp('<textarea(.*?)(</textarea>)', 'gs');
        let regexHoneypot = new RegExp('data-hnpt=', 'gs');
		let regexRemoveInput = new RegExp('data-input-remove', 'gs');
		let regexInputType = new RegExp('type="(.*?)(")', 'gs');
		let regexInputId = new RegExp('(id=")(.*?)(?=")');
		// let removeInputsId = [];
				
        this.inputs = this.structureForm.match(regexInput);
        this.textareas = this.structureForm.match(regexTextarea);
        
        for( let inputKey in this.inputs ){
            if(!this.inputs[inputKey].match(regexHoneypot) && !this.inputs[inputKey].match(regexRemoveInput)){
				let input = this.inputs[inputKey];
				console.log(input);
				if(input.match(regexInputType)){
                    let id = input.match(regexInputId)[2];
                    console.log(id);
					// this.checkTypeEmail(input, input.match(regexInputType)[0].replace('type="', '').replace('"', ''));
				}
            }
        }

		this.inputs = this.inputs.filter( (value, index) => {
			return removeInputsId.indexOf(index) == -1;
		});

		//TODO: Vérifier les vulnérabilités
		//TODO: Vérifier les types (email)

		// this.inputs.forEarch(input => {
		//   	console.log(input);
		// 	if(input.match(regexInputType) !== null){
		// 	    let id = input.match(regexInputId);
		// 	    console.log(id);
		// 		// console.log(this.checkTypeEmail(input, input.match(regexInputType)));
		// 	}
		// });

        this.textareas.forEach(textarea => {
            console.log(textarea);
        })

    }

	checkTypeEmail(inputData){
    	const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
		if(inputData.match(regex)){
		    return true;
        }else {
		    return false;
        }
	}

    action(type){

        //

    }

}
