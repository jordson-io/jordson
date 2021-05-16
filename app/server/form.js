import fs from "fs";
import logSys from "../core/msgSystem.js";

const structureHTML = fs.readFileSync('public/assets/app.html', 'utf-8');

/**
 * TODO: Récupérer l'id du formulaire basé sur le nom du fichier et sa place dans la liste des formulaire de la page (ex: contact-0)
 * TODO: Ouvrir le fichier via le nom de la page et récupérer le formulaire en regex.
 * TODO: Récupérer tous les INPUT et TEXTAREA en regex.
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
        let regexHoneypot = new RegExp('data-hnpt', 's')

        this.inputs = this.structureForm.match(regexInput);
        this.textareas = this.structureForm.match(regexTextarea);
        console.log(this.inputs)
        // this.inputs.forEach((input, index, object) => {
        //     if( input.match(regexHoneypot) !== null ){
        //         object.splice(index, 1);
        //     }
        // })

        // TODO: Fixer la suppression des honeypot du tableau this.inputs

        for( let inputKey in this.inputs ){
            if(this.inputs[inputKey].match(regexHoneypot) !== null){
                this.inputs.splice(inputKey, 1)
            }
        }

        this.textareas.forEach(textarea => {
            console.log(textarea);
        })
        console.log(this.inputs)

    }

    action(type){

        //

    }

}
