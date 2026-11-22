# Inyectar estilos de host

En los Web Components, debido a las limitaciones del slot `slot`, no es posible establecer directamente estilos para elementos de varios niveles dentro del slot. Para resolver este problema, ofa.js proporciona el componente `<inject-host>`, que permite inyectar estilos desde el interior del componente hacia el elemento anfitrión, logrando así el control de estilos sobre elementos de varios niveles dentro del contenido del slot.

> Nota: se recomienda utilizar preferentemente el selector [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) para definir el estilo del contenido del espacio reservado. Solo cuando no sea posible satisfacer los requisitos, se debe utilizar el componente `<inject-host>`.

## Uso básico

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* Establecer el estilo de los elementos hijos directos */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* También se puede establecer el estilo de múltiples niveles anidados */
            user-list user-list-item .user-list-item-content {
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag: "user-list",
                // ...
            };
        };
    </script>
</template>
```

## Caso

El siguiente ejemplo muestra cómo usar `<inject-host>` para establecer el estilo de los elementos anidados dentro de un slot. Creamos dos componentes: el componente `user-list` como contenedor de lista y el componente `user-list-item` como elemento de lista. A través de `<inject-host>`, podemos establecer el estilo de `user-list-item` y sus elementos internos dentro del componente `user-list`.

<o-playground name="Inyectar estilos del host" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>Zhang San</span>
          <span slot="age">25</span>
        </user-list-item>
        <user-list-item>
          <span class="item-name">Li Si</span>
          <span slot="age">30</span>
        </user-list-item>
      </user-list>
    </template>
  </code>
  <code path="user-list.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 10px;
        }
      </style>
      <inject-host>
        <style>
          user-list user-list-item {
            background-color: blue;
            display: block;
            padding: 10px;
            margin: 5px 0;
          }
          user-list user-list-item .item-name {
            color: red;
            font-weight: bold;
          }
        </style>
      </inject-host>
      <slot></slot>
      <script>
        export default async () => {
          return {
            tag: "user-list",
          };
        };
      </script>
    </template>
  </code>
  <code path="user-list-item.html">
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
      <div class="item-age">
        Edad: <slot name="age"></slot>
      </div>
      <script>
        export default async () => {
          return {
            tag: "user-list-item",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

En los resultados de ejecución se puede ver:- El color de fondo del componente `user-list-item` es aqua (configurado a través de `<inject-host>` del componente `user-list`)
- El color del texto del nombre es rojo (configurado a través del estilo `user-list-item .item-name` mediante `<inject-host>` del componente `user-list`)

## Principio de funcionamiento

`<inject-host>` El componente inyecta el contenido de las etiquetas `<style>` que contiene internamente en el elemento anfitrión del componente. De esta manera, las reglas de estilo inyectadas pueden atravesar los límites del componente y aplicarse a los elementos dentro de los slots.

De esta manera, puedes:- Establece estilos para elementos a cualquier profundidad dentro del contenido del slot
- Utiliza rutas completas de selectores para garantizar que los estilos solo afecten al elemento objetivo
- Mantén el encapsulado de estilos del componente mientras logras una flexibilidad de penetración de estilos

## Notas importantes

⚠️ **Riesgo de contaminación de estilos**: dado que los estilos inyectados actúan en el ámbito del elemento huésped, pueden afectar a elementos dentro de otros componentes. Al utilizarlos, siga estrictamente los siguientes principios:

1. **Usar selectores específicos**: intenta utilizar rutas completas de componentes, evitando selectores demasiado amplios.  
2. **Agregar prefijos de espacio de nombres**: añade prefijos únicos a tus clases de estilo para reducir la posibilidad de conflictos con otros componentes.  
3. **Evitar selectores de etiquetas genéricas**: prefiere el uso de selectores de clase o de atributos en lugar de selectores de etiquetas.  
4. **Repensar el diseño del componente**: considera si es posible evitar el uso de `<inject-host>` optimizando el diseño del componente. Por ejemplo, en componentes secundarios, el uso combinado del selector [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) suele ser más elegante.

```html
<!-- Recomendado ✅: usar selectores específicos -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- No recomendado ❌: usar selectores demasiado genéricos -->
<inject-host>
    <style>
        .content {  /* fácilmente entra en conflicto con otros componentes */
            color: red;
        }
    </style>
</inject-host>
```

### Consejos de rendimiento

Dado que `<inject-host>` activa la reinyección de estilos del anfitrión, lo que puede provocar un reflujo o repintado de los componentes, úselo con precaución en escenarios de actualización frecuente.  
Si solo necesita aplicar estilos a los elementos de primer nivel dentro del slot, priorice el uso del pseudo-selector [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted), que puede evitar la sobrecarga de renderizado adicional causada por la inyección transversal, logrando así un mejor rendimiento.