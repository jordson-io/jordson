# Structure des Dossiers

> Le projet est basé sur un système simple de dossier, voici comme il fonctionne.

* /app
    * /client
    * /env
    * /server
* /docs
* /public
    * /assets
* /src
    * /assets
    * /components
    * /data
    * /js
    * /pages
    * /sass

## /app

> Le dossier /app contient toute la logique du framework, que ce soit pour le client, le serveur ou même l'environnement de développement. Vous pouvez consulter ces fichiers pour mieux appréhender Jordson mais il est fortement déconseillé de modifier les fichiers et dossiers situés dans /app et ce afin de permettre les mises à jours futures.

### app/client

Ce dossier contient toute la logique côté client, avec principalement le routeur de SPA et quelques fonctionnalités de bases.

### app/env

Le dossier /env contient toute la logique nécessaire pour faire fonctionner l'environnement de développement, avec notemment le bundler qui permet de transpiler les fichiers dédiés au client dans le dossier /public

### app/server

Toutes les fonctionnalités côté serveur, avec principalement les fonctions pour le traitements des requêtes spécifiques.

---

## /docs

> Dossier contenant la documentation complète de Jordson, vous pouvez lancez la doc en local via `docsify serve docs` après avoir au préalable installé le package `npm i docsify-cli -g`.

---

## /public

> Ici pas de modification manuelle, tout est transpilé depuis le dossier /src. C'est le dossier qui sera servit au client.

### public/assets

Contient l'ensemble des assets transpilés depuis sources, que ce soit les images, les fonts, le fichier app.html, app.js et app.css.

## /src

> Le dossier /src est votre zone de travail, c'est ici que vous allez pouvoir créer de nouveaux conponents, ajouter vos images, gérer votre javascript et sass.

### src/assets

Ici vous allez retrouver toutes les ressources du site. Les images, les fonts et tout contenus personnalisé.

### src/components

Ce dossier est assez essentiel, vous allez pouvoir créer des composants de votre projet, c'est ici que ce trouve également les composants natifs comme les notifications par exemple.

### src/data

Un bien beau dossier qui va contenir les collections au format JSON, principalement pour les données initiales c'est également dans ce dossier que par défaut les backups de la base de données sera stocké.

### src/js

Tous les fichiers JS/TS pour créer des fonctionnalités personnalisé pour le projet en cours. Vous pouvez utiliser toutes les fonctions et variables globales qui sont dans app/client.

### src/pages

Tous les fichiers HTML des pages sont stockés ici et transpilé dans /public/assets/app.html avec le reste des fichiers HTML présents dans /src.

### src/sass

Tous les fichiers SASS pour le site qui seront transpilé dans /public.