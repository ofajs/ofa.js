# Transmettre les attributs des caractéristiques

Dans ofa.js, les [attributs (Attribute)](https://developer.mozilla.org/fr/docs/Web/API/Element/attributes) sont l’un des moyens les plus courants de transmettre des données entre composants. Il suffit de déclarer les attributs requis dans l’objet `attrs` du composant pour que les données externes soient transmises à l’intérieur du composant lors de son utilisation.

## Utilisation de base

### Définir les propriétés de réception

Avant d'utiliser un composant, il est nécessaire de déclarer dans l'objet `attrs` du composant les propriétés à recevoir. Les propriétés peuvent avoir des valeurs par défaut.

<o-playground name="Exemple d'utilisation de base" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp first="OFA" full-name="Exemple de composant OFA"></demo-comp>
      <br>
      <demo-comp first="NoneOS" full-name="Cas d'utilisation NoneOS"></demo-comp>
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
      </style>
      <p>First : {{first}}</p>
      <p>Nom complet : {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              first: null,
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Règles importantes

1. **Restriction de type** : La valeur d'attribut transmise doit être une chaîne de caractères, les autres types sont automatiquement convertis en chaîne.

2. **Conversion de nom** : Étant donné que les attributs HTML ne sont pas sensibles à la casse, lors de la transmission d'attributs contenant des lettres majuscules, il faut utiliser `-` pour séparer les noms (format kebab-case).
   - Exemple : `fullName` → `full-name`

3. **Définition obligatoire** : Si le composant n'a pas défini l'attribut correspondant dans l'objet `attrs`, il ne peut pas recevoir cet attribut. La valeur définie est la valeur par défaut ; si on ne veut pas de valeur par défaut, on la définit à `null`.

<o-playground name="Exemple de règle importante" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
      <demo-comp user-name="ZhangShan" age="25"></demo-comp>
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
      </style>
      <p>Nom d'utilisateur : {{userName}}</p>
      <p>Âge : {{age}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              userName: "Nom par défaut",
              age: "0"
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Syntaxe du modèle pour passer les attributs

Dans le modèle du composant, vous pouvez utiliser la syntaxe `attr:toKey="fromKey"` pour transmettre les données `fromKey` du composant actuel à la propriété `toKey` du sous-composant.

<o-playground name="Exemple de transmission d'attributs" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <textarea sync:value="val"></textarea>
      <br>
      👇
      <demo-comp attr:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
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
      </style>
      <p>Full Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Transmission multi-niveaux

Les attributs peuvent être transmis couche par couche via des composants imbriqués à plusieurs niveaux.

Si un composant doit dépendre d'autres composants, il est nécessaire d'importer les modules des autres composants dans le composant.

<o-playground name="Exemple de transmission multi-niveaux" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp user-name="Donnée du niveau supérieur"></outer-comp>
    </template>
  </code>
  <code path="outer-comp.html" active>
    <template component>
      <l-m src="./inner-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
          margin-bottom: 8px;
        }
      </style>
      <p>Composant externe reçoit : {{userName}}</p>
      <inner-comp attr:user-name="userName"></inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
            attrs: {
              userName: ""
            },
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
          border: 1px solid green;
          padding: 8px;
          margin-left: 20px;
        }
      </style>
      <p>Composant interne reçoit : {{userName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

