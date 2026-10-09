# parent



使用 `parent` 屬性，您可以獲得實例的父元素實例。

<o-playground name="parent - 父元素" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').parent.css.color = 'blue'; // parent 爲 ul元素
          \$('#target').css.color = 'red';
        },500);
      </script>
    </template>
  </code>
</o-playground>
