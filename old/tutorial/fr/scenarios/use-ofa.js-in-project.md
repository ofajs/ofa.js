# Utiliser les invites AI de ofa.js dans les projets

Étant donné que ofa.js n’est pas encore un framework largement reconnu, les modèles d’IA grand public ne possèdent pas encore la capacité d’utiliser ofa.js directement. À cet effet, nous avons soigneusement préparé des prompts dédiés pour aider l’IA à apprendre et à consulter les méthodes d’utilisation d’ofa.js.

Nous proposons deux versions du prompt :

## Version simplifiée des instructions

Ceci est une version optimisée et condensée, conçue pour minimiser la consommation de tokens en amont, adaptée à la plupart des scénarios :

```
https://raw.githubusercontent.com/ofajs/ofa.js/main/llms/tiny/start.md
```

En utilisant cette invite, l'IA peut développer efficacement des composants ou des modules de page d'ofa.js.

## Version complète des invites

Si le modèle d'IA que vous utilisez n'est pas assez intelligent, vous pouvez essayer d'utiliser la version complète non concentrée du prompt. Bien que l'initialisation occupe plus de tokens, cela pourrait donner de meilleurs résultats :

```
https://raw.githubusercontent.com/ofajs/ofa.js/main/llms/origin/start.md
```

En fournissant ces prompts, nous espérons aider les développeurs à utiliser plus facilement les outils d’IA pour le développement de projets ofa.js et à améliorer leur efficacité.

