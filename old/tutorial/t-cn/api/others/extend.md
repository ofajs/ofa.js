# extend



`extend` 是一個高階方法，用於擴展實例的屬性或方法。

> 通常情況下，不建議用戶擴展實例的屬性或方法，因爲這會增加學習成本。除非團隊內有特殊場景需要自定義實例的行爲，否則不建議這樣做。

<o-playground name="extend - 擴展實例" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        const target = $("#target");
        target.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          const target = $("#target");
          \$("#logger").html = `
          good : ${target.good} <br>
          say() : ${target.say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 擴展 $ 底層



和 jQuery 類似，妳也可以通過 fn.extend 擴展底層實例的屬性或方法；從 fn 擴展的屬性或方法會應用到所有實例上。

<o-playground name="extend - 擴展底層" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        \$.fn.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          \$("#logger").html = `
          target good : ${$("#target").good} <br>
          logger say() : ${$("#logger").say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 擴展模闆語法



通過 `extend` 擴展屬性或函數，可以增加模闆語法的功能，甚至爲組件提供專屬的模闆語法醣。但需要註意的是，盡量**不要使用**非官方的模闆語法，因爲牠們會給使用者帶來一定的學習成本，並且大量非官方模闆語法醣會降低開發體驗。

### 擴展屬性



妳可以通過擴展屬性，在模闆中使用 `:` 來進行設置。下面我們將擴展一個 `red` 屬性，當 `red` 爲 `true` 時，字體顏色變爲紅色：

```javascript
$.fn.extend({
  set red(bool){
    if(bool){
      this.css.color = "red";
    }else{
      this.css.color = '';
    }
  }
});
```

<o-playground name="extend - 擴展屬性" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-one.html"></l-m>
      <temp-one></temp-one>
      <script>
        \$.fn.extend({
          set red(bool){
            if(bool){
              this.css.color = "red";
            }else{
              this.css.color = '';
            }
          }
        });
      </script>
    </template>
  </code>
  <code path="temp-one.html">
    <template component>
      <button on:click="addCount">Add Count</button>
      <div :red="count % 3">{{count}}</div>
      <script>
        export default {
          tag: "temp-one",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

在這個示例中，我們爲模闆語法添加瞭一個 `red` 屬性，當 `count % 3` 不爲 0 時，字體顏色將變爲紅色。

### 擴展方法



妳還可以通過 `extend` 擴展方法，使其在模闆語法中可用。方法名稱就是冒號前的部分。在這裏，我們擴展瞭一個 `color` 模闆語法，後面跟著的參數將被傳遞給定義的擴展方法。

此處設置瞭 `always` 屬性爲 `true`，錶示在組件每次需要刷新界面的時機時，都會調用這個定義好的方法。如菓不設置 `always`，那麼這個模闆語法函數隻會運行一次。

其中，`options` 提供瞭更多的參數，可以幫助妳開發更具定製性的模闆語法：

```javascript
$.fn.extend({
  color(value, func, options){
    const bool = func();
    if(bool){
      this.css.color = value;
    }else{
      this.css.color = '';
    }
  }
});

$.fn.color.always = true;
```

<o-playground name="extend - 擴展方法" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-two.html"></l-m>
      <temp-two></temp-two>
      <script>
        \$.fn.extend({
          color(color, func, options){
            const bool = func();
            if(bool){
              this.css.color = color;
            }else{
              this.css.color = '';
            }
          }
        });
        \$.fn.color.always = true;
      </script>
    </template>
  </code>
  <code path="temp-two.html">
    <template component>
      <button on:click="addCount" color:blue="count % 3">Add Count</button>
      <div color:red="!(count % 3)">{{count}}</div>
      <script>
        export default {
          tag: "temp-two",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

## 模闆語法原理



到目前爲止，妳應該已經能夠理解，ofa.js 上的許多模闆語法實際上是通過 `extend` 擴展齣來的：

- `class`、`attr` 方法每次刷新視圖都會運行
- `on`、`one` 這種函數綁定隻會運行一次

妳可以査看下面的示例來更好地理解 ofa.js 的模闆渲染原理：

<o-playground name="extend - 模闆語法原理" style="--editor-height: 480px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./temp-three.html"></l-m>
      <temp-three></temp-three>
    </template>
  </code>
  <code path="temp-three.html" active>
    <template component>
      <div>class always => {{classalways}}</div>
      <div>attr always => {{attralways}}</div>
      <div>on always => {{onalways}}</div>
      <script>
        export default {
          tag: "temp-three",
          data: {
            classalways:"",
            attralways:"",
            onalways:""
          },
          ready(){
            this.classalways = $.fn.class.always;
            this.attralways = $.fn.attr.always;
            this.onalways = !!$.fn.on.always;
          }
        };
      </script>
    </template>
  </code>
</o-playground>
