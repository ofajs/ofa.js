# Événements personnalisés

Dans ofa.js, en plus des événements DOM intégrés, il est également possible de créer et d'utiliser des événements personnalisés pour permettre la communication entre composants. Les événements personnalisés constituent un mécanisme essentiel du développement basé sur des composants, car ils permettent à un composant de diffuser vers l'extérieur des messages ou des changements d'état.

## Méthode emit - Déclencher des événements personnalisés

La méthode `emit` sert à déclencher des événements personnalisés, afin de notifier les écouteurs externes des changements d'état internes du composant ou des actions de l'utilisateur.

### Utilisation de base

```javascript
// Déclencher un événement personnalisé simple
this.emit('custom-event');

// Déclencher un événement personnalisé avec des données
this.emit('data-changed', {
  data: {
    // Données personnalisées, structure arbitraire selon les besoins
    newValue: 100,
    oldValue: 50
  }
});
```

### Paramètres de la méthode emit

La méthode `emit` accepte deux paramètres :

1. **Nom de l'événement** : chaîne de caractères, indiquant le nom de l'événement à déclencher
2. **Objet d'options** (en option) : contient les options de configuration de l'événement
   - `data` : données à transmettre
   - `bubbles` : booléen, contrôle si l'événement se propage vers le haut (par défaut true)
   - `composed` : booléen, contrôle si l'événement peut traverser la limite du Shadow DOM
   - `cancelable` : booléen, contrôle si l'événement peut être annulé

Ensuite, l'élément parent peut utiliser la méthode `on` [(liaison d'événements)](./event-binding.md) pour écouter cet événement personnalisé.

### Exemple d'utilisation de emit

<o-playground name="exemple d'utilisation de emit" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./my-component.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <my-component on:button-clicked="handleButtonClick"></my-component>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
            proto: {
              handleButtonClick(event) {
                this.val = JSON.stringify(event.data);
              }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="my-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid #ccc;
        }
      </style>
      <button on:click="handleClick">Cliquez pour déclencher l'événement</button>
      <script>
        export default async () => {
          return {
            tag: "my-component",
            proto: {
              handleClick() {
                this.emit('button-clicked', {
                  data: {
                    message: 'Le bouton a été cliqué',
                    timestamp: Date.now()
                  },
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## bubbles - mécanisme de propagation des événements

`La propriété `bubbles` contrôle si l'événement remonte vers les éléments parents. Lorsqu'elle est définie sur `true`, l'événement se propage vers le haut de l'arbre DOM. La valeur par défaut est `true`. Si elle est définie sur `false`, l'événement ne remontera pas.

### Explication détaillée du mécanisme de bullage

- **Comportement par défaut** : les événements émis avec `emit` ont la propagation activée par défaut (`bubbles: true`)
- **Chemin de propagation** : l’événement commence à partir de l’élément déclencheur et se propage niveau par niveau vers le haut
- **Arrêter la propagation** : appeler `event.stopPropagation()` dans le gestionnaire d’événement permet d’empêcher la propagation

### Exemple de bulle

<o-playground name="Exemple d'événement personnalisé" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component on:child-event="handleDirectChildEvent"></bubble-component>
      </div>
      <p>Conteneur extérieur (écoute des événements bubbling) : {{bubbledEventCount}} fois</p>
      <p>Composant intérieur (écoute des événements directs) : {{directEventCount}} fois</p>
      <p>Données reçues : <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
              directEventCount: 0
            },
            proto: {
              handleDirectChildEvent(event) {
                this.directEventCount++;
                this.result = event.data;
              },
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonBubblingEvent">Déclencher un événement non bubbling</button>
      <button on:click="triggerBubblingEvent">Déclencher un événement bubbling</button>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            proto: {
              triggerNonBubblingEvent() {
                // Événement non bubbling, ne sera capturé que par l'écouteur direct
                this.emit('child-event', {
                  data: { type: 'non-bubbling', message: 'Événement non bubbling déclenché', timestamp: Date.now() },
                  bubbles: false
                });
              },
              triggerBubblingEvent() {
                // Événement bubbling, se propagera vers les éléments parents
                this.emit('child-event', {
                  data: { type: 'bubbling', message: 'Événement bubbling déclenché', timestamp: Date.now() },
                  bubbles: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## composed - Pénétrer les limites du Shadow DOM

La propriété `composed` contrôle si l'événement peut traverser la frontière du Shadow DOM. Cela est particulièrement important pour le développement de Web Components, la valeur par défaut est `false`.

### Explication détaillée du mécanisme de pénétration

- **Isolement Shadow DOM**：Par défaut, les événements ne peuvent pas traverser la frontière Shadow DOM
- **Activation de la pénétration**：Définir `composed: true` permet aux événements de traverser la frontière Shadow DOM
- **Scénario d'utilisation**：Lorsqu'un composant doit envoyer un événement à l'environnement hôte, `composed: true` doit être défini

### Exemple de pénétration

<o-playground name="Exemple d'événement personnalisé avec données" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component></bubble-component>
      </div>
      <p>Écouter l'événement: {{bubbledEventCount}} fois</p>
      <p>Données reçues: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html">
    <template component>
      <l-m src="./child-component.html"></l-m>
      <style>
        :host{
          display: block;
          padding: 15px;
          border: 1px solid gray;
        }
      </style>
      <child-component on:child-event="handleChildEventFromComponent"></child-component>
      <p>Écouter l'événement: {{bubbledEventCount}} fois</p>
      <p>Données reçues: <span style="color:pink;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="child-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonComposedEvent">Déclencher un événement non composé</button>
      <button on:click="triggerComposedEvent">Déclencher un événement composé</button>
      <script>
        export default async () => {
          return {
            tag: "child-component",
            proto: {
              triggerNonComposedEvent() {
                // Événement non composé, capturé uniquement par l'auditeur direct
                this.emit('child-event', {
                  data: { type: 'non-composed', message: 'Déclenchement d\'un événement non composé', timestamp: Date.now() },
                  composed: false
                });
              },
              triggerComposedEvent() {
                // Événement composé, traverse les limites du Shadow DOM
                this.emit('child-event', {
                  data: { type: 'composed', message: 'Déclenchement d\'un événement composé', timestamp: Date.now() },
                  composed: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

