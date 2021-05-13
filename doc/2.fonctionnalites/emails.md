# Gestion d'envoi d'email transactionnel
Il est possible d'envoyer un email transactionnel depuis un formulaire ou en direct via la fonction `sendEmail()`. Pour bien appréhender l'envoie d'email depuis un formulaire il est indispensable de bien connaitre le fonctionnement de ces derniers 
[documentation sur les formulaire](/#fonctionnalites_formulaires).

Le système d'envoi d'email est géré par le packet npm `nodemailer` [voir la documentation](https://nodemailer.com/about/).

---
## Sommaire
- [Localisation des fichiers](#localisation-des-fichiers)
- [Configuration SMTP & Adresses email](#configuration-smtp--adresses-email)
- [Utilisation de la fonction sendEmail](#utilisation-de-la-fonction-sendemail)

---
## Localisation des fichiers

### Côté client
Gestion de l'action `sendEmail` à l'envoie d'un formulaire :
```
/app/client/form/actions.js
```
Fonction `sendEmail()` qui génère la requête au serveur :
```
/app/client/email.js
```

### Côté serveur
Configuration SMTP et adresses transactionelles :
```
/app/server/config.js
```
Récupération de la requête `sendEmail` :
```
server.js
```
Gestion et reponse de la requête `sendEmail` :
```
/app/server/email.js
```

---
## Configuration SMTP & Adresses email
Vous pouvez éditer la configuration email sur le fichier :
```
/app/server/config.js
```

Voici un exemple de configuration :
```javascript
mail: {
    host: "smtp.domaine.com",       // Adresse du serveur SMTP
    port: 2525,                     // Port du serveur SMTP
    user: "userid",                 // Nom d'utilisateur du compte
    pass: "password",               // Mot de passe du compte
    address : {
      noreply: "ne-pas-repondre@domaine.fr",    // Adresse pour indiquer qu'il n'y a pas de réponse possible à l'email
      site: "site@domaine.fr",                  // Adresse pour définir la provenance de l'email
      contact: "contact@domaine.fr",            // Adresse de contact général du site pour l'entreprise
      support: "support@domaine.fr",            // Adresse de support technique
    }
  },
```

Il se présente en deux partie, la première concerne le serveur SMTP :
```javascript
mail: {
    host: "smtp.domaine.com",       // Adresse du serveur SMTP
    port: 2525,                     // Port du serveur SMTP
    user: "userid",                 // Nom d'utilisateur du compte
    pass: "password",               // Mot de passe du compte
  },
```
Tous les champs sont obligatoires, ils sont utiles pour le packet npm `nodemailer` [voir la doc](https://nodemailer.com/about/).

La seconde partie est dédiés aux adresses email utilisé par la methode `sendEmail` :
```javascript
mail: {
    address : {
      noreply: "ne-pas-repondre@domaine.fr",    // Adresse pour indiquer qu'il n'y a pas de réponse possible à l'email
      site: "site@domaine.fr",                  // Adresse pour définir la provenance de l'email
      contact: "contact@domaine.fr",            // Adresse de contact général du site pour l'entreprise
      support: "support@domaine.fr",            // Adresse de support technique
    }
  },
```
Ces adresses sont liés à des clés qui seront utilisés par les fonctions côté client. Cela à pour but de maitriser les email utilisés.
Il est fortement déconseillé de modifier ou supprimer les clés par défaut, à savoir `noreply`, `site`, `contact`, `support`. Vous pouvez 
néanmoins modifier les adresses liés à ces clés et/ou en créer de nouvelles.

Pour créer une nouvelle clé, il vous suffit de l'ajouter après `support` :
```javascript
{
    //...
    support: "support@domaine.fr",
    nouvellecle: "nouvel.email@domaine.fr",
}
```
Il s'agit d'un objet type JSON, la syntax est donc strict et nous souffre aucune erreur. La clé doit être écrite en minuscule, sans espace, 
sans accents, et sans guillemets. L'adresse email doit impérativement avoir des guillemets et la ligne doit se terminer par une virgule.

---
##Utilisation de la fonction sendEmail
Côté client vous pouvez appeler directement en javascript la fonction `sendEmail` en passant les arguments requis :
```javascript
sendEmail( data, from, to, subject, honeypots )
```