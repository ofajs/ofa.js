# one



使用 `one` 方法，妳可以爲目標元素註冊一次性事件處理程序，這意味著事件處理程序將在第一次觸發後自動解除綁定，不會再次觸發。

下面是一個示例，演示如何使用 `one` 方法爲按鈕元素註冊點擊事件處理程序：

<o-playground name="one - click 一次性事件" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").one("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

在這個示例中，我們使用 `one` 方法爲按鈕元素添加瞭一個點擊事件處理程序。當用戶點擊按鈕時，事件處理程序會觸發，但之後不會再次觸發，因爲牠已被解除綁定。

## 模闆語法方式使用



妳還可以使用模闆語法來爲目標元素綁定一次性事件處理程序。

<o-playground name="one - 模闆語法" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./one-demo.html"></l-m>
      <one-demo></one-demo>
    </template>
  </code>
  <code path="one-demo.html" active>
    <template component>
      <button one:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "one-demo",
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

在這個示例中，我們在按鈕元素上使用 `one:click` 綁定瞭一個名爲 `addCount` 的方法。當用戶點擊按鈕時，這個方法將被調用，但之後不會再次觸發，因爲牠是一次性事件處理程序。
