# Bundler JS/CSS/HTML

> Le Bundler vise à "compiler" les sources HTML, CSS et JS nécessaire au client pour faire tourner la Single Page Applications et les fonctionnalités eCommerces. Le HTML et le JS sont géré à 100% par Jordson et le CSS est quand à lui géré par le package NPM SASS. Le bundler permet également de créer une copie de vos images au format `webp`.

## Philosophie

Le but est non seulement de servir le client avec le fichiers nécessaires au fonctionnement de la Single Page Application mais aussi d'éviter de toucher au dossier `public/`. Vous ne devez travailler que dans le dossier `src/`.

## HTML & JS

### HTML

Les fichiers HTML qui sont situés dans le dossier (et sous dossiers) `src/` sont récupérés et compilés dans un seul fichier `public/assets/app.html`. Chaque fichier HTML est mis dans une balise `<div>` avec l'attribut `data-id="nomDuFichier"`. Le contenu de cette `<div>` est appelé par le routeur pour être affiché.

### JS

Les fichiers Javascript qui sont situés dans le dossier (et sous dossiers) `src/` sont récupérés et compilés avec les fichiers situés dans `app/client/` dans le fichier `public/assets/app.js`. Vous pouvez donc utiliser des fonctions et méthodes qui sont dans `app/client/` pour vos scripts JS situés dans `src/`.

## CSS

Pour le CSS c'est différents, c'est le fichier `src/sass/app.scss` qui sert au package NPM SASS de référence. Vous pouvez donc soit editer le fichier `src/sass/_custom.scss` qui est appelé par défaut, soit créé un nouveau fichier qui devra être importer dans `src/sass/app.scss`.

## Images

Il est fortement conseillé d'utiliser la fonctionnalité de compression webp pour vos images. Placez vos images dans le dossier `src/assets/images/` au format autre que webp, puis d'utiliser la commande `npm run cwebp`, qui va automatiquement copier vos images et une copie au format webp dans le dossier `public/assets/images/`.

> Il est important d'avoir un format non webp comme source (jpg ou png) afin d'avoir les deux alternatives pour votre site. En effet le navigateur Safari Desktop ne prend pas en compte le format webp, la balise `<picture>` vous permettra de pouvoir donner le choix au navigateur entre le webp si c'est possible ou non.

## Fonts

Vous pouvez placez vos fonts dans le dossier `src/assets/fonts/` puis faire la commande `npm run fonts` qui va copier les fichiers dans `public/assets/fonts`.

## Problèmes & Questions

> Si vous rencontrez un problème ou si vous avez une question vous pouvez utiliser notre [système de ticket](https://github.com/jordson-io/jordson/issues).