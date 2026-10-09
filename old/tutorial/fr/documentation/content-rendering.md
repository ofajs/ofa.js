# Rendu de modèle

ofa.js fournit un moteur de rendu de modèles puissant, avec une syntaxe de modèle riche, qui aide les développeurs à créer rapidement des applications. Commençons par l'introduction du rendu de texte le plus couramment utilisé.

## Liaison de données de la page

Dans ofa.js, chaque page possède un objet `data` dans lequel vous pouvez définir les variables nécessaires à la page. Lors du rendu de la page, les données de l'objet `data` sont automatiquement liées au modèle, puis vous utilisez la syntaxe `{{nomVariable}}` dans le modèle pour afficher la valeur de la variable correspondante.

## Rendu de texte

Le rendu de texte est la méthode de rendu la plus basique. Vous pouvez utiliser la syntaxe `{{nom de variable}}` dans le modèle pour afficher la valeur de la variable correspondante dans l'objet `data`.

<o-playground name="Exemple de rendu de texte" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
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
</o-playground>

## Rendu du contenu HTML

En ajoutant la directive `:html` à un élément, la chaîne HTML contenue dans la variable correspondante est analysée et insérée en toute sécurité à l’intérieur de l’élément, permettant ainsi de rendre facilement du texte riche dynamiquement ou d’intégrer des fragments HTML externes.

<o-playground name="Exemple de rendu de contenu HTML" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :html="val"></p>
      <script>
        export default async () => {
          return {
            data: {
              val: '<span style="color:green;">Hello ofa.js Demo Code</span>',
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

