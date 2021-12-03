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

- Télécharger Couchbase Server Community Edition : [https://www.couchbase.com/downloads](https://www.couchbase.com/downloads)
- Documentation : [https://docs.couchbase.com/home/server.html](https://docs.couchbase.com/home/server.html)

1. Connectez vous à l'administration via l'adresse [http://localhost:8091](http://localhost:8091)

> Lors de votre première connexion Couchbase va vous faire créer le compte administrateur, surtout n'utilisez JAMAIS ces identifiants dans la configuration de JORDSON.

2. Vous pouvez créer un nouveau bucket via le menu à gauche "Buckets" puis le bouton en haut à droite "ADD BUCKET", vous pouvez nommer le nouveau bucket comme vous le souhaitez.

3. Une fois le bucket créé, cliquez sur "Scopes & Collections" à droite sur la ligne du nouveau bucket. Ensuite cliquez sur "Add Collection" sur la ligne du scope _default.

4. Importer les documents dans les collections correspondantes situés dans `src/data`, par exemple `pages.json` dans la collection `pages`.

> Pour importez une nouvelle collection vous pouvez cliquez sur "Import" au milieu de la navbar quand vous êtes dans le menu "Documents".
> Vérifier que le Keyspace est correctement rempli et que la bonne collection est selectionné.

## Installer docsify (facultatif)

Vous pouvez installer docsify pour avoir la documentation disponible en local.

```
npm install -g docsify-cli
```

Lancer la documentation en localhost : `docsify serve docs`

## Problèmes & Questions

> Si vous rencontrez un problème ou si vous avez une question vous pouvez utiliser notre [système de ticket](https://github.com/jordson-io/jordson/issues).
