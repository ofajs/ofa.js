# unwrap

`unwrap` 方法用于移除目标元素的外部包裹层元素。

<o-playground name="unwrap - 移除包裹" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div style="color:red;border-color:red;">
        <div id="target">I am target</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').unwrap();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 注意事项

目标元素**必须拥有父节点**，否则无法执行 unwrap 操作。

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.unwrap(); // 错误，没有父元素，无法 unwrap
$el.$('#target').unwrap(); // 正确，去除包裹的元素
```

当目标元素拥有其他兄弟元素时，也不可以执行 unwrap。

```javascript
const $el = $(`
<div>
    <div id="target"></div>
    <div>I am siblings</div>
</div>
`);

$el.$('#target').unwrap(); // 错误，因为拥有其他相邻节点
```

**请注意，不要在 o-fill 或 o-if 等模板组件内操作。**
