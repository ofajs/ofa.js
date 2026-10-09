# replace-temp composant

Lorsque nous essayons d'effectuer un rendu de liste dans des éléments spéciaux tels que `select` ou `table`, le navigateur peut automatiquement supprimer le composant `<x-fill>`, ce qui entraîne un échec du rendu de la liste. Dans ce cas, vous pouvez utiliser l'approche `replace-temp` pour résoudre ce problème.

La méthode consiste à définir `is="replace-temp"` sur la balise `<template>` et à la placer à l'intérieur d'un élément que le navigateur corrige automatiquement.

<o-playground name="composant replace-temp" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <select>
            <template is="replace-temp">
                <x-fill :value="items">
                    <option>{{$data}}</option>
                </x-fill>
            </template>
        </select>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              items: ["A", "B", "C"],
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

