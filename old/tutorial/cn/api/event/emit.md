# emit

使用 `emit` 方法，你可以主动触发事件，而且触发的事件具有冒泡机制。冒泡机制意味着事件从内部元素冒泡到外部元素，从内到外的层级触发事件。

下面是一个示例，演示如何使用 `emit` 方法触发自定义事件并利用冒泡机制传递事件到外部元素：

<o-playground name="emit - 触发事件" style="--editor-height: 560px">
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

在这个示例中，我们为 `<ul>` 元素和 `<li>` 元素分别注册了相同的自定义事件 `custom-event` 处理程序。当我们使用 `emit` 方法触发事件时，该事件从 `<li>` 元素冒泡到 `<ul>` 元素，触发了两个事件处理程序。

## 自定义数据

通过带上 `data` 参数，你可以传递自定义数据给事件处理程序：

<o-playground name="emit - 自定义数据" style="--editor-height: 560px">
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

在这个示例中，我们通过 `data` 参数传递了自定义数据给事件处理程序。事件处理程序可以通过 `event.data` 获取传递的数据。

## 不冒泡触发事件

如果你不希望事件冒泡，你可以在触发事件时带上 `bubbles: false` 参数：

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

在这个示例中，我们使用 `bubbles: false` 参数触发了自定义事件。这个事件不会冒泡到上层元素，所以只有 `<li>` 元素的事件处理程序被触发。

## 穿透根节点

默认情况下，事件不会穿透自定义组件的影子 DOM。但你可以通过设置 `composed: true` 让自定义事件穿透根节点，触发根节点之外的元素。

<o-playground name="emit - 穿透根节点" style="--editor-height: 560px">
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

在这个示例中，我们创建了一个自定义组件 `composed-test`，它包含一个影子 DOM 中的元素和一个触发事件的按钮。默认情况下，事件不会穿透影子 DOM 到根节点。但是，通过在事件触发时使用 `composed: true` 参数，我们让事件穿透到了根节点，触发了根节点外的元素。
