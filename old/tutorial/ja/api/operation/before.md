# before



`before`メソッドは、対象要素の直前に要素を追加するために使用されます。`before`操作を実行する前に、[$メソッド](../instance/dollar.md)の初期化処理が自動的に行われるため、具体的な要素の文字列やオブジェクトを直接記述できます。

**o-fill や o-if などのテンプレートコンポーネント内で操作しないでください。**

<o-playground name="before - 前面添加" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').before(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

