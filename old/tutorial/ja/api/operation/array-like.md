# 子要素の追加または削除

要素インスタンスは配列のような特性を持っており、ノードの追加や削除には配列の操作方法を使えばよい。`push`、`unshift`、`pop`、`shift`、`splice` メソッドを使用する際は、内部で自動的に [$ メソッド](../instance/dollar.md) の初期化処理が実行されるため、具体的な要素の文字列やオブジェクトを直接記述できる。

同様に、`forEach`、`map`、`some` などの他の配列メソッドも使用できます。

**注意事項として、テンプレート構文を持つ要素に対して子要素を追加または削除しないでください。**

## push



末尾から子要素を追加する。

<o-playground name="array-like - push" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").push(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## unshift



配列の先頭に子要素を追加する。

<o-playground name="array-like - unshift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").unshift(`<li style="color:blue;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## pop



末尾から子要素を削除する。

<o-playground name="array-like - pop" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").pop();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## shift



配列の先頭から要素を削除する。

<o-playground name="array-like - shift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").shift();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## splice



既存の子要素を削除または置換することも、新しい子要素を追加することもできます。その使用方法は配列の `splice` メソッドと似ています。

<o-playground name="配列風 - splice" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>私は1です</li>
        <li>私は2です</li>
        <li>私は3です</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").splice(1, 2, `<li style="color:green;">新しいli 1</li>`, `<li style="color:green;">新しいli 2</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

