# Propiedades computadas

Las propiedades calculadas son una forma de derivar nuevos datos basados en datos reactivos, que se actualizan automáticamente según los cambios de los datos de los que dependen. En ofa.js, las propiedades calculadas son métodos especiales definidos en el objeto `proto`, utilizando las palabras clave `get` o `set` de JavaScript para definirlas.

## Características y ventajas

- **Características de caché**: El resultado de las propiedades computadas se almacena en caché y solo se recalcula cuando cambian los datos de los que depende
- **Reactiva**: Cuando se actualizan los datos de los que depende, la propiedad computada se actualiza automáticamente
- **Declarativa**: Se crean relaciones de dependencia de forma declarativa, lo que hace que el código sea más claro y comprensible

## get propiedad computada

La propiedad computada get se utiliza para derivar nuevos valores a partir de datos reactivos. No acepta parámetros y solo devuelve valores calculados en base a otros datos.

<o-playground name="get ejemplo de propiedad computada" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}} - {{countDouble}}</button>
      <p>El valor de la propiedad computada countDouble es: {{countDouble}}</p>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                console.log('countDouble ha sido accedido');
                return this.count * 2;
              },
              clickMe() {
                this.count++;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Ejemplos de escenarios de aplicación práctica

Las propiedades computadas se utilizan a menudo para manejar lógica compleja de transformación de datos, como filtrar matrices, formatear texto mostrado, etc.:

<o-playground name="Ejemplo de propiedad computada" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 5px;
          margin: 3px 0;
          background-color: #838383ff;
        }
      </style>
      <input type="text" sync:value="filterText" placeholder="Filtrar nombres...">
      <ul>
        <o-fill :value="filteredNames">
          <li>{{$data}}</li>
        </o-fill>
      </ul>
      <script>
        export default async () => {
          return {
            data: {
              filterText: '',
              names: ['Zhang3', 'Li4', 'Wang54']
            },
            proto: {
              get filteredNames() {
                if (!this.filterText) {
                  return this.names;
                }
                return this.names.filter(name => 
                  name.includes(this.filterText)
                );
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## set propiedades calculadas

La propiedad computada 'set' permite modificar el estado de datos subyacente mediante una operación de asignación. Recibe un parámetro y se usa generalmente para actualizar inversamente los datos originales de los que depende.

<o-playground name="ejemplo de propiedad calculada set" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
      </style>
      <div>
        <p>Valor base: {{count}}</p>
        <p>Valor duplicado: {{countDouble}}</p>
        <button on:click="resetCount">Reiniciar contador</button>
        <button on:click="setCountDouble">Establecer duplicado a 10</button>
        <button on:click="incrementCount">Incrementar valor base</button>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                return this.count * 2;
              },
              set countDouble(val) {
                this.count = Math.max(0, val / 2); // Asegurar que count no sea negativo
              },
              resetCount() {
                this.count = 0;
              },
              setCountDouble() {
                this.countDouble = 10;
              },
              incrementCount() {
                this.count++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Propiedades computadas vs Métodos

Aunque los métodos también pueden lograr funciones similares, las propiedades computadas tienen la característica de caché: solo se recalculan cuando cambian los datos de los que dependen, lo que ofrece un mejor rendimiento.

```javascript
// Usar propiedades computadas (recomendado) - con caché
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// Usar métodos - se ejecuta cada vez que se llama
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## Notas importantes

1. **Evitar operaciones asincrónicas**: Las propiedades computadas deben mantenerse sincrónicas y sin efectos secundarios. Está prohibido realizar llamadas asincrónicas o modificar directamente el estado del componente dentro de ellas.  
2. **Seguimiento de dependencias**: Asegúrate de depender únicamente de datos reactivos; de lo contrario, las actualizaciones serán impredecibles.  
3. **Protección contra errores**: Si se producen dependencias circulares o asignaciones anómalas dentro de una propiedad computada, podría provocar fallos en el renderizado o incluso bucles infinitos. Es necesario establecer condiciones límite de antemano y realizar un manejo adecuado de excepciones.

## Ejemplos de aplicación práctica

A continuación se muestra un ejemplo simple de validación de formularios, que demuestra la utilidad de las propiedades calculadas.

<o-playground name="Ejemplo de validación de formulario" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 200px;
        }
        .status {
          margin-top: 10px;
          padding: 8px;
          border-radius: 4px;
        }
        .valid {
          background-color: #d4edda;
          color: green;
        }
        .invalid {
          background-color: #f8d7da;
          color: red;
        }
      </style>
      <h3>Ejemplo de validación simple</h3>
      <input type="text" sync:value="username" placeholder="Ingrese nombre de usuario (al menos 3 caracteres)">
      <p class="status" class:valid="isValid" class:invalid="!isValid">
        Estado: {{statusMessage}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              username: ''
            },
            proto: {
              get isValid() {
                return this.username.length >= 3;
              },
              get statusMessage() {
                return this.isValid ? 'Nombre de usuario válido' : 'Longitud de nombre de usuario insuficiente';
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

