# Configuration

> Vous pouvez configurer votre projet Jordson via le fichier de variables d'environnement, si vous êtes sur votre environnement de developpement vous devez éditer le fichier `jordson.local.json`. Si vous êtes en production il vous suffit de supprimer le fichier `jordson.local.json` pour que le fichier `jordson.json` soit utilisé.

## Général

```json
"global": {
    "siteName": "JORDSON",
    "domain": "jordson.fr",
    "email_admin": "admin@jordson.io",
    "port": 4003
  },
```

- `siteName` - Nom du site web (pour le title par exemple)
- `domain` - Nom de domaine du site
- `email_admin` - Email de l'administrateur pour les messages techniques
- `port` - Le port utilisé par le serveur NodeJS

## Base de données

```json
"db": {
    "uri": "couchbase://127.0.0.1",
    "bucket": "jordson",
    "username": "jordson",
    "password": "jordson",
    "publicCollections": ["pages"]
  },
```

- `uri` - Uri de la base de données, en local par défaut.
- `bucket` - Nom du bucket dédié au projet.
- `username` - Nom de l'utilisateur couchbase (no pas utiliser le root).
- `password` - Mot de passe de l'utilisateur couchbase.
- `publicCollections` - La liste des collections qui sont autorisées à être récupérées par le client.

## SMTP & Adresses

```json
"mail": {
    "SMTP": {
        "host": "",
        "port": "",
        "user": "",
        "pass": "",
    },
    "address" : {
        "noreply": "ne-pas-repondre@jordson.io",
        "contact": "contact@jordson.io",
        "support": "support@jordson.io"
    }
  },
```

- `SMTP` - Serveur SMTP
    - `host` - Host serveur SMTP
    - `port` - Port serveur SMTP
    - `user` - Utilisateur serveur SMTP
    - `pass` - Mot de passe serveur SMTP
- `address` - Adresses par défaut
    - `noreply` - Adresse utilisé pour les emails transactionnels qui n'attendent pas de réponse.
    - `contact` - Adresse utilisé pour contacter le propriétaire du site.
    - `support` - Adresse utilisé pour le support technique du site.

## MimeTypes

```json
"mimeTypes": {
    "html": "text/html",
    "js": "text/javascript",
    "css": "text/css",
    "json": "application/json",
    "png": "image/png",
    "jpg": "image/jpg",
    "gif": "image/gif",
    "svg": "image/svg+xml",
    "wav": "audio/wav",
    "mp4": "video/mp4",
    "woff": "application/font-woff",
    "ttf": "application/font-ttf",
    "eot": "application/vnd.ms-fontobject",
    "otf": "application/font-otf",
    "wasm": "application/wasm"
  }
```
- `mimeTypes` - Liste des extensions autorisées par le serveur, [plus d'infos sur les mimeTypes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types).

## Problèmes & Questions

> Si vous rencontrez un problème ou si vous avez une question vous pouvez utiliser notre [système de ticket](https://github.com/jordson-io/jordson/issues).