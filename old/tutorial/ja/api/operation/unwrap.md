# unwrap



`unwrap` メソッドは、対象要素の外部ラップ層要素を削除するために使用されます。

<o-playground name="unwrap - ラッパーを削除" style="--editor-height: 440px">
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

## 注意事項

対象要素は**親ノードを持っている必要があります**、そうでなければunwrap操作を実行できません。

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.unwrap(); // エラー、親要素が存在しないため unwrap できない
$el.$('#target').unwrap(); // 正しい、囲んでいる要素を取り除く
```

対象要素が他の兄弟要素を持っている場合も、unwrapを実行することはできません。

```javascript
const $el = $(`
<div>
    <div id="target"></div>
    <div>I am siblings</div>
</div>
`);

$el.$('#target').unwrap(); // エラー、他の隣接ノードを持っているため
```

**注意点として、o-fill や o-if などのテンプレートコンポーネント内で操作しないでください。**