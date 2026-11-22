# wrap



`wrap` 메서드는 대상 요소의 외부에 한 레이어의 요소를 감싸는 데 사용됩니다. `wrap` 작업을 실행하기 전에 자동으로 [$ 메서드](../instance/dollar.md)의 초기화 작업이 수행되므로, 구체적인 요소 문자열이나 객체를 직접 입력할 수 있습니다.

<o-playground name="wrap - 요소 감싸기" style="--editor-height: 440px">
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

## 주의사항

대상 요소는 **반드시 부모 노드를 가지고 있어야** 하며, 그렇지 않으면 래핑 작업이 실패합니다.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.wrap("<div>new div</div>"); // 오류, 부모 요소가 없어 감쌀 수 없음
$el.$('#target').wrap("<div>new div</div>"); // 정상, 부모 요소가 있음
```

**참고: o-fill 또는 o-if 등의 템플릿 구성 요소 내에서 작업하지 마십시오.**