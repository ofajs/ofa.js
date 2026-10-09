# Réponse d'attribut

Dans la section précédente [Liaison de propriétés](./property-binding.md), nous avons présenté un mécanisme simple de réactivité des propriétés, à savoir comment rendre la valeur d'une propriété d'un composant dans l'affichage du texte.

ofa.js prend en charge non seulement la réactivité aux valeurs de propriétés de base, mais aussi le rendu réactif des valeurs de propriétés à l'intérieur d'objets imbriqués à plusieurs niveaux.

<o-playground name="Exemple de données non réactives" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{obj.count2}}</p>
      <button on:click="handleAddCount">Augmenter</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              obj: {
                count2: 100,
              },
            },
            proto:{
              handleAddCount(){
                this.count++;
                this.obj.count2++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Toutes les données liées aux objets d'instance d'ofa.js sont automatiquement converties en données réactives. Les données réactives ne prennent en charge que les types de données de base tels que les chaînes de caractères, les nombres, les booléens, les tableaux, les objets, etc. Pour les types de données complexes comme les fonctions, les instances de classes, etc., elles doivent être stockées en tant que **propriétés non réactives**, et les modifications de ces propriétés ne déclencheront pas le nouveau rendu du composant.

## Données non réactives

Parfois, nous avons besoin de stocker des données qui ne nécessitent pas de mise à jour réactive, comme des instances de Promise, des objets d'expression régulière ou d'autres objets complexes. Dans ce cas, il est nécessaire d'utiliser des propriétés non réactives. Les modifications de ces propriétés ne déclenchent pas le re-rendu du composant, et elles sont adaptées au stockage de données qui n'ont pas besoin d'être liées à la vue.

La dénomination des propriétés non réactives ajoute généralement un underscore `_` comme préfixe avant le nom de la propriété, afin de les distinguer des propriétés réactives.

<o-playground name="Exemple de données non réactives" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{_count2}}</p>
      <button on:click="count++">Blue increases</button>
      <button on:click="_count2++">Green increments</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              _count2: 100,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Lorsque vous cliquez sur le bouton `Green increments`, bien que la valeur de `_count2` ait en réalité augmenté, comme il s'agit d'une propriété non réactive, elle ne déclenche pas la mise à jour de la vue ; l'affichage à l'écran reste donc inchangé. Lorsque vous cliquez sur le bouton `Blue increases`, puisque `count` est une propriété réactive, elle déclenche le nouveau rendu complet du composant, ce qui synchronise alors l'affichage de Green.

Les données d'objet non réactives offrent de meilleures performances que les données d'objet réactives, car les données non réactives ne déclenchent pas le re-rendu du composant.


