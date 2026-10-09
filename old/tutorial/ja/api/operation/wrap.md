# wrap



`wrap` メソッドは、対象要素の外部に1層の要素をラップするために使用されます。`wrap` 操作を実行する前に、自動的に [$ メソッド](../instance/dollar.md) の初期化操作が実行されるため、具体的な要素の文字列やオブジェクトを直接記述することができます。

<o-playground name="wrap - 包み込み要素" style="--editor-height: 440px">
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

## 注意事項

対象要素**は親ノードを持っていなければならない**、さもなくばラップ操作は失敗する。

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.wrap("<div>new div</div>"); // エラー：親要素がないため、ラップできません
$el.$('#target').wrap("<div>new div</div>"); // 正解：親要素がある
```

**注意点として、o-fill や o-if などのテンプレートコンポーネント内で操作しないでください。**