# after



`after` メソッドは、対象要素の後ろに要素を追加するために使用されます。`after` 操作を実行する前に、自動的に [$ メソッド](../instance/dollar.md) の初期化操作が実行されるため、具体的な要素の文字列やオブジェクトを直接記述することができます。

**o-fill や o-if などのテンプレートコンポーネント内で操作しないでください。**

<o-playground name="after - 後ろに追加" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').after(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

