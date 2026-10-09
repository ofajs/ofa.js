# o-app composant

`o-app` est l'un des composants centraux d'ofa.js, utilisé pour configurer et gérer l'ensemble de l'application. Voici quelques-unes des propriétés et méthodes clés de l'app :

## src



L'attribut `src` est utilisé pour spécifier l'adresse spécifique du module de configuration des paramètres de l'application.

```javascript
const app = $("o-app");
console.log(app.src);
```

## current



La propriété `current` permet d’obtenir l’instance de la page actuellement affichée. Cela vous aide à accéder à la page en cours d’affichage et à l’utiliser, par exemple pour mettre à jour son contenu ou exécuter des actions spécifiques.

```javascript
const currentPage = app.current;
```

## goto



`goto` est une méthode utilisée pour naviguer vers une page spécifiée. Vous pouvez passer l'adresse de la page cible, l'application chargera et affichera cette page. C'est une méthode importante pour la navigation dans l'application.

```javascript
app.goto("/page2.html");
```

## replace



`replace` méthode est similaire à `goto`, mais elle est utilisée pour remplacer la page actuelle plutôt que d'ajouter une nouvelle page dans la pile. Cela peut être utilisé pour implémenter le remplacement de page plutôt que la navigation par pile.

```javascript
app.replace("/new-page.html");
```

## back



La méthode `back` est utilisée pour revenir à la page précédente, réalisant ainsi l'opération de retour de la navigation de page. Cela ramène l'utilisateur à la page précédente.

```javascript
app.back();
```

## routers



L'attribut `routers` contient la configuration des routes de l'application. Il s'agit d'une propriété importante qui définit les règles de routage et les correspondances des différentes pages au sein de l'application. La configuration de routage détermine la navigation entre les pages et la manière dont les URL sont traitées.

```javascript
const routeConfig = app.routers;
```