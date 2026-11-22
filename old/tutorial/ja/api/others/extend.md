# extend



`extend` は高階メソッドであり、インスタンスの属性やメソッドを拡張するために使用されます。

> 通常、ユーザーがインスタンスのプロパティやメソッドを拡張することは推奨されません。学習コストが増加するためです。チーム内でインスタンスの動作をカスタマイズする特別なシナリオがある場合を除き、これを行うことは推奨されません。

<o-playground name="extend - 拡張インスタンス" style="--editor-height: 560px">
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

## $ の底を拡張する

jQueryと同様に、fn.extendを使って基底インスタンスのプロパティやメソッドを拡張することもできます。fnから拡張されたプロパティやメソッドは、すべてのインスタンスに適用されます。

<o-playground name="extend - 拡張基盤" style="--editor-height: 560px">
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

## 拡張テンプレート構文

`extend`で属性や関数を拡張することで、テンプレート構文の機能を追加したり、コンポーネント専用のテンプレートシンタックスシュガーを提供することも可能です。ただし、**非公式のテンプレート構文**を使用しないように注意してください。それらは利用者に一定の学習コストをもたらし、多数の非公式テンプレートシンタックスシュガーは開発体験を低下させるからです。

### 拡張属性

拡張属性を使うことで、テンプレート内で `:` を用いて設定できます。以下では `red` 属性を拡張し、`red` が `true` のときにフォントの色を赤くします：

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

<o-playground name="extend - 拡張属性" style="--editor-height: 400px">
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

この例では、テンプレート構文に `red` 属性を追加しました。`count % 3` が 0 でない場合、フォントの色が赤に変わります。

### 拡張メソッド

あなたはまた、`extend`拡張メソッドを使用して、テンプレート構文で利用可能にすることができます。メソッド名はコロンの前の部分です。ここでは、`color`テンプレート構文を拡張しており、後ろに続くパラメータは定義された拡張メソッドに渡されます。

ここでは `always` 属性を `true` に設定しており、コンポーネントが画面を更新する必要があるたびに、この定義されたメソッドが呼び出されることを示しています。`always` を設定しない場合、このテンプレート構文関数は一度だけ実行されます。

その中で、`options`はより多くのパラメータを提供し、よりカスタマイズされたテンプレート構文の開発を支援します：

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

<o-playground name="extend - 拡張メソッド" style="--editor-height: 400px">
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

## テンプレート構文の原理

ここまでで、ofa.jsにおける多くのテンプレート構文が実際には`extend`によって拡張されていることを理解しているはずです：

- `class`、`attr` メソッドはビューを更新するたびに実行されます
- `on`、`one` のような関数バインディングは1回だけ実行されます

以下の例を確認することで、ofa.jsのテンプレートレンダリングの原理をよりよく理解できます。

<o-playground name="extend - テンプレート構文の原理" style="--editor-height: 480px">
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

