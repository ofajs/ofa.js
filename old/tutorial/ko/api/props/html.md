# html



`html` 메서드는 대상 요소 내부의 HTML 코드를 가져오거나 설정하는 데 사용됩니다.

<o-playground name="html - 직접 사용" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <span style="color:green;">target 1</span>
      </div>
      <div id="target2">origin text</div>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').html = `<b style="color:blue;">new text</b>`;
          console.log($("#target1").text)
          \$("#logger").html = $("#target1").html;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 주의사항

`html`은 비교적 위험한 메서드로, `script`가 삽입되면 내부의 JavaScript 코드가 자동으로 실행되므로 사용 시 XSS를 예방에 주의하세요.

## 템플릿 구문 방식 사용

또한 `:html` 속성을 사용하여 대상 요소에 해당 HTML 값을 설정할 수 있습니다. 이는 컴포넌트 렌더링에서 특히 유용합니다.

<o-playground name="html - 템플릿 구문" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./html-demo.html"></l-m>
      <html-demo></html-demo>
      <script>
        setTimeout(()=>{
          \$("html-demo").txt = "<b style='color:blue;'>change txt from outside</b>";
        },1000);
      </script>
    </template>
  </code>
  <code path="html-demo.html" active>
    <template component>
      <div>Rendered html:
        <span :html="txt" style="color:red;"></span>
      </div>
      <script>
        export default {
          tag: "html-demo",
          data: {
            txt: "I am txt"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "<b style='color:blue;'>change txt</b>";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

