# Formulaires

> Afin de simplifier l'utilisation des formulaires, Jordson à mis en place l'usage des `data attribute` afin de permettre l'activation des fonctionnalités liées.

## Traitements

### Côté Client

Lors du "click" sur un bouton `submit` la fonction `checkFormRules()` est activé afin de permettre de vérifier que le formulaire à envoyé est conforme aux règles établis. Par exemple il vérifie que les champs `required` ne sont pas vides, que les champs de types `email` ont bien une adresse email valide...

Une fois le formulaire "vérifié", la fonction récupère la valeur de l'attribut `data-form-action` afin de déclencher la fonction lié à cette action. Par exemple : `data-form-action="sendEmail"`.

> Certains formulaires nécessite des attributs particuliers pour fonctionner, vous pouvez en voir un exemple sur le [formulaire de contact](fr-fr/fonctionnalites/emails?id=création-d39un-formulaire).


### Côté serveur

Lors de la réception de la requête, le serveur va aller chercher le formulaire dans les fichiers sources et procéder à la vérification des règles de chaque champ du formulaire afin de s'assurer que l'on reçois bien les bonnes informations au format attendu avant de traiter le formulaire.

Une fois la vérification validé, le serveur appel la fonction qui va traiter l'action attendu par le formulaire. Par exemple pour l'action `sendEmail` il va utiliser les champs et attributs du formulaire pour envoyer un email.

## HoneyPot

> Il n'existe pas de petite protection, et celle ci est la plus basique mais également l'une des plus pratique pour filtrer les robots "basiques".

Vous pouvez créer un ou plusieurs champ `input` de type texte, il peut être `required` ou non, vide ou rempli. Il vous suffit ensuite de rajouter l'attribut `data-hnpt` avec en valeur la valeur du champs tel quelle est attendue.

Par exemple si vous voulez que le champs soit vide :
```html
<input id="fakeInput"
    name="fakeInput"
    type="text"
    data-hnpt=""
    placeholder="My placeholder">
```

et si au contraire vous attendez une valeur spécifique, les champs `data-hnpt` et `value` doivent être identiques :

```html
<input id="fakeInput"
    name="fakeInput"
    type="text"
    data-hnpt="my value"
    value="my value"
    placeholder="My placeholder">
```

> Les champs contenant l'attribut `data-hnpt` ne sont pas envoyés aux serveurs, ils sont filtrés avant l'envoie afin de ne pas encombrer l'envoie de la requête.

## Gestion des erreurs

Vous pouvez gérer les erreurs directement depuis le fichier HTML, pour cela il vous suffit d'appeler un élément HTML à l'endroit ou vous voulez afficher l'erreur avec l'attribut `data-error-for` ayant pour valeur l'id du champ correspondant.

```html
<span class="text-sm text-red-500" data-error-for="inputId"></span>
```

Vous pouvez également ajouter des classes CSS sur le champ qui a detecté une erreur en ajoutant l'attribut `data-error-class` sur le champ visé.

```html
<input id="input1"
    name="input1"
    type="text"
    class="rounded-lg border-transparent flex-1"
    placeholder="My Placeholder"
    data-error-class="ring-red-500 ring-2"/>
```

Voici un exemple complet, à noter que vous n'êtes pas obligé de mettre le message d'erreur juste à côté du champ, tant qu'il se trouve dans le `<form></form>` ça fonctionne.
```html
<input id="input1"
    name="input1"
    type="text"
    class="rounded-lg border-transparent flex-1"
    placeholder="My Placeholder"
    data-error-class="ring-red-500 ring-2"/>
<span class="text-sm text-red-500" data-error-for="input1"></span>
```

## Filtrer les champs

Vous aurez parfois besoin de filtrer les champs que vous souhaitez envoyer dans votre requête, il vous suffit d'ajouter l'attribut `data-input-remove` pour ne pas envoyer le champ correspondant, par exemple :

```html
<input id="input1"
    name="input1"
    type="text"
    placeholder="My Placeholder"
    data-input-remove/>
```

## Problèmes & Questions

> Si vous rencontrez un problème ou si vous avez une question vous pouvez utiliser notre [système de ticket](https://github.com/jordson-io/jordson/issues).