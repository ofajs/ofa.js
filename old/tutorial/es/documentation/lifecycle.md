# Ciclo de vida

Los componentes de ofa.js cuentan con funciones de ciclo de vida completas, que te permiten ejecutar lógica específica en las distintas etapas del componente. Estas funciones te permiten intervenir en momentos clave como la creación, montaje, actualización y destrucción del componente para realizar las operaciones correspondientes.

## Funciones de enlace del ciclo de vida

ofa.js proporciona los siguientes hooks del ciclo de vida principales, ordenados según su uso habitual:

### attached



`attach` hook se llama cuando el componente se inserta en el documento, indicando que el componente ya está montado en la página. Este es el ciclo de vida más comúnmente utilizado, y generalmente se usa para realizar operaciones de inicialización que solo pueden llevarse a cabo después de que el componente se muestre realmente en la página, evitando cálculos innecesarios cuando el componente no es visible. Este hook también es muy adecuado para realizar mediciones de tamaño de elementos, iniciar animaciones y otras operaciones que dependen de que el componente ya esté renderizado en la página.

- **Momento de llamada**: el componente se agrega al árbol DOM
- **Uso principal**: iniciar temporizadores, agregar detectores de eventos, ejecutar operaciones que requieren visibilidad

### detached



El gancho `detached` se invoca cuando el componente se elimina del documento, indicando que el componente está a punto de ser desmontado. Este gancho es adecuado para limpiar recursos, como borrar temporizadores, eliminar oyentes de eventos, etc.

- **Momento de invocación**: Cuando el componente se elimina del árbol DOM
- **Uso principal**: Limpiar recursos, cancelar suscripciones, eliminar listeners de eventos

### ready



El hook `ready` se llama cuando el componente está listo, en ese momento la plantilla del componente ya se ha renderizado, los elementos DOM se han creado, pero es posible que aún no se hayan insertado en el documento. Este hook es adecuado para realizar operaciones DOM o inicializar bibliotecas de terceros.

- **Momento de invocación**: Una vez que la plantilla del componente se ha renderizado y el DOM ha sido creado
- **Uso principal**: Ejecutar operaciones de inicialización que dependen del DOM

### loaded



El hook `loaded` se activa cuando el componente y todos sus componentes hijos y recursos asíncronos han sido completamente cargados; en este momento es seguro eliminar el estado de carga o ejecutar operaciones posteriores que dependan del árbol completo de componentes. Si no hay dependencias, se invoca después del hook `ready`.

- **Momento de llamada**: El componente y sus subcomponentes se han cargado completamente
- **Uso principal**: Ejecutar operaciones que dependen del árbol completo de componentes

## Orden de ejecución del ciclo de vida

Los hooks del ciclo de vida del componente se ejecutan en el siguiente orden:

2. `ready` - el componente está listo (el DOM se ha creado)
3. `attached` - el componente se ha montado en el DOM
4. `loaded` - el componente se ha cargado completamente

Cuando el componente se elimina del DOM, se llama al hook `detached`.

## Ejemplo de uso

El siguiente ejemplo muestra cómo usar las funciones de ciclo de vida en un componente:

<o-playground name="Ejemplo de ciclo de vida" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .counter {
          margin: 10px 0;
        }
        button {
          margin-right: 10px;
          padding: 5px 10px;
        }
      </style>
      <h3>Demostración del ciclo de vida</h3>
      <div class="counter">Contador: {{count}}</div>
      <button on:click="count += 10">Incrementar 10</button>
      <button on:click="removeSelf">Eliminar componente</button>
      <div class="log">
        <h4>Registro del ciclo de vida:</h4>
        <ul>
          <o-fill :value="logs">
            <li>{{$data}}</li>
          </o-fill>
        </ul>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              logs: [],
            },
            proto: {
              removeSelf() {
                this.remove(); // Eliminar a sí mismo del DOM para activar el hook detached
              },
              addLog(message) {
                this.logs = [...this.logs, `${new Date().toLocaleTimeString()} - ${message}`];
              }
            },
            ready() {
              this.addLog("ready: Componente listo, DOM creado");
              console.log("Componente listo");
            },
            attached() {
              this.addLog("attached: Componente montado en el DOM");
              this._timer = setInterval(() => {
                this.count++;
              }, 1000);
              console.log("Componente montado");
            },
            detached() {
              this.addLog("detached: Componente eliminado del DOM");
              // Limpiar el temporizador para evitar fugas de memoria
              clearInterval(this._timer); 
              console.log("Componente desmontado");
            },
            loaded() {
              this.addLog("loaded: Componente completamente cargado");
              console.log("Componente completamente cargado");
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, puedes observar el orden y el momento de ejecución de los diferentes hooks del ciclo de vida. Cuando haces clic en el botón "Eliminar componente", puedes ver que el hook `detached` se activa.

## Escenarios de aplicación práctica

### Inicialización de la operación

Realizar la inicialización de datos en el hook `ready`:

```javascript
export default async () => {
  return {
    data: {
      items: []
    },
    ready() {
      // Manipulación del DOM
      this.initDomElements();
    }
  };
};
```

### Gestión de recursos

Inicia el temporizador en el hook `attached` y limpia los recursos en el hook `detached`:

```javascript
export default async () => {
  return {
    data: {
      timer: null
    },
    attached() {
      // Iniciar el temporizador
      this.timer = setInterval(() => {
        console.log('Ejecutando tarea programada');
      }, 1000);
    },
    detached() {
      // Limpiar el temporizador
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };
};
```

Las funciones de gancho del ciclo de vida son un concepto importante en el desarrollo de componentes de ofa.js; su uso correcto te ayuda a gestionar mejor el estado y los recursos del componente, mejorando el rendimiento de la aplicación.

