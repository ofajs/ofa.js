# host

使用 `host` 属性，可以获取元素的宿主组件实例。这对于在组件内部访问其宿主组件的数据和方法非常有用。

下面是一个示例，演示如何使用 `host` 属性获取宿主组件的实例：

<o-playground name="host - 获取宿主" style="--editor-height: 700px">
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

在这个示例中，我们创建了一个自定义组件 `user-card`，并在组件内部通过 `this.host` 访问宿主组件（页面）的方法 `sayHi`，实现了组件与宿主之间的交互。

如果元素不在组件或页面模块内，`host` 的值将为 `null`。例如：

<o-playground name="host - 无宿主情况" style="--editor-height: 300px">
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

在这个示例中，`#target` 元素在 body 下，不在任何组件或页面内，所以 `$("#target").host` 的值为 `null`。
