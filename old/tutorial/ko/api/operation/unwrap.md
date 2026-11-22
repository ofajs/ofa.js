# unwrap



`unwrap` 메서드는 대상 요소의 외부 래핑 계층 요소를 제거하는 데 사용됩니다.

<o-playground name="unwrap - 감싸기 제거" style="--editor-height: 440px">
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

## 주의사항

대상 요소는 **반드시 부모 노드**를 가지고 있어야 합니다. 그렇지 않으면 unwrap 작업을 수행할 수 없습니다.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.unwrap(); // 오류, 부모 요소가 없으므로 unwrap할 수 없습니다
$el.$('#target').unwrap(); // 올바름, 래핑된 요소를 제거합니다
```

대상 요소에 다른 형제 요소가 있을 때도 unwrap을 실행할 수 없습니다.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
    <div>I am siblings</div>
</div>
`);

$el.$('#target').unwrap(); // 오류, 다른 인접 노드가 있기 때문입니다.
```

**참고: o-fill 또는 o-if 등의 템플릿 구성 요소 내에서 작업하지 마십시오.**