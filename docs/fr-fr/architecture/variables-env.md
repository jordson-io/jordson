# Variables d'environnement jordson.json

Les variables d'environnement se trouvent dans `jordson.json` pour la production et `jordson.local.json` pour le développement. Les Variables d'Environnement servent principalement à la configuration mais également à la gestion des modules Jordson.

> Vous pouvez ajouter des données dans l'objet sans aucun problème, cependant ne supprimez ou modifiez pas les données déjà existantes si vous n'êtes pas sur.

## Récupérer les Variables

Pour récupérer les variables d'environnement dans le code Javascript côté serveur vous devez importer le fichier `loadConfig.mjs` :

```javascript
import loadConfig from "./loadConfig.mjs";

let gConfig = new loadConfig();
```

Pour récupérer une variable il vous suffit de l'appeler :
```javascript
gConfig.global.siteName //Retourne le nom du site
```


## Variables de Configuration

La configuration de Jordson est géré dans ce même fichier, il est recommandé de lire le chapitre dédié à la [configuration](/fr-fr/bien-commencer/configuration).

## Modules Jordson

**Non fonctionnel pour le moment**

La liste des modules Jordson sera stocké ici, afin de permettre d'intégrer les sources HTML/JS/CSS au projet.

## Problèmes & Questions

> Si vous rencontrez un problème ou si vous avez une question vous pouvez utiliser notre [système de ticket](https://github.com/jordson-io/jordson/issues).