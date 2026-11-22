# host



使用 `host` 屬性，可以獲取元素的宿主組件實例。這對於在組件內部訪問其宿主組件的數據和方法非常有用。

下面是一個示例，演示如何使用 `host` 屬性獲取宿主組件的實例：

<o-playground name="host - 獲取宿主" style="--editor-height: 700px">
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

在這個示例中，我們創建瞭一個自定義組件 `user-card`，並在組件內部通過 `this.host` 訪問宿主組件（頁面）的方法 `sayHi`，實現瞭組件與宿主之間的交互。

如菓元素不在組件或頁面模塊內，`host` 的值將爲 `null`。例如：

<o-playground name="host - 無宿主情況" style="--editor-height: 300px">
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

在這個示例中，`#target` 元素在 body 下，不在任何組件或頁面內，所以 `$("#target").host` 的值爲 `null`。
