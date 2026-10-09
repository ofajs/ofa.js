# Enlace de atributos

ofa.js admite la vinculación de datos a las propiedades de los objetos después de la instanciación de elementos, como las propiedades value o checked del elemento input, etc.

## Vinculación de atributo unidireccional

Enlace unidireccional de propiedades utilizando la sintaxis `:toKey="fromKey"`, que sincroniza los datos del componente de forma "unidireccional" con los atributos del elemento DOM. Cuando los datos del componente cambian, los atributos del elemento se actualizan de inmediato; sin embargo, los cambios propios del elemento (como la entrada del usuario) no se escriben de vuelta al componente, manteniendo el flujo de datos único y controlable.

<o-playground name="Enlace de propiedad unidireccional" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Valor actual: {{val}}</p>
      <input type="text" :value="val" placeholder="Este es un cuadro de entrada con enlace unidireccional">
      <p>Nota: Modificar directamente el contenido del cuadro de entrada no cambiará el valor mostrado arriba</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Enlace bidireccional de propiedades

La vinculación bidireccional de atributos utiliza la sintaxis `sync:xxx`, logrando la sincronización bidireccional entre los datos del componente y los elementos del DOM. Cuando los datos del componente cambian, los atributos del elemento DOM se actualizan; cuando los atributos del elemento DOM cambian (como la entrada del usuario), los datos del componente también se actualizan sincrónicamente.

<o-playground name="Enlace bidireccional de propiedades" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Valor actual: {{val}}</p>
      <input type="text" sync:value="val" placeholder="Este es un campo de entrada de enlace bidireccional">
      <p>Consejo: modificar el contenido en el cuadro de entrada actualizará en tiempo real el valor mostrado arriba</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Características de la vinculación bidireccional

- Flujo de datos: Componente ↔ Elemento DOM (bidireccional)
- Cambio en datos del componente → Actualización del elemento DOM
- Cambio en elemento DOM → Actualización de datos del componente
- Adecuado para escenarios que requieren entrada del usuario y sincronización de datos

### Vinculación bidireccional de objetos

Para el enlace de datos de tipo objeto, **no es necesario usar la sintaxis `sync`**, simplemente use `:` para la transmisión unidireccional. Esto se debe a que los objetos en JavaScript son compartidos por referencia; cuando el componente padre pasa un objeto al componente hijo, este último obtiene una referencia al mismo objeto, por lo que las modificaciones en el objeto se reflejarán directamente en los datos originales.

ofa.js conserva esta característica de JavaScript, por lo que el paso unidireccional de objetos equivale en realidad a un paso bidireccional. Por ejemplo:

```html
<template page>
  <child-comp :userData="userInfo"></child-comp>
  <script>
    export default async () => {
      return {
        data: { userInfo: { name: "Zhang San", age: 25 } }
      };
    };
  </script>
</template>
```

Al modificar directamente `userData.name` en el componente `child-comp`, `userInfo.name` en el componente padre también se actualizará al mismo tiempo, ya que apuntan a la misma referencia de objeto.

### Escenarios comunes de enlace bidireccional

<o-playground name="Ejemplo de enlace bidireccional de formulario" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin: 10px 0;
        }
        input, textarea, select {
          padding: 8px;
          margin: 5px 0;
          box-sizing: border-box;
        }
        .preview {
          margin-top: 15px;
          padding: 10px;
          background-color: #7b7b7bff;
          border-radius: 4px;
        }
      </style>
      <h3>Ejemplo de enlace bidireccional de formulario</h3>
      <div class="form-group">
        <label>Campo de texto:</label>
        <input type="text" sync:value="textInput" placeholder="Ingrese texto">
      </div>
      <div class="form-group">
        <label>Campo numérico:</label>
        <input type="number" sync:value="numberInput" placeholder="Ingrese número">
      </div>
      <div class="form-group">
        <label>Texto multilínea:</label>
        <textarea sync:value="textareaInput" rows="3" placeholder="Ingrese texto multilínea"></textarea>
      </div>
      <div class="form-group">
        <label>Selector:</label>
        <select sync:value="selectedOption">
          <option value="">Seleccione...</option>
          <option value="option1">Opción 1</option>
          <option value="option2">Opción 2</option>
          <option value="option3">Opción 3</option>
        </select>
      </div>
      <div class="form-group">
        <label>Casilla de verificación:</label>
        <label style="display:flex;">
          <input type="checkbox" sync:checked="isChecked" /> Acepto los términos
        </label>
      </div>
      <div class="preview">
        <h4>Vista previa en tiempo real:</h4>
        <p>Texto: {{textInput}}</p>
        <p>Número: {{numberInput}}</p>
        <p>Texto multilínea: {{textareaInput}}</p>
        <p>Selección: {{selectedOption}}</p>
        <p>Estado de casilla: {{isChecked ? 'Marcado' : 'Sin marcar'}}</p>
      </div>
      <script>
        export default async () => {
          return {
            data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Notas importantes

1. **Consideraciones de rendimiento**: el enlace bidireccional crea oyentes de datos; su uso intensivo puede afectar el rendimiento  
2. **Consistencia de datos**: el enlace bidireccional garantiza la coherencia entre datos y vista, pero hay que evitar ciclos de actualización infinitos  
3. **Establecimiento de valores iniciales**: asegúrese de que los datos enlazados tengan valores iniciales adecuados para evitar la visualización de undefined  
4. **Conflictos de eventos**: evite utilizar simultáneamente enlace bidireccional y manejo manual de eventos en el mismo elemento para prevenir conflictos