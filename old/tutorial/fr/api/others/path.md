# PATH



L'attribut `PATH` est généralement utilisé sur les composants personnalisés ou les composants de page pour obtenir l'adresse du fichier du composant enregistré. Cela peut vous aider, en cours de développement, à connaître l'origine du composant, notamment lorsque vous devez référencer ou charger d'autres fichiers de ressources ; vous pouvez alors utiliser l'attribut `PATH` pour construire le chemin du fichier.

Voici un exemple simple qui montre comment utiliser l'attribut `PATH` dans un composant personnalisé :

```javascript
const componentPath = $("#myCustomComponent").PATH;
```

Dans cet exemple, nous avons sélectionné un élément `my-comp` avec un `id` de "myCustomComponent", puis nous avons obtenu le chemin d'accès de ce composant personnalisé via l'attribut `PATH`. Vous pouvez utiliser la variable `componentPath` dans la partie script selon vos besoins, par exemple, pour construire le chemin vers d'autres fichiers de ressources ou pour d'autres opérations.