# Animations de transition de page

La configuration `pageAnime` est utilisée pour contrôler les effets d'animation de transition lors du changement de page, améliorant ainsi l'expérience utilisateur.

## Configuration de base

Configurez les animations de transition de page dans `app-config.js` :

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

## État d'animation

L'animation de transition de page comporte trois états :

| État | Description | Moment de déclenchement |
|------|------|----------|
| `current` | Style de la page actuelle après la fin de l'animation | Une fois la commutation de page terminée |
| `next` | Style initial à l'entrée de la nouvelle page | Lorsque la nouvelle page commence à entrer |
| `previous` | Style cible à la sortie de l'ancienne page | Lorsque l'ancienne page commence à quitter |### Détails de l'état

**current (état actuel)**- Style final après la fin de la transition de page
- Généralement, l'état d'affichage normal de la page
- Par exemple : `opacity: 1, transform: "translate(0, 0)"`

Suivant (état de la page suivante)- Style initial lors de l'entrée d'une nouvelle page
- Utilisé pour définir d'où la nouvelle page commence son entrée
- Par exemple : `opacity: 0, transform: "translate(30px, 0)"` signifie une entrée depuis la droite

**précédent (état de la page précédente)**- Style cible lorsque l'ancienne page quitte
- Utilisé pour définir où l'ancienne page doit aller
- Par exemple : `opacity: 0, transform: "translate(-30px, 0)"` signifie qu'elle quitte vers la gauche

## Effets d'animation intégrés

### Glisser à gauche et à droite (par défaut)

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

Description de l'effet :- La nouvelle page glisse depuis la droite (position initiale à 30px sur la droite, opacité 0)
- L'ancienne page glisse vers la gauche (position finale à -30px sur la gauche, opacité 0)
- Les deux pages reviennent finalement à leur position normale (opacité 1, position 0)

### Fondu entrant et sortant

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
  },
  next: {
    opacity: 0,
  },
  previous: {
    opacity: 0,
  },
};
```

Description de l'effet :- La nouvelle page passe de transparente à visible
- L'ancienne page passe de visible à transparente
- Convient à un style d'application simple et élégant

### Glisser vers le haut et vers le bas

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(0, 30px)",
  },
  previous: {
    opacity: 0,
    transform: "translate(0, -30px)",
  },
};
```

Description de l'effet :- La nouvelle page glisse depuis le bas
- L'ancienne page glisse vers le haut
- Convient aux applications avec un style de défilement vertical

### Effet de zoom

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "scale(1)",
  },
  next: {
    opacity: 0,
    transform: "scale(0.8)",
  },
  previous: {
    opacity: 0,
    transform: "scale(1.2)",
  },
};
```

Description de l'effet :- La nouvelle page s'agrandit d'une petite taille à une taille normale
- La page précédente s'agrandit de sa taille normale jusqu'à disparaître
- Convient aux applications de type carte ou fenêtre modale

### Effet de retournement

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "rotateY(0deg)",
  },
  next: {
    opacity: 0,
    transform: "rotateY(-90deg)",
  },
  previous: {
    opacity: 0,
    transform: "rotateY(90deg)",
  },
};
```

Description de l'effet :- La nouvelle page arrive en pivotant depuis la gauche
- L'ancienne page disparaît en pivotant vers la droite
- Convient aux applications nécessitant un effet 3D

## Animation personnalisée

### Combiner plusieurs attributs

On peut combiner plusieurs propriétés CSS pour créer des animations complexes：

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0) scale(1)",
  },
  next: {
    opacity: 0,
    transform: "translate(50px, 50px) scale(0.9)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-50px, -50px) scale(1.1)",
  },
};
```

### Utiliser différentes fonctions d'interpolation

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

## Propriétés CSS prises en charge

`pageAnime` prend en charge toutes les propriétés CSS animables :

### Propriétés courantes

- `opacity` - opacité (0-1)
- `transform` - transformation
  - `translate(x, y)` - translation
  - `scale(n)` - mise à l'échelle
  - `rotate(deg)` - rotation
  - `rotateX/Y(deg)` - rotation 3D
- `width` / `height` - largeur / hauteur
- `margin` / `padding` - marge extérieure / marge intérieure
- `background-color` - couleur de fond
- `border-radius` - rayon de bordure

### Remarques

1. **Optimisation des performances** : privilégiez `transform` et `opacity`, ce sont les plus performants
2. **Évitez les secousses de mise en page** : évitez les propriétés qui déclenchent un reflow (comme `width`, `height`, `margin`)
3. **Durée de transition** : ofa.js ajoute automatiquement des effets de transition, par défaut 300 ms

## Exemple complet

<o-playground name="Exemple d'animation de transition de page" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Adresse de la page d'accueil de l'application
    export const home = "./home.html";
    // Configuration de l'animation de transition de page
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html" olink>Aller à À propos</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Démo de l'application Hello ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Retour</button> </div>
      <p> À propos de <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Démo de l'application Hello ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Meilleures pratiques

### 1. Gardez les animations simples

Évitez les animations trop complexes, des animations simples sont meilleures :

```javascript
// ✅ Recommandé : simple et efficace
export const pageAnime = {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};

// ❌ Non recommandé : trop complexe
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0) rotate(0deg) scale(1)",
    borderRadius: "0",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 30px) rotate(45deg) scale(0.5)",
    borderRadius: "50%",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, -30px) rotate(-45deg) scale(1.5)",
    borderRadius: "100%",
  },
};
```

### 2. Prise en compte de l'expérience utilisateur

- La durée de l'animation ne doit pas être trop longue (recommandé : 200-400 ms)
- Évitez les animations qui provoquent des vertiges chez l'utilisateur
- Assurez-vous que l'animation est fluide, sans saccades

### 3. S’adapter à différents appareils

Sur les appareils bas de gamme, on peut envisager de désactiver ou de simplifier les animations :

```javascript
// Détection des performances de l'appareil
const isLowEndDevice = navigator.hardwareConcurrency < 4;

export const pageAnime = isLowEndDevice ? {
  current: { opacity: 1 },
  next: { opacity: 0 },
  previous: { opacity: 0 },
} : {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};
```