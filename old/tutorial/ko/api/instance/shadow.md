# shadow



`shadow` 속성을 사용하여 요소의 섀도 루트 노드 인스턴스를 가져올 수 있습니다.

<o-playground name="shadow - 그림자 노드" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
    </template>
  </code>
  <code path="test-shadow.html" active>
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'change target';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

주의할 점은, 템플릿 문법을 가진 요소 내에서 섀도 노드 내의 요소를 직접 수정하지 않도록 하여, 작업의 일관성과 유지보수성을 확보하는 것입니다.

## 외부에서 컴포넌트 섀도우 요소 내의 요소 인스턴스 가져오기

사용자 정의 요소 인스턴스를 외부에서 가져온 다음 `shadow` 속성을 통해 그림자 노드 내의 요소에 액세스할 수 있습니다. 다음과 같습니다:

```javascript
$("test-shadow").shadow.$('selector').method(xxx);
```

<o-playground name="shadow - 외부 액세스" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
      <script>
        setTimeout(()=>{
          $("test-shadow").shadow.$("#target").text = '외부에서 대상 변경 - ' + new Date();
        },1000);
      </script>
    </template>
  </code>
  <code path="test-shadow.html">
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = '대상 변경';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

