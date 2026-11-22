# Liaison d'événements

Dans ofa.js, la liaison d'événements est un mécanisme important pour réaliser des interactions utilisateur. Vous pouvez attacher des gestionnaires d'événements aux éléments de plusieurs manières afin de répondre aux actions des utilisateurs.

## Lier les événements depuis proto

Ceci est la méthode recommandée pour la liaison des événements, adaptée aux logiques complexes de gestion des événements. Définir la fonction de gestion d'événements dans l'objet `proto` permet de mieux organiser la logique du code, et facilite la maintenance et la réutilisation.

<o-playground name="Lier un événement depuis proto" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto:{
              clickMe(){
                this.count++;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Exécuter directement la fonction

Pour des opérations simples (comme l'incrémentation d'un compteur, le basculement d'état, etc.), vous pouvez directement écrire des expressions courtes dans les attributs d'événement. Cette méthode est claire et concise, adaptée aux logiques simples.

<o-playground name="Fonction d'exécution directe" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="count++">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Types d'événements pris en charge

ofa.js prend en charge tous les événements DOM standard, y compris mais sans s'y limiter :

- Événements de souris : `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout`, etc.
- Événements de clavier : `keydown`, `keyup`, `keypress`, etc.
- Événements de formulaire : `submit`, `change`, `input`, `focus`, `blur`, etc.
- Événements tactiles : `touchstart`, `touchmove`, `touchend`, etc.

ofa.js prend en charge exactement les mêmes types d’événements que les événements DOM natifs ; pour plus de détails, reportez-vous à la [documentation MDN sur les événements](https://developer.mozilla.org/fr/docs/Web/API/Event).

## Passer des paramètres au gestionnaire d'événements

Vous pouvez également passer des paramètres au gestionnaire d'événements :

<o-playground name="Passer des paramètres au gestionnaire d'événements" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="addNumber(5)">Add 5 - Current: {{count}}</button>
      <button on:click="addNumber(10)">Add 10 - Current: {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
            },
            proto: {
              addNumber(num) {
                this.count += num;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Accéder à l'objet événement

Dans le gestionnaire d'événements, vous pouvez accéder à l'objet événement natif via le paramètre `event` :

<o-playground name="Accéder à l'objet événement" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .container {
          width: 300px;
          height: 200px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      <div class="container" on:click="handleClick">Cliquez n'importe où pour voir les coordonnées</div>
      <p>X: {{x}}, Y: {{y}}</p>
      <script>
        export default async () => {
          return {
            data: {
              x: 0,
              y: 0,
            },
            proto: {
              handleClick(event) {
                this.x = event.clientX;
                this.y = event.clientY;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Vous pouvez également accéder à l’objet d’événement natif via le paramètre `$event` dans l’expression, par exemple pour obtenir les coordonnées d’un clic de souris :

```html
<div class="container" on:click="handleClick($event)">Cliquez n'importe où pour voir les coordonnées</div>
```

## Écouter les événements personnalisés

En plus d’écouter les événements DOM natifs, vous pouvez également écouter facilement les événements personnalisés émis par les composants :

```html
<custom-comp on:custom-event="handleCustomEvent"></custom-comp>
```

Pour approfondir les événements personnalisés, veuillez consulter le chapitre [Événements personnalisés](custom-events.md). Il est recommandé de suivre le tutoriel dans l’ordre, les contenus ultérieurs s’étendront naturellement ; bien sûr, n’hésitez pas à le consulter à tout moment pour vous familiariser à l’avance.