# Componente replace-temp

Cuando intentamos renderizar una lista dentro de elementos especiales como select o table, el navegador puede eliminar automáticamente el componente `<x-fill>`, provocando que el renderizado de la lista falle. En este caso, se puede utilizar el método replace-temp para resolver este problema.

El método de uso es: establece `is="replace-temp"` en la etiqueta `<template>` y colócala dentro de un elemento que el navegador corregirá automáticamente.

<o-playground name="replace-temp componente" style="--editor-height: 500px">
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

