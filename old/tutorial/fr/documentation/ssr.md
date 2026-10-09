# SSR et rendu isomorphe

> Si vous ne savez pas ce qu’est le SSR, cela signifie que vous n’en avez pas encore besoin ; vous pouvez sauter ce chapitre pour le moment et revenir l’étudier plus tard, quand vous en ressentirez la nécessité.

## Rendu isomorphe

Afin de préserver simultanément l’expérience fluide du CSR, une meilleure reconnaissance par les robots d’indexation (SEO) et un choix plus libre du langage de développement backend, ofa.js propose un mode de rendu isomorphe unique (Symphony Client-Server Rendering).

> Pour connaître les définitions et différences spécifiques entre CSR / SSR / SSG, veuillez directement lire la section à la fin de cet article.

Le concept central du rendu isomorphe est :- Rendre le contenu initial de la page côté serveur pour garantir le SEO et la vitesse de chargement initiale
- Prendre en charge le traitement des itinéraires côté client pour maintenir l'expérience utilisateur fluide du CSR
- S'appliquer à tout environnement serveur pour une véritable rendu isomorphe

### Les principes de mise en œuvre du rendu isomorphe

Le mode de rendu isomorphe d'ofa.js est basé sur le mécanisme suivant :

1. Le serveur génère une page HTML complète avec une structure d'exécution universelle
2. Le client charge le moteur d'exécution CSR
3. Identifie automatiquement l'environnement d'exécution actuel et détermine la stratégie de rendu

### Structure de code de rendu isomorphe

**Module de page CSR original :**

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>Je suis Page</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

**Page complète après encapsulation du rendu isomorphe :**

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- Emplacement d'insertion du contenu du module de page ⬇️ -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>Je suis la page</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>

</html>
```

Donc, vous pouvez utiliser n'importe quel langage de développement (Go, Java, PHP, Nodejs, Python, etc.), n'importe quel moteur de rendu de templates côté serveur (comme `html/template` pour Go, Smarty/Twig/Blade pour PHP, etc.), et intégrer la structure de code de rendu isomorphe de ofa.js dans le template pour réaliser le SSR.

* [Cas SSR Node.js](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/node)
* [Cas SSR PHP](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/php)
* [Cas SSR Go](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/go)

### Structure du modèle de rendu isomorphe

Pour réaliser le mode de rendu isomorphe, il suffit d'utiliser la structure de modèle générique suivante côté serveur :

```html
<!doctype html>
<html lang="fr">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Titre de la page</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- Insère dynamiquement le contenu du module de page correspondant -->
  </o-app>
</body>

</html>
```

**Attention :** Le HTML renvoyé par le serveur doit inclure l'en-tête HTTP correct : `Content-Type: text/html; charset=UTF-8`

`scsr.mjs` est le moteur de rendu isomorphe fourni par ofa.js ; il détermine automatiquement la stratégie de rendu selon l’état d’exécution de la page actuelle, garantissant ainsi la meilleure expérience utilisateur dans n’importe quel environnement.

De même, SSG peut également appliquer cette structure pour générer des sites statiques.

## Différences entre ofa.js, SSR et autres frameworks front-end

Le Symphony Client-Server Rendering (ci-après dénommé SCSR) de ofa.js est essentiellement également un mode SSR.

Comparé aux solutions SSR des frameworks front-end existants tels que Vue, React, Angular, etc., le plus grand avantage d'ofa.js est qu'il **ne nécessite pas de lier obligatoirement Node.js**. Cela signifie que n'importe quel moteur de rendu de template côté serveur (comme Smarty pour PHP, Jinja2 pour Python, Thymeleaf pour Java, etc.) peut facilement intégrer ofa.js pour réaliser le SSR.

## Aperçu des méthodes de rendu de pages web

Les applications web modernes utilisent principalement quatre méthodes de rendu : le rendu traditionnel par moteur de templates côté serveur, le CSR (Client Side Rendering, rendu côté client), le SSR (Server Side Rendering, rendu côté serveur) et le SSG (Static Site Generation, génération de sites statiques). Chaque méthode a ses avantages et ses cas d'utilisation appropriés.

### Rendu de moteur de template côté serveur traditionnel

Parmi de nombreux produits Web, les moteurs de templates côté serveur restent les moyens de rendu de page les plus répandus. Les langages backend comme Go et PHP utilisent des moteurs de templates intégrés ou tiers (tels que `html/template` pour Go, Smarty/Twig/Blade pour PHP) pour injecter des données dynamiques dans les templates HTML, générer une page HTML complète en une seule fois et la renvoyer au client.

**Avantages：**- Convivial SEO, chargement rapide de la première écran
- Contrôle côté serveur, sécurité renforcée
- Exigences faibles sur la stack technique de l’équipe, les développeurs back-end peuvent réaliser seuls le développement

**Inconvénients :**- L'expérience utilisateur est médiocre, chaque interaction nécessite un rechargement de la page.
- Forte pression sur le serveur.
- Le couplage entre le front-end et le back-end est élevé, ce qui n'est pas propice à la division du travail et à la collaboration.

### CSR (rendu côté client)

En mode CSR, le contenu de la page est entièrement rendu par JavaScript côté navigateur. L'[application monopage](./routes.md) d'ofa.js en est une implémentation typique de CSR. Cette approche offre une expérience utilisateur fluide, permettant toutes les interactions sans avoir besoin de recharger la page. Les applications monopages (SPA) développées avec React ou Vue et leurs routeurs associés (tels que React Router ou Vue Router) sont des implémentations typiques de CSR.

**Avantages：**- Expérience utilisateur fluide, transitions de page sans rechargement
- Capacité de traitement côté client puissante, réponses rapides

**Inconvénients :**- Nuisible au SEO, les moteurs de recherche ont du mal à indexer le contenu.

### SSR（rendu côté serveur）

En conservant l'expérience fluide du CSR, la page est désormais rendue en temps réel par le serveur : lorsque l'utilisateur envoie une requête, le serveur génère immédiatement le HTML complet et le renvoie, réalisant ainsi un véritable rendu côté serveur.

**Avantages：**- Convivial SEO, chargement rapide de la première écran  
- Prise en charge du contenu dynamique

**Inconvénients :**- Serveur soumis à une forte pression
- Nécessite généralement un environnement Node.js comme runtime, ou au moins une couche intermédiaire Node.js
- Nécessite encore une activation côté client ultérieure pour obtenir une interaction complète

### GSS (Génération de site statique)

Pendant la phase de construction, toutes les pages sont pré-rendues en fichiers HTML statiques, qui peuvent être directement renvoyés aux utilisateurs par le serveur après le déploiement.

**Avantages：**- Vitesse de chargement initiale rapide, SEO-friendly  
- Faible charge du serveur, performances stables  
- Haute sécurité

**Inconvénients :**- Mise à jour du contenu dynamique difficile
- Le temps de construction augmente avec le nombre de pages