# remove



`remove` メソッドは対象ノードを削除するために使用されます。

**o-fill や o-if などのテンプレートコンポーネント内で操作しないでください。**

<o-playground name="remove - ノードを削除" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').remove();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

