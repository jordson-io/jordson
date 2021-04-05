# Notifications
Système de notification automatisé, utilisez les notifications par défaut de Jordson ou créez vos propres notifs.

## Sommaire
 - [Localisation des fichiers](#localisation-des-fichiers)
 - [Créer une nouvelle notification](#crer-une-nouvelle-notification)
 - [Éditer les notification de bases](#diter-les-notification-de-bases)
 - [Afficher une notification](#afficher-une-notification)
 - [Cacher une notification](#cacher-une-notification)
 - [Problèmes & Questions](#problmes--questions)

---
## Localisation des fichiers

Fonctions JS relatives aux notifications :
```
/app/client/notification.js
```

Structures HTML des notifications par défaut : 
```
/components/ressources/html/parts/notifications
```

---
## Créer une nouvelle notification

Pour créer une nouvelle notification il vous suffit de créer un nouveau fichier `.html` avec la nomenclature suivante :
```
nom.notif.html
```

Le nom du fichier à une importance capitale, décomposons l'exemple ci-dessus :

- `nom` : Est le nom du type de notification qui sera utilisé pour l'afficher.

- `.notif` : Permet à Jordson de savoir qu'il s'agit d'une notification et d'y appliquer les fonctions associées.
- `.html` : L'extension du fichier.

Les notifications par défaut de Jordson sont placées dans le dossier :
```
/components/ressources/html/parts/notifications
```

Néanmoins vous pouvez placer vos nouvelles notifications n'importe ou dans le dossier :
```
/components/ressources/html
```
(y compris dans des sous dossiers de celui-ci)

La structure du fichier HTML importe peu, néanmoins il doit contenir deux attribues indispensable : 
- `data-title` : Pour afficher le titre de la notification.
- `data-message` : Pour afficher le message de la notification.

Par exemple dans ce code à la ligne 5 et 6 :
```html
<div class="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md fixed top-14 right-4 z-40 cursor-pointer">
    <div class="w-2 bg-gray-80"></div>
    <div class="flex items-center px-2 py-3">
        <div class="mx-3">
            <span data-title class="font-semibold text-gray-500"></span>
            <p data-message class="text-gray-600 dark:text-gray-200"></p>
        </div>
    </div>
</div>
```
Vous pouvez désormais [Afficher votre notification](#afficher-une-notification)

---
## Éditer les notification de bases
Pour éditer les notifications de bases de Jordson, rendez-vous dans le dossier :
```
/components/ressources/html/parts/notifications
```

>*Il est fortement déconseillé de modifier le nom de ces fichiers, sans quoi les notifications par défaut ne serai plus accessible pour 
> les fonctionnalités de base de Jordson.*
 
Vous pouvez modifier à votre guise la structure HTML, cependant il est impératif de conserver les deux attribus suivants :
- `data-title` : Pour afficher le titre de la notification.
- `data-message` : Pour afficher le message de la notification.

Par exemple dans ce code à la ligne 5 et 6 :
```html
<div class="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md fixed top-14 right-4 z-40 cursor-pointer">
    <div class="w-2 bg-gray-80"></div>
    <div class="flex items-center px-2 py-3">
        <div class="mx-3">
            <span data-title class="font-semibold text-gray-500"></span>
            <p data-message class="text-gray-600 dark:text-gray-200"></p>
        </div>
    </div>
</div>
```

## Afficher une notification
Pour afficher une notification il suffit d'utiliser la fonction Javascript suivante :
```javascript
showNotification('Message envoyé avec succès', 'succes');
```

### Structure de l'appel de notification
`showNotification()` est composé de 4 paramètres maximum, définit dans l'ordre suivant :
- Message à afficher dans la notification *(chaine de caractères)*.
- Type de notification, définit par le nom du fichier `.notif.html` correspondant *(chaine de caractères)*.
- Titre de la notification *(chaine de caractères)*.
- Masquer automatiquement la notif après 5 secondes, actif par défaut *(booléen)*.

Si vous ne précisez que le paramètre message, dans ce cas Jordson prendra le type de notification par défaut. Qui est le type `default`.

### Les notifications de bases de Jordson
Jordson gère automatiquement 5 types de notifications :
 - Default
 - Success
 - Info
 - Warning
 - Error

Ces notifications ont des titres automatiques par défaut, par exemple pour la notification "Info", s'affiche avec la 
fonction suivante :
```javascript
showNotification('Message informatif', 'info');
```
Il remplira automatiquement le titre par `Info` si vous ne précisez pas le titre. Vous pouvez définir un titre de notification différent 
comme ceci :
```javascript
showNotification('Message informatif', 'info', 'Titre Informatif');
```

### Les notifications personalisées
Si vous avez créé un nouveau type de notification (voir [Créer une nouvelle notification](#crer-une-nouvelle-notification)) dans ce cas vous pouvez l'afficher en 
précisant le type qui correspond au nom de votre fichier `.notif.html`.

Par exemple, si votre nouvelle notification est enregistré sous le nom :
```
download.notif.html
```
vous pourrez afficher votre notification avec la fonction suivante :
```javascript
showNotification('Message de la notif', 'download', 'Titre de la notif');
```

---

## Cacher une notification
Dans le cas ou vous souhaiteriez cacher une notification il suffit d'utiliser la fonction javascript suivante :
```javascript
hideNotification('info');
```
Cette fonction ne dispose que d'un seul paramètre qui est le type de notification à masque.

---

## Problèmes & Questions
Si vous rencontrez un problème ou si vous avez une question sur les notifications vous pouvez le utiliser notre [système de ticket]().