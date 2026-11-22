# Liaison de classes et de styles

Dans ofa.js, vous pouvez réaliser une gestion flexible de l'état de l'interface utilisateur en liant dynamiquement les noms de classe、les styles et les propriétés。Cela permet à l'interface de s'adapter automatiquement aux changements de données。

## Liaison de classe

La liaison de classes vous permet d’ajouter ou de supprimer dynamiquement des classes CSS en fonction de l’état des données. Vous pouvez utiliser la syntaxe `class:className="booleanExpression"` pour lier une classe spécifique.

Lorsque `booleanExpression` est `true`, le nom de classe est ajouté à l’élément ; lorsqu’il est `false`, le nom de classe est supprimé.

### Liaison de classe de base

<o-playground name="Liaison de classe de base" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .hide {
          display: none;
        }
      </style>
      <button on:click="isHide = !isHide">Toggle Display</button>
      <p class="green" class:hide="isHide">{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Liaison de plusieurs classes

Vous pouvez également lier plusieurs classes en même temps, afin que l'élément ait différents états d'apparence selon différentes conditions.

<o-playground name="liaisons de classes multiples" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .active {
          background-color: #e6f7ff;
          border: 2px solid #1890ff;
        }
        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .highlight {
          font-weight: bold;
          color: #52c41a;
        }
      </style>
      <button on:click="toggleStates">Toggle States</button>
      <p class:active="isActive" class:disabled="isDisabled" class:highlight="isHighlighted">
        Current State - Active: {{isActive}}, Disabled: {{isDisabled}}, Highlighted: {{isHighlighted}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              isActive: false,
              isDisabled: false,
              isHighlighted: false,
            },
            proto: {
              toggleStates() {
                this.isActive = !this.isActive;
                this.isDisabled = !this.isDisabled;
                this.isHighlighted = !this.isHighlighted;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Liaison de styles

La liaison de styles vous permet de définir directement les valeurs des styles en ligne, avec mise à jour dynamique. ofa.js propose deux méthodes de liaison de styles :

### Liaison d'attribut de style unique

Utilisez la syntaxe `:style.propertyName` pour lier une propriété de style spécifique.

<o-playground name="Liaison d'attribut de style unique" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p class="green" :style.color="isGreen ? 'green' : 'red'">{{val}}</p>
      <button on:click="isGreen = !isGreen">Toggle Color</button>
      <script>
        export default async () => {
          return {
            data: {
              isGreen: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Liaison de propriété multi-style

Vous pouvez également lier plusieurs attributs de style à la fois :

<o-playground name="Liaison de propriétés multi-styles" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :style.color="textColor" :style.fontSize="fontSize + 'px'" :style.backgroundColor="bgColor">
        Exemple de style dynamique
      </p>
      <button on:click="changeStyles">Changer les styles</button>
      <script>
        export default async () => {
          return {
            data: {
              textColor: 'blue',
              fontSize: 16,
              bgColor: '#f0f0f0'
            },
            proto: {
              changeStyles() {
                this.textColor = this.textColor === 'blue' ? 'red' : 'blue';
                this.fontSize = this.fontSize === 16 ? 20 : 16;
                this.bgColor = this.bgColor === '#f0f0f0' ? '#ffffcc' : '#f0f0f0';
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Liaison de propriété

Outre la liaison de classes et de styles, vous pouvez également lier dynamiquement d'autres attributs HTML. ofa.js utilise la syntaxe `attr:attributeName` pour réaliser la liaison d'attributs.

### Liaison des attributs de base

<o-playground name="Liaison des propriétés de base" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [bg-color="red"]{
            background-color: red;
        }
        [bg-color="green"]{
            background-color: green;
        }
      </style>
      <p attr:bg-color="bgColor" attr:title="tooltipText">{{val}}</p>
      <button on:click="changeColor">Change Color</button>  
      <script>
        export default async () => {
          return {
            data: {
              bgColor: "green",
              tooltipText: "Ceci est un message d'info",
              val: "Hover over me to see the title",
            },
            proto: {
              changeColor() {
                this.bgColor = this.bgColor === "green" ? "red" : "green";
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Traitement des attributs booléens

Pour les attributs de type booléen (tels que `disabled`, `hidden`), ofa.js décide d'ajouter ou non cet attribut en fonction de la véracité de la valeur liée.

<o-playground name="Gestion des attributs booléens" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <input type="text" attr:disabled="isDisabled" placeholder="Type here..." />
      <br /><br />
      <button attr:disabled="isButtonDisabled" on:click="handleButtonClick">Click Me</button>
      <br /><br />
      <label>
        <input type="checkbox" on:change="toggleAll" /> Toggle All States
      </label>
      <script>
        export default async () => {
          return {
            data: {
              isDisabled: false,
              isChecked: true,
              isButtonDisabled: false,
            },
            proto: {
              handleButtonClick() {
                alert('Button clicked!');
              },
              toggleAll(event) {
                const checked = event.target.checked;
                this.isDisabled = checked;
                this.isChecked = checked;
                this.isButtonDisabled = checked;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Fonction data()

On peut utiliser `data(key)` dans les styles pour lier les données du composant. Cela convient parfaitement aux scénarios où le style doit changer dynamiquement en fonction des données du composant.

<o-playground name="Fonction de données dans les balises de style" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          font-size: 10px;
          color:red;
          transition: all .3s ease;
        }
      </style>
      <style>
        p:hover {
          font-size: data(size);
          color: green;
          transition: all data(time)s ease;
        }
      </style>
      Hover FontSize: <input type="number" sync:value="size" placeholder="Ceci est une zone de saisie à liaison bidirectionnelle" />
      <br />
      TransitionTime: <input type="number" step="0.3" min="0" sync:value="time" placeholder="Ceci est une zone de saisie à liaison bidirectionnelle" />
      <p>{{val}} - size: {{size}}</p>
      <script>
        export default async () => {
          return {
            data: {
              size: 16,
              time: 0.3,
              val: "Hello ofa.js Demo Code",
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Points d'attention

Le `data(key)` dans la balise `style` remplacera en principe tout le contenu du style. Pour éviter le rendu répété de styles non pertinents, il est recommandé de placer les styles contenant `data(key)` dans une balise `style` séparée, tandis que les styles ne nécessitant pas de liaison de données sont placés dans une autre balise `style`, afin d’obtenir de meilleures performances.

```html
<!-- ❌ Les p:hover qui n'ont pas de data(key) seront aussi rafraîchis -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
  p:hover{
    color:red;
  }
</style>
``````html
<!-- ✅ Seuls les styles avec data(xxx) seront réaffichés -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
</style>
<style>
  p:hover{
    color:red;
  }
</style>
```