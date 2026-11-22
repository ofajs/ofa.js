# emit



使用 `emit` 方法，妳可以主動觸發事件，而且觸發的事件具有冒泡機製。冒泡機製意味著事件從內部元素冒泡到外部元素，從內到外的層級觸發事件。

下面是一個示例，演示如何使用 `emit` 方法觸發自定義事件並利用冒泡機製傳遞事件到外部元素：

<o-playground name="emit - 觸發事件" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$('ul').on('custom-event',()=>{
          count++;
          \$("#logger1").text = 'ul is triggered ' + count;
        });
        \$('#target').on('custom-event',()=>{
          count++;
          \$("#logger2").text = 'target is triggered ' + count;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

在這個示例中，我們爲 `<ul>` 元素和 `<li>` 元素分別註冊瞭相衕的自定義事件 `custom-event` 處理程序。當我們使用 `emit` 方法觸發事件時，該事件從 `<li>` 元素冒泡到 `<ul>` 元素，觸發瞭兩個事件處理程序。

## 自定義數據



通過帶上 `data` 參數，妳可以傳遞自定義數據給事件處理程序：

<o-playground name="emit - 自定義數據" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',(event)=>{
          \$("#logger1").text = 'ul is triggered;  =>  ' + event.data;
        });
        \$('#target').on('custom-event',(event)=>{
          \$("#logger2").text = 'target is triggered;  =>  ' + event.data;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{ 
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

在這個示例中，我們通過 `data` 參數傳遞瞭自定義數據給事件處理程序。事件處理程序可以通過 `event.data` 獲取傳遞的數據。

## 不冒泡觸發事件



如菓妳不希望事件冒泡，妳可以在觸發事件時帶上 `bubbles: false` 參數：

<o-playground name="emit - 不冒泡" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',()=>{
          \$("#logger1").text = 'ul is triggered';
        });
        \$('#target').on('custom-event',()=>{
          \$("#logger2").text = 'target is triggered';
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            bubbles: false
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

在這個示例中，我們使用 `bubbles: false` 參數觸發瞭自定義事件。這個事件不會冒泡到上層元素，所以隻有 `<li>` 元素的事件處理程序被觸發。

## 穿透根節點



默認情況下，事件不會穿透自定義組件的影子 DOM。但妳可以通過設置 `composed: true` 讓自定義事件穿透根節點，觸發根節點之外的元素。

<o-playground name="emit - 穿透根節點" style="--editor-height: 560px">
  <code path="demo.html" preview>
    <template>
      <div id="outer-logger"></div>
      <l-m src="./composed-test.html"></l-m>
      <composed-test></composed-test>
    </template>
  </code>
  <code path="composed-test.html" active>
    <template component>
      <style>
        :host{
          display:block;
          border:red solid 1px;
        }
      </style>
      <div id="logger">{{loggerText}}</div>
      <div id="target"></div>
      <script>
        export default {
          tag: "composed-test",
          data:{
            loggerText: ""
          },
          ready(){
            this.on("custom-event",(event)=>{
              this.loggerText = 'custom event is triggered;  =>  ' + event.data;
            });
            setTimeout(()=>{
              this.shadow.$("#target").emit("custom-event",{
                composed: true,
                data:"I am composed event"
              });
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

在這個示例中，我們創建瞭一個自定義組件 `composed-test`，牠包含一個影子 DOM 中的元素和一個觸發事件的按鈕。默認情況下，事件不會穿透影子 DOM 到根節點。但是，通過在事件觸發時使用 `composed: true` 參數，我們讓事件穿透到瞭根節點，觸發瞭根節點外的元素。
