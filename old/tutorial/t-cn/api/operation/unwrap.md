# unwrap



`unwrap` 方法用於移除目標元素的外部包裹層元素。

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

## 註意事項



目標元素**必須擁有父節點**，否則無法執行 unwrap 操作。

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.unwrap(); // 錯誤，沒有父元素，無法 unwrap
$el.$('#target').unwrap(); // 正確，去除包裹的元素
```

當目標元素擁有其他兄弟元素時，也不可以執行 unwrap。

```javascript
const $el = $(`
<div>
    <div id="target"></div>
    <div>I am siblings</div>
</div>
`);

$el.$('#target').unwrap(); // 錯誤，因爲擁有其他相鄰節點
```

**請註意，不要在 o-fill 或 o-if 等模闆組件內操作。**
