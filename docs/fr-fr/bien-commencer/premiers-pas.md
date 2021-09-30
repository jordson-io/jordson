# Premiers Pas

> Après avoir installé les pré-requis, créé et configuré un nouveau projet Jordson vous devez lancer la commande `npm run dev` une première fois avant de lancer le serveur.

## Accéder au site

- **Lancer le serveur** - `npm run start`
- **Compiler les sources** - `npm run dev` ou `npm run watch`
- **Accéder au site** - [https://localhost:4004](https://localhost:4004)

## Les Pages

### Modifier une page

> Rendez vous dans le dossier `src/pages` et éditez le fichier `home.html` (par exemple), si vous avez lancé la commande `npm run watch` il vous suffit de sauvegarder vos changements et de recharger la page d'acceuil, sinon relancez la commande `npm run dev` avant de rafraichir la page.

### Créer une nouvelle page

> Pour l'exemple nous allons créer une page `Livraison`.

**1. Créer la source :**
Créez un nouveau fichier HTML dans le dossier `src/pages` nommé `shipping.html` et remplissez le avec votre code HTML.

**2. Configurer la base de données :**
Rendez-vous sur votre dashboard Couchbase et dans la collection `pages` ajouté un nouveau document.
```json
{
  "fileName": "shipping",
  "slug": "livraison",
  "title": "JORDSON - Modes de livraison"
}
```

**3. Accéder à la nouvelle page :** Relancez `npm run watch` ou `npm run dev` avant d'accéder à votre nouvelle page : [https://localhost:4004/livraison](https://localhost:4004/livraison)

## Problèmes & Questions

> Si vous rencontrez un problème ou si vous avez une question vous pouvez utiliser notre [système de ticket](https://github.com/jordson-io/jordson/issues).
