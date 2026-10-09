# Oyente

El observador (Watcher) es una función en ofa.js que se utiliza para detectar cambios en los datos y ejecutar la lógica correspondiente. Cuando los datos reactivos cambian, el observador activa automáticamente la función de devolución de llamada, permitiéndote realizar tareas como transformación de datos, operaciones secundarias o procesamiento asíncrono.

## Uso básico

Los observadores se definen en el objeto `watch` del componente, donde el nombre de la clave corresponde al nombre de la propiedad de datos que se debe observar, y el valor es la función de devolución de llamada que se ejecuta cuando los datos cambian.

<o-playground name="watchers - uso básico" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>
        count:{{count}}
        <br />
        doubleCount:{{doubleCount}}
      </p>
      <input sync:value="count" type="number" />
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              doubleCount: 0,
            },
            watch: {
              count(count) {
                setTimeout(() => {
                  this.doubleCount = count * 2;
                }, 500);
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Parámetros de función callback

La función de callback del listener recibe dos parámetros:- `newValue`：el nuevo valor después del cambio
- `{watchers}`：todos los objetos observadores del componente actual

Después de los cambios de datos, se realizará primero el procesamiento de antirrebote (debounce) y luego se ejecutarán las devoluciones de llamada en `watch`; el parámetro `watchers` es el conjunto de todos los cambios fusionados dentro de este ciclo de antirrebote.

La función en `watch` se llama inmediatamente después de que se complete la inicialización del componente, para establecer la supervisión de datos. Se puede distinguir si es la primera llamada verificando si `watchers` tiene longitud.

<o-playground name="watchers - parámetros de callback" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .log {
          margin-top: 10px;
          padding: 10px;
          background-color: #7e7e7eff;
          font-family: monospace;
          white-space: pre-wrap;
        }
      </style>
      <p>Nombre: {{name}}</p>
      <p>Edad: {{age}}</p>
      <input sync:value="name" placeholder="Ingrese el nombre" />
      <input sync:value="age" type="number" placeholder="Ingrese la edad" />
      <div class="log">{{log}}</div>
      <script>
        export default async () => {
          return {
            data: {
              name: "Juan",
              age: 25,
              log: "",
            },
            watch: {
              name(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // obtener uno de ellos
                this.log += `La propiedad "${watcher.name}" cambió de "${watcher.oldValue}" a "${watcher.value}"\n`;
              },
              age(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // obtener uno de ellos
                this.log += `La propiedad "${watcher.name}" cambió de "${watcher.oldValue}" a "${watcher.value}"\n`;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Observación profunda

Para datos anidados de tipo objeto o array, watch realizará automáticamente una escucha profunda.

<o-playground name="watchers - Observación profunda" style="--editor-height: 700px">
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
        .info {
          margin-top: 10px;
          padding: 10px;
          background-color: gray;
        }
      </style>
      <div>
        <p>Información del usuario:</p>
        <p>Nombre: {{user.name}}</p>
        <p>Edad: {{user.age}}</p>
        <p>Aficiones: {{user.hobbies.join(', ')}}</p>
      </div>
      <div>
        <button on:click="updateName">Modificar nombre</button>
        <button on:click="updateAge">Modificar edad</button>
        <button on:click="addHobby">Agregar afición</button>
        <button on:click="updateHobby">Modificar afición</button>
      </div>
      <div class="info" :html="log"></div>
      <script>
        export default async () => {
          return {
            data: {
              user: {
                name: "Juan",
                age: 25,
                hobbies: ["baloncesto", "fútbol"],
              },
              log: "",
            },
            watch: {
              user(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // obtener uno de ellos
                console.log("Modificación: ",watcher.target);
                if(watcher.type === 'set'){
                  this.log += `Valor modificado -> propiedad "${watcher.name}" de "${watcher.oldValue}" a "${watcher.value}" <br>`;
                }else{
                  this.log += `Ejecutar método ${watcher.type} -> nombre de función "${watcher.name}" argumentos "${watcher.args}" <br>`;
                }
              },
            },
            proto: {
              updateName() {
                this.user.name = "Luis";
              },
              updateAge() {
                this.user.age = 30;
              },
              addHobby() {
                this.user.hobbies.push("natación");
              },
              updateHobby() {
                this.user.hobbies[0] = "bádminton";
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Escuchar múltiples fuentes de datos

Puedes escuchar simultáneamente los cambios en varios datos y, en la función de devolución de llamada, ejecutar la lógica correspondiente según los cambios en esos datos.

<o-playground name="watchers - múltiples fuentes de datos" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px;
          padding: 5px;
        }
      </style>
      <p>Ancho: {{rectWidth}}</p>
      <p>Alto: {{rectHeight}}</p>
      <p>Área: {{area}}</p>
      <input sync:value="rectWidth" type="number" placeholder="Ancho" />
      <input sync:value="rectHeight" type="number" placeholder="Alto" />
      <script>
        export default async () => {
          return {
            data: {
              rectWidth: 10,
              rectHeight: 5,
              area: 0,
            },
            watch: {
              // "rectWidth,rectHeight"(){
              ["rectWidth,rectHeight"](){
                this.area = (this.rectWidth || 0) * (this.rectheight || 0);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Escenarios de aplicación práctica

### 1. Validación de formularios

<o-playground name="watchers - validación de formulario" style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
        }
        input {
          display: block;
          margin: 10px 0;
          padding: 8px;
          width: 200px;
        }
        .error {
          color: red;
          font-size: 12px;
        }
      </style>
      <input sync:value="username" placeholder="Nombre de usuario (3-10 caracteres)" />
      <span class="error">{{usernameError}}</span>
      <input sync:value="email" placeholder="Correo electrónico" />
      <span class="error">{{emailError}}</span>
      <script>
        export default async () => {
          return {
            data: {
              username: "",
              email: "",
              usernameError: "",
              emailError: "",
            },
            watch: {
              username(val) {
                if (val.length < 3 || val.length > 10) {
                  this.usernameError = "El nombre de usuario debe tener entre 3 y 10 caracteres";
                } else {
                  this.usernameError = "";
                }
              },
              email(val) {
                const emailRegex = /^.+@.+\..+$/;
                if (!emailRegex.test(val)) {
                  this.emailError = "Por favor, introduce una dirección de correo válida";
                } else {
                  this.emailError = "";
                }
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 2. Configurar el tema

<o-playground name="watchers - configurar tema" style="--editor-height: 800px">
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
      <p>Configuración: {{settings.theme}}</p>
      <p>Estado de guardado: {{saveStatus}}</p>
      <button on:click="setLight">Tema claro</button>
      <button on:click="setDark">Tema oscuro</button>
      <button on:click="resetSettings">Restablecer</button>
      <script>
        export default async () => {
          return {
            data: {
              settings: {
                theme: "light",
              },
              saveStatus: "Guardado",
            },
            watch: {
              settings(){
                  this.saveStatus = "Guardando...";
                  setTimeout(() => {
                    this.saveStatus = "Guardado";
                    console.log("Configuración guardada:", this.settings);
                  }, 500);
              }
            },
            proto: {
              setLight() {
                this.settings.theme = "light";
              },
              setDark() {
                this.settings.theme = "dark";
              },
              resetSettings() {
                this.settings = { theme: "light" };
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Precauciones

- **Evitar modificar los datos observados**: Modificar los datos que se están observando dentro de la función de callback de un observador puede provocar un bucle infinito. Si necesita modificarlos, asegúrese de tener una condición adecuada.
- **Se puede usar una propiedad computada en su lugar**: Si necesita calcular un nuevo valor basado en cambios de múltiples datos, se recomienda usar una [propiedad computada](./computed-properties.md) en lugar de un observador.