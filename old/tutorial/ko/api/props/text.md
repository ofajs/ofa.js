# text



`text` 메서드는 요소의 텍스트 내용을 가져오거나 설정하는 데 사용됩니다.

## 직접 사용

요소의 텍스트 내용을 직접 가져오거나 설정할 수 있습니다.

<o-playground name="text - 직접 사용" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target1">target 1</div>
      <div id="target2">origin text</div>
      <br>
      <div id="logger" style="color:red;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').text = `<b style="color:blue;">new text</b>`;
          \$("#logger").text = $("#target1").text;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 템플릿 구문 방식 사용

`:text` 속성을 사용하여 대상 요소에 해당하는 텍스트 값을 설정할 수도 있습니다. 이는 컴포넌트 렌더링에서 특히 유용합니다.

<o-playground name="text - 템플릿 구문" style="--editor-height: 450px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./text-demo.html"></l-m>
      <text-demo></text-demo>
      <script>
        setTimeout(()=>{
          \$("text-demo").txt = "change txt from outside";
        },1000);
      </script>
    </template>
  </code>
  <code path="text-demo.html" active>
    <template component>
      <div>Rendered text:
        <span :text="txt" style="color:red;"></span>
      </div>
      <script>
        export default {
          tag: "text-demo",
          data: {
            txt: "I am txt"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "change txt";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

