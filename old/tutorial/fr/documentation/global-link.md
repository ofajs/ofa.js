# Composant global-link

`global-link` est un composant outil qui permet à tous les composants de partager des styles.

## Utilisation de base

Après avoir référencé `ofa.js`, référencez le composant `global-link`, référencez un fichier de style via `global-link`, pour que tous les composants chargent ce fichier de style.

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Exemple global-link</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/global-link/dist/global-link.min.mjs" type="module"></script>
</head>
<body>
  <o-global-link href="./global.css"></o-global-link>
</body>
</html>
```

## Scénarios d'application

⚠️ **Avertissement** : `global-link` pollue la portée des styles globaux, tout comme les variables globales.

**Ne jamais utiliser ce composant dans les nouveaux projets !** Si vous utilisez `global-link` dans un nouveau projet, cela signifie que la conception architecturale de votre projet est défaillante, c'est le signe d'un projet pourri.

Utilisez uniquement dans les scénarios suivants :

- Migration de projets anciens (solution temporaire)
- Code pourri, projet poubelle (dépannage temporaire)

## Solutions alternatives

Vous pouvez créer un fichier `public.css` et l’importer ensuite dans chacun de vos modules de composant (en utilisant la balise `link`). Cela vous permettra d’obtenir l’effet souhaité tout en évitant de polluer les styles globaux.

```html
<!-- Dans le module de composant -->
<link rel="stylesheet" href="./public.css">
```

## Points d'attention

Il faut utiliser en priorité la balise `o-global-link` pour l'initialisation. Ce n'est qu'une fois l'initialisation terminée que les composants suivants appliqueront le style global.