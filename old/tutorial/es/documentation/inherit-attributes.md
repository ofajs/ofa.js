# Transmitir atributos de características

En ofa.js, [atributos（Attribute）](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attributes) es una de las formas más comunes de transferir datos entre componentes. Solo necesita declarar los atributos requeridos en el objeto `attrs` del componente para pasar datos externos al componente cuando se usa.

## Uso básico

### Definir propiedades de recepción

Antes de usar el componente, es necesario declarar las propiedades que se recibirán en el objeto `attrs` del componente. Las propiedades pueden tener valores predeterminados.

<o-playground name="Ejemplo de uso básico" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp first="OFA" full-name="Ejemplo de componente OFA"></demo-comp>
      <br>
      <demo-comp first="NoneOS" full-name="Caso de uso de NoneOS"></demo-comp>
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
      <p>First: {{first}}</p>
      <p>Full Name: {{fullName}}</p>
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

### Reglas importantes

1. **Limitación de tipo**: El valor del atributo pasado debe ser una cadena de texto; otros tipos se convertirán automáticamente a cadenas.

2. **Conversión de nombres**: Dado que los atributos HTML no distinguen entre mayúsculas y minúsculas, al pasar atributos que contienen letras mayúsculas, se debe usar el formato con guiones (kebab-case).
   - Por ejemplo: `fullName` → `full-name`

3. **Debe estar definido**: Si el componente no define la propiedad correspondiente en el objeto `attrs`, no podrá recibir ese atributo. El valor establecido es el valor predeterminado; si no se desea un valor predeterminado, se establece como `null`.

<o-playground name="Ejemplo de regla importante" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
      <demo-comp user-name="Zhang San" age="25"></demo-comp>
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
      <p>User Name: {{userName}}</p>
      <p>Age: {{age}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              userName: "nombre predeterminado",
              age: "0"
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Sintaxis de plantilla para pasar atributos

En la plantilla del componente, se puede usar la sintaxis `attr:toKey="fromKey"` para pasar los datos `fromKey` del componente actual al atributo `toKey` del componente hijo.

<o-playground name="Ejemplo de paso de atributos" style="--editor-height: 500px">
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

## Transmisión multinivel

Se puede pasar attribute a través de componentes anidados en múltiples capas.

Si el componente necesita depender de otros componentes, es necesario introducir los módulos de otros componentes en el componente.

<o-playground name="Ejemplo de transmisión multinivel" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp user-name="Datos de nivel superior"></outer-comp>
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
      <p>Componente externo recibe: {{userName}}</p>
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
      <p>Componente interno recibe: {{userName}}</p>
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

