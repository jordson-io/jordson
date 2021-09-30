# Installation

> Avant de commencer l'installation je vous invite à vérifier que vous avez bien tous les [pré-requis](/fr-fr/bien-commencer/prerequis) au bon fonctionnement de Jordson.

## Récupérer les sources

``` 
git clone https://github.com/jordson-io/jordson.git 
```

## Installation des packets NPM

```
npm install
```

## Base de données

> Connectez vous à l'administration et créez un nouveau bucket ainsi qu'un nouvel utilisateur rattaché à ce bucket et conservez les de côté pour la configuration. Laissez le scope par défaut.

> Importer les documents dans les collections correspondantes situés dans `src/data`, par exemple `pages.json` dans la collection `pages`.

## Installer docsify (facultatif)

Vous pouvez installer docsify pour avoir la documentation disponible en local.

```
npm install -g docsify-cli
```

Lancer la documentation en localhost : `docsify serve docs`

## Problèmes & Questions

> Si vous rencontrez un problème ou si vous avez une question vous pouvez utiliser notre [système de ticket](https://github.com/jordson-io/jordson/issues).