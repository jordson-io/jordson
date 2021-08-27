# Politique de Release

Jordson est en perpetuelle évolution, afin de pouvoir suivre le développement de ces versions ce document vous explique la politique de 
release.


## Les Versions

De manière classique l'utilisation d'un règle numérique existe, par exemple `1.4.21` qui correspond aux versions `majeur.mineur.patch`.

Afin de rendre le projet plus agréable les versions majeurs seront nommé par un nom du pathéon nordique. Afin de ne pas être perdu dans 
l'ordre des version nominative la première lettre de ce nom sera classé par ordre alphabetique.

### Liste des versions
| Nom   | Numéro | État     | Date de Release |
|-------|--------|----------|-----------------|
| Aegir | v1.x.x | Unstable | prévu pour Janvier 2022 |


## États des versions

Les versions majeurs sont accompagnées d'un "état" qui permet de savoir ou en est le développement. Le système est assez classique, 
`unstable`, `testing`, `stable` :

### Unstable
La version actuellement en cours de développement, il est déconseillé de l'utiliser pour un projet en production. Il peut y avoir des 
changements qui rendent le code instable et peu provoquer des erreurs.

### Testing
La version testing est une version ou les fonctionnalités ont été validé et "vérouillé". C'est généralement une version qui à pour but 
de corriger les éventuels problèmes et améliorer le code.

### Stable
La version qui est comme son nom l'indique la plus stable, elle est recommandé pour l'utiliser dans des projets en production. Mis à 
part des patchs cette version n'a pas pour but de recevoir de grandes modifications. La "Release date" fait référence à la publication 
de cette version.

## Les "Branch" sur le git
Afin de pouvoir rester à jour sur la version de votre choix, les branches sont nommé par le nom de la version et son état actuel. Par 
exemple `aegir-unstable` ou `aegir-testing`.


## La Documentation

La documentation est toujours à jour sur la version lié au projet. Aussi d'une version majeur à l'autre la documentation 
pourra être différente. N'hésitez pas à la consulter lors de mise à jour majeur afin de voir et comprendre les modifications apportés au
projet.


## Les contributions

Actuellement le projet n'accèpte aucune contribution de code, cependant les avis et critiques constructives sont toujours appréciés. 
Vous pouvez également ouvrir des tickets si vous découvrer un bug ou un soucis sur le projet et/ou la documentation.
