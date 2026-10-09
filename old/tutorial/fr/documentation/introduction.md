# Introduction

## Qu'est-ce que ofa.js ?

ofa.js est un framework Web front-end facile à utiliser, conçu spécifiquement pour créer des applications Web, visant à améliorer l’efficacité de développement et à réduire le seuil d’entrée.

> Si vous êtes **déjà familiarisé** avec HTML, CSS et JavaScript, alors ofa.js est un très bon choix.

## Pourquoi j'ai développé ofa.js

La conception initiale de ofa.js est très simple : résoudre les problèmes d'**ingénierie** du développement Web sans dépendre d'outils de compilation.

> L'ingénierie logicielle fait référence à l'intégration systématique des normes, processus, outils et méthodes dans le processus de développement logiciel, afin d'améliorer l'efficacité du développement, la qualité du code et la maintenabilité.

Au cours des dix dernières années, le développement front-end Web a évolué d'une croissance initiale anarchique à une ingénierie progressive. Ce processus a tiré parti de l'expérience du développement d'applications traditionnelles et a résolu les défis d'ingénierie des grands projets en introduisant Node.js et un processus de compilation.

Cependant, lorsque le projet prend de l'ampleur, les inconvénients de ce modèle se révèlent progressivement, donnant naissance au problème de **l'application monolithique** rencontré dans le développement traditionnel, ce qui rend le projet difficile à maintenir et l'itération des besoins d'interaction laborieuse.

> L'application monolithique (Monolithic Application) est une application unique, volumineuse et étroitement couplée, où tous les modules fonctionnels sont centralisés dans un seul code source. Une modification peut affecter l'ensemble du système, rendant difficile le développement et le déploiement indépendants.

Il est alors nécessaire de décomposer le projet pour réaliser une architecture micro-frontend, comme pour les **microservices**. Cependant, en raison du processus de compilation, le micro-frontend devient difficile et fastidieux. Le déploiement indépendant des modules frontend nécessite la compilation de chaque petit module, ce qui est très compliqué, conduisant à un développement de la technologie Web frontend quasiment à l'arrêt.

> Les microservices (Microservices) sont un style d'architecture logicielle qui divise une application volumineuse et complexe en plusieurs petits services à granularité fine, déployés et exécutés de manière indépendante.

À ce moment-là, j’ai commencé à réfléchir : les langages de programmation traditionnels doivent s’adapter à différents matériels et systèmes d’exploitation, d’où la nécessité de la compilation pour assurer une absence de différences multiplateformes. Mais le développement Web est différent : il repose sur les navigateurs, n’a besoin d’aucune compilation pour fonctionner et se déployer de manière indépendante, et il est par nature un mode micro-frontend. J’ai donc réalisé que c’est le processus de compilation qui complique les choses.

En d'autres termes, tant que les problèmes d'ingénierie sont résolus et que l'étape de compilation nécessaire est supprimée, le développement front-end devient très adapté au développement de grandes applications, ce qui constitue un modèle de micro-frontend inné. C'est ainsi qu'ofa.js a vu le jour.

## Avantages clés

### Zéro seuil, prêt à l'emploi

Pas besoin de construire un environnement de développement, d’installer des dépendances ni de configurer un framework ; ouvrez simplement le programme de build officiel dans le navigateur, choisissez un répertoire local et commencez à développer. Tous les calculs, données et opérations de stockage s’exécutent localement, sans dépendre de services cloud.

### Convivial pour l’IA, facile à vérifier

Pas de boîte noire de compilation, le code produit par l'IA peut être rapidement déployé et auto-vérifié ; réduire les couches intermédiaires, éviter le processus de compilation, rend le code plus facile à localiser et à corriger les problèmes.

### Support natif des micro-frontends

ofa.js permet au développement front-end Web d’être segmenté, comme les micro-services, en plusieurs modules indépendants, chacun pouvant être développé et déployé séparément. Une fois les frontières du front-end Web traditionnel abolies, les technologies front-end dépasseront progressivement les limitations des technologies serveur.

## Commencer à utiliser

- Si vous avez des bases en développement, vous pouvez commencer par [Introduction aux scripts](./script-reference.md).
- Si vous êtes débutant, il est recommandé de commencer par [Créer votre première application](./create-first-app.md).