# Introduction du script

ofa.js prend en charge l’intégration directe via la balise script. Il suffit d’ajouter le code suivant dans la section `<head>` ou `<body>` du fichier HTML :

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## Utilisation de base

Après l'introduction du script, ofa.js crée une variable `$` dans le scope global ; toutes les fonctionnalités principales sont fournies via cet objet. Vous pouvez accéder aux différentes méthodes et propriétés d'ofa.js par cet objet. Les tutoriels suivants détailleront son utilisation concrète.

## Mode de débogage

Pendant le développement, vous pouvez activer le mode de débogage en ajoutant le paramètre `#debug` à l’URL du script :

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

Le mode débogage active la fonctionnalité de source map, vous permettant de visualiser et de déboguer directement le code source original des fichiers dans les outils de développement du navigateur, améliorant ainsi considérablement l'efficacité du développement.

## Modules ESM

ofa.js prend également en charge l’importation via des modules ESM. Vous pouvez utiliser l’instruction `import` dans votre projet pour importer ofa.js :

```javascript
import 'https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs';
```

Lorsque vous utilisez des modules ESM, vous pouvez directement utiliser la variable `$` dans votre code, sans avoir besoin d'y accéder via la portée globale.