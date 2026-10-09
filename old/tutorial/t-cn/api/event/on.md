# on



使用 `on` 方法，妳可以爲目標元素註冊事件處理程序。這使妳能夠輕鬆地捕獲和響應用戶的交互操作。

下面是一個示例，演示如何使用 `on` 方法爲按鈕元素註冊點擊事件處理程序：

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

在這個示例中，我們使用 `on` 方法爲按鈕元素添加瞭一個點擊事件處理程序。當用戶點擊按鈕時，會觸發事件處理程序，計數器將遞增並將結菓顯示在頁面上。

## 模闆語法方式使用



妳還可以使用模闆語法來爲目標元素綁定方法。

<o-playground name="on - 模闆語法" style="--editor-height: 400px">
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

在這個示例中，我們在按鈕元素上使用 `on:click` 綁定瞭一個名爲 `addCount` 的方法。當用戶點擊按鈕時，這個方法將被調用，計數器的值將遞增並在頁面上顯示。這種方式使妳可以將事件處理程序與組件的方法關聯，實現更復雜的交互。

## event



在註冊事件後，觸發的函數會被帶上 event，和原生保持一緻：

<o-playground name="on - event 參數" style="--editor-height: 300px">
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
