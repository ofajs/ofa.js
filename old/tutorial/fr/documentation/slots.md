# emplacement

Les slots sont des espaces réservés dans les composants destinés à recevoir du contenu externe. En utilisant des slots, vous pouvez créer des composants réutilisables tout en permettant aux personnes qui utilisent le composant de personnaliser son contenu interne.

## Slot par défaut

<o-playground name="Exemple d'emplacement par défaut" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>Contenu de l'emplacement :
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Contenu par défaut de l'emplacement

Lorsque le composant parent ne fournit pas de contenu de slot, les éléments à l'intérieur de `<slot></slot>` seront affichés comme contenu par défaut.

<o-playground name="Exemple de contenu par défaut de l'emplacement" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <h3>Avec contenu de l'emplacement :</h3>
      <demo-comp>
        <div>Ceci est un contenu personnalisé</div>
      </demo-comp>
      <h3>Sans contenu d'emplacement (affichage du contenu par défaut) :</h3>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>Contenu de l'emplacement :
      <span style="color: red;">
        <slot>
          <div>Ceci est le contenu par défaut</div>
        </slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Slots nommés

Lorsqu'un composant nécessite plusieurs emplacements de slot, on peut utiliser des slots nommés pour distinguer les différents slots. On définit un slot nommé avec `<slot name="xxx">`, et lors de l'utilisation, on spécifie dans quel slot placer le contenu à l'aide de l'attribut `slot="xxx"`.

<o-playground name="Exemple d’emplacement nommé" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
        <div slot="footer">Contenu du pied de page</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>Contenu de l’emplacement :
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <br />
      <span style="color: blue;">
        <slot name="footer"></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Passage de slots multi-niveaux

Le contenu du slot peut être transmis à travers plusieurs niveaux de composants. Lorsque le composant parent transmet le contenu du slot au composant enfant, le composant enfant peut à son tour transmettre ce contenu du slot à ses propres composants enfants, réalisant ainsi une transmission multi-niveaux du slot.

<o-playground name="Exemple de transmission multi-niveaux de slots" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp>
        <div style="color: red;">Titre provenant du niveau le plus externe</div>
      </outer-comp>
    </template>
  </code>
  <code path="outer-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>
      <h3>Composant externe</h3>
      <l-m src="./inner-comp.html"></l-m>
      <inner-comp>
        <div style="color: inherit;">
          <slot></slot>
        </div>
      </inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
          };
        };
      </script>
    </template>
  </code>
  <code path="inner-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
        }
      </style>
      <h4>Composant interne</h4>
      <slot></slot>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Dans l’exemple ci-dessus :- Le composant parent le plus externe définit le contenu de `slot="header"`
- Le composant externe (outer-comp) reçoit ce contenu de slot et le transmet au composant interne (inner-comp)
- Le composant interne rend finalement le contenu du slot provenant du composant le plus externe