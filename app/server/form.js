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
        let regexTextarea = new RegExp(`<textarea(.*?)(</textarea>)`, 'gs');
        let regexHoneypot = new RegExp('data-hnpt=', 'gs');
				let regexRemoveInput = new RegExp('data-input-remove', 'gs');
				let removeInputsId = [];
				
        this.inputs = this.structureForm.match(regexInput);
        this.textareas = this.structureForm.match(regexTextarea);
        
        for( let inputKey in this.inputs ){
            if(this.inputs[inputKey].match(regexHoneypot) !== null || this.inputs[inputKey].match(regexRemoveInput) !== null){
							  removeInputsId.push(Number(inputKey));
            }
        }

				this.inputs = this.inputs.filter( (value, index) => {
						return removeInputsId.indexOf(index) == -1;
				});

				//TODO: Vérifier les vulnérabilités
				//TODO: Vérifier les types (email)

				this.inputs.forEarch(input => {
				  	console.log(input);
				});

        this.textareas.forEach(textarea => {
            console.log(textarea);
        })

    }

    action(type){

        //

    }

}
