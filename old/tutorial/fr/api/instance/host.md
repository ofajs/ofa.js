# host



Utilisez la propriété `host` pour obtenir l'instance du composant hôte d'un élément. Ceci est très utile pour accéder aux données et aux méthodes de son composant hôte à l'intérieur du composant.

Voici un exemple montrant comment utiliser la propriété `host` pour obtenir une instance du composant hôte :

<o-playground name="host - obtenir l'hôte" style="--editor-height: 700px">
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

Dans cet exemple, nous avons créé un composant personnalisé `user-card`, et à l’intérieur du composant nous accédons à la méthode `sayHi` du composant hôte (page) via `this.host`, réalisant ainsi l’interaction entre le composant et son hôte.

Si l'élément ne se trouve pas dans un composant ou un module de page, la valeur de `host` sera `null`. Par exemple :

<o-playground name="host - sans hôte" style="--editor-height: 300px">
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

Dans cet exemple, l'élément `#target` se trouve sous le body, pas dans un composant ou une page, donc la valeur de `$("#target").host` est `null`.