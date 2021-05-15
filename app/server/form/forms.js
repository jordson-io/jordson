import fs from "fs";

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


}
