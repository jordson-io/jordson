# Gestion d'envoi d'email transactionnel
> Il est possible d'envoyer un email transactionnel depuis un formulaire ou en direct via la fonction `sendEmail()`. Pour bien appréhender l'envoie d'email depuis un formulaire il est indispensable de bien connaitre le fonctionnement de ces derniers, voir la [documentation sur les formulaires](fr-fr/fonctionnalites/formulaires.md).

Le système d'envoi d'email est géré par le packet npm `nodemailer` [voir la documentation](https://nodemailer.com/about/).


## Localisation des fichiers

### Côté client
Gestion de l'action `sendEmail` à l'envoie d'un formulaire :
```
/app/client/form/actions.ts
```
Fonction `sendEmail()` qui génère la requête au serveur :
```
/app/client/email.ts
```

### Côté serveur
Configuration SMTP et adresses transactionelles :
```
/jordson.json
```
Récupération de la requête `sendEmail` :
```
server.js
```
Gestion et reponse de la requête `sendEmail` :
```
/app/server/email.js
```


## Configuration SMTP & Adresses email
Vous pouvez éditer la configuration email sur le fichier :
```
/jordson.json
```

Voici un exemple de configuration :
```json
"mail": {
  "SMTP": {
      "host": "smtp.domain.com",
      "port": "2525",
      "user": "userid",
      "pass": "password",
  },
  "address" : {
      "noreply": "ne-pas-repondre@jordson.io",
      "contact": "contact@jordson.io",
      "support": "support@jordson.io"
  }
},
```

Il se présente en deux partie, la première concerne le serveur SMTP :
```json
"SMTP": {
    "host": "smtp.domaine.com",       // Adresse du serveur SMTP
    "port": 2525,                     // Port du serveur SMTP
    "user": "userid",                 // Nom d'utilisateur du compte
    "pass": "password",               // Mot de passe du compte
  },
```
Tous les champs sont obligatoires, ils sont utiles pour le packet npm `nodemailer` [voir la doc](https://nodemailer.com/about/).

La seconde partie est dédiée aux adresses email utilisées par la methode `sendEmail` :
```json
"address" : {
  "noreply": "ne-pas-repondre@domaine.fr",    // Adresse pour indiquer qu'il n'y a pas de réponse possible à l'email
  "contact": "contact@domaine.fr",            // Adresse de contact général du site pour l'entreprise
  "support": "support@domaine.fr",            // Adresse de support technique
}
```
> Ces adresses sont liés à des clés qui seront utilisés par la fonction `sendEmail` côté client. Cela à pour but de maitriser les email utilisés.
> Il est fortement déconseillé de modifier ou supprimer les clés par défaut, à savoir `noreply`, `contact`, `support`. Vous pouvez néanmoins modifier les adresses liés à ces clés et/ou en créer de nouvelles.

Pour créer une nouvelle clé, il vous suffit de l'ajouter après `support` :
```json
{
    //...
    "support": "support@domaine.fr",
    "nouvel": "nouvel.email@domaine.fr",
}
```
> **Il s'agit d'un objet type JSON, la syntax est donc strict et nous souffre aucune erreur.**
> - La clé doit être écrite en minuscule, sans espace, 
sans accents, et avec guillemets. 
> - L'adresse email doit impérativement avoir des guillemets et la ligne doit se terminer par une virgule.


## Utilisation de la fonction sendEmail

Côté client vous pouvez appeler directement en javascript la fonction `sendEmail` en passant les arguments requis :
```javascript
sendEmail(data, from, to, subject, replyTo)
```

- **data [object]** : (requis) Contenu qui sera affiché dans le corps du message.
- **from [string]** : (requis) Clé de l'adresse email situé dans le fichier de configuration correspondant au champ "Expéditeur".
- **to [string]** : (requis) Clé de l'adresse email situé dans le fichier de configuration correspondant au champ "Déstinataire".
- **subject [string]** : (requis) Sujet de l'email.
- **replyTo [string]** : (facultatif) clé d'un élément de l'objet "data" correspondant à une adresse email pour le champ "Répondre à:".

Voici un exemple complet :
```javascript
sendEmail(
    {
        emailreplyto: "email@domaine.fr", 
        message: "Message complet pour le destinataire"
    }, 
    "site", 
    "contact", 
    "emailreplyto", 
    "Sujet de l'email" 
)
```


## Création d'un formulaire

En suivant ce chapitre vous allez pouvoir créer un formulaire totalement automatisé, vous n'aurez pas besoin de vous soucier de la 
gestion de la fonction `sendEmail()`.

Il est fortement conseillé de lire le chapitre sur les [formulaires](fr-fr/fonctionnalites/formulaires.md) pour bien comprendre toutes les fonctionnalités disponibles. Cependant elles ne sont pas obligatoires pour le bon fonctionnement de l'envoi par email.

Gardez à l'esprit que vous devez respecter les standards HTML5 pour éviter tout soucis.

Votre formulaire doit être composer d'une balise `<form></form>` et contenir un bouton de type `submit` avec les attributs suivants :

```html
<button type="submit"
        data-form-action="sendEmail"
        data-to="contact"
        data-from="site"
        data-replyTo="email"
        data-subject="[Formulaire de Contact]"
        class=""
        data-disable-class="">Envoyer</button>
```

- **data-form-action** : (requis) doit impérativement porter la valeur "sendEmail".
- **data-to** : Clé de l'email correspondant au destinataire (1)
- **data-from** : Clé de l'email correspondant à l'expéditeur (1)
- **data-replyTo** : (facultatif) Valeur `name` du champ (input) contenant l'email à utiliser pour répondre, dans cet exemple il s'agit du 
  champ `name="email"`. Si vous n'utilisez pas cet attribut il utilisera par défaut la valeur de `data-from`.
- **data-subject** : Le sujet de l'email.
- **data-disable-class** : Précisez les class CSS pour passer le bouton en mode "désactivé" le temps du traitement de l'email.

(1) : Vous pouvez trouver et/ou editer les clés d'email dans le fichier `/jordson.json`, voir également [Configuration SMTP & Adresses email](fr-fr/bien-commencer/configuration.md).


## Requête et Réponse du server

Lors de l'utilisation de la fonction `sendEmail()` une requête est effectué au serveur. Voici quelques précisions sur son fonctionnement.

> Avant tout il est recommandé d'utiliser la fonction `sendEmail()` uniquement pour un traitement depuis votre javascript. Si vous souhaitez passer par un formulaire, veuillez utiliser la [création d'un formulaire automatisé](/fr-fr/fonctionnalites/emails?id=cr%c3%a9ation-d39un-formulaire) pour des raisons de sécurité.

La fonction `sendEmail()` est asynchrone et retourne une chaine de caractères, soit 'success' soit 'rejected'.


## Problèmes & Questions

> Si vous rencontrez un problème ou si vous avez une question vous pouvez utiliser notre [système de ticket](https://github.com/jordson-io/jordson/issues).