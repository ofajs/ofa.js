# host



Mit der Eigenschaft `host` kann man die Instanz der Host-Komponente eines Elements abrufen. Das ist sehr nützlich, um innerhalb einer Komponente auf Daten und Methoden ihrer Host-Komponente zuzugreifen.

Hier ist ein Beispiel, das zeigt, wie man mit der `host`-Eigenschaft eine Instanz der Host-Komponente abruft:

<o-playground name="host - Host abrufen" style="--editor-height: 700px">
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
              greeting: "Hallo"
            },
            proto: {
              sayHi(){
                return `${this.greeting}, ich bin der Host!`;
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
            console.log("Host-Methode:", this.host.sayHi());
          },
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel erstellen wir eine benutzerdefinierte Komponente `user-card` und greifen innerhalb der Komponente über `this.host` auf die Methode `sayHi` der Host-Komponente (Seite) zu, wodurch eine Interaktion zwischen der Komponente und dem Host realisiert wird.

Wenn sich das Element nicht innerhalb einer Komponente oder eines Seitenmoduls befindet, ist der Wert von `host` `null`. Zum Beispiel:

<o-playground name="host - Kein Host" style="--editor-height: 300px">
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

In diesem Beispiel befindet sich das `#target`-Element im body, nicht innerhalb einer Komponente oder Seite, daher ist der Wert von `$("#target").host` `null`.