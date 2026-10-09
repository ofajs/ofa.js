# host



Usando la propiedad `host`, se puede obtener la instancia del componente anfitrión del elemento. Esto es muy útil para acceder a los datos y métodos de su componente anfitrión dentro del componente.

Aquí hay un ejemplo que demuestra cómo usar la propiedad `host` para obtener una instancia del componente host:

<o-playground name="host - obtener el host" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./user-card.html"></l-m>
      <user-card username="tom"></user-card>
      <script>
        export default async function(){
          return {
            data: {
              greeting: "Hello"
            },
            proto: {
              sayHi(){
                return `${this.greeting}, I'm the host!`;
              }
            }
          };
        }
      </script>
    </template>
  </code>
  <code path="user-card.html" active>
    <template component>
      <style>
        :host{display:block;border:1px solid #ddd;padding:12px;margin:8px;border-radius:4px;}
      </style>
      <div>Username: {{username}}</div>
      <button on:click="onClick">Say Hi</button>
      <div>Response: {{response}}</div>
      <script>
        export default {
          tag: "user-card",
          attrs:{
            username: null
          },
          data: {
            response: "-"
          },
          proto: {
            onClick(){
              this.response = this.host.sayHi();
            }
          },
          ready(){
            console.log("Host method:", this.host.sayHi());
          },
        };
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, creamos un componente personalizado `user-card` y, dentro del componente, accedemos al método `sayHi` del componente anfitrión (página) a través de `this.host`, logrando la interacción entre el componente y el anfitrión.

Si el elemento no está dentro de un componente o módulo de página, el valor de `host` será `null`. Por ejemplo:

<o-playground name="host - sin host" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        setTimeout(()=>{
          $("#logger").text = String($("#target").host);
        },500);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, el elemento `#target` está dentro de body, no dentro de ningún componente o página, por lo que el valor de `$("#target").host` es `null`.