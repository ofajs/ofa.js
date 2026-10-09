# wrap

`wrap` 方法用于在目标元素的外部包裹一层元素。在执行 `wrap` 操作之前，会自动执行 [$ 方法](../instance/dollar.md) 的初始化操作，因此可以直接填写具体的元素字符串或对象。

<o-playground name="wrap - 包裹元素" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div>
        <div>I am 1</div>
        <div id="target">I am 2</div>
        <div>I am 3</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').wrap(`<div style="border-color:red;">wrap</div>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 注意事项

目标元素**必须拥有父节点**，否则包裹操作会失败。

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.wrap("<div>new div</div>"); // 错误，没有父元素，无法包裹
$el.$('#target').wrap("<div>new div</div>"); // 正确，有父元素
```

**请注意，不要在 o-fill 或 o-if 等模板组件内操作。**
