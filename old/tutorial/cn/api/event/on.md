# on

使用 `on` 方法，你可以为目标元素注册事件处理程序。这使你能够轻松地捕获和响应用户的交互操作。

下面是一个示例，演示如何使用 `on` 方法为按钮元素注册点击事件处理程序：

<o-playground name="on - click 事件" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

在这个示例中，我们使用 `on` 方法为按钮元素添加了一个点击事件处理程序。当用户点击按钮时，会触发事件处理程序，计数器将递增并将结果显示在页面上。

## 模板语法方式使用

你还可以使用模板语法来为目标元素绑定方法。

<o-playground name="on - 模板语法" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./on-demo.html"></l-m>
      <on-demo></on-demo>
    </template>
  </code>
  <code path="on-demo.html" active>
    <template component>
      <button on:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "on-demo",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            }
          }
        };
      </script>
    </template>
  </code>
</o-playground>

在这个示例中，我们在按钮元素上使用 `on:click` 绑定了一个名为 `addCount` 的方法。当用户点击按钮时，这个方法将被调用，计数器的值将递增并在页面上显示。这种方式使你可以将事件处理程序与组件的方法关联，实现更复杂的交互。

## event

在注册事件后，触发的函数会被带上 event，和原生保持一致：

<o-playground name="on - event 参数" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", (event)=> {
          \$("#logger").text = event.type;
        });
      </script>
    </template>
  </code>
</o-playground>
