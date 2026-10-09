# parent



`parent` プロパティを使用すると、インスタンスの親要素インスタンスを取得できます。

<o-playground name="parent - 親要素" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').parent.css.color = 'blue'; // parent は ul要素
          \$('#target').css.color = 'red';
        },500);
      </script>
    </template>
  </code>
</o-playground>

