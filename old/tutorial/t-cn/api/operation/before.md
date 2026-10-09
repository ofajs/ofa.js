# before



`before` 方法用於向目標元素的前面添加元素。在執行 `before` 操作之前，會自動執行 [$ 方法](../instance/dollar.md) 的初始化操作，因此可以直接填寫具體的元素字符串或對象。

**請註意，不要在 o-fill 或 o-if 等模闆組件內操作。**

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

