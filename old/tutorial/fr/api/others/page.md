# Composant o-page

`o-page` est l’un des composants centraux d’ofa.js, représentant une page indépendante ou un module de page. Voici quelques attributs et méthodes clés de `o-page` :

## Attribut src

L'attribut `src` sert à spécifier l'adresse exacte du module de page. C'est l'attribut clé qui détermine le contenu et le comportement de la page, indiquant à l'application où charger le contenu de la page spécifique.

```javascript
const page = this;
```

## goto méthode

La méthode `goto` est utilisée pour naviguer de la page actuelle vers une autre page. Par rapport à la méthode `goto` de `app`, la méthode `goto` de `page` peut utiliser une **adresse relative** pour naviguer vers d'autres pages.

```javascript
page.goto("./page2.html");
```

## méthode replace

La méthode `replace` est utilisée pour remplacer la page actuelle par une autre page. Elle est similaire à la méthode `replace` de `app`, mais effectue le remplacement au sein de la page.

```javascript
page.replace("./new-page.html");
```

## méthode back

La méthode `back` sert à revenir à la page précédente. Elle ramène l'utilisateur à la page antérieure, de la même manière que l'action de retour du navigateur.

```javascript
page.back();
```