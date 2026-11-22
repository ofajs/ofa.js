# style



`style` 속성은 네이티브와 동일하게 유지됩니다.

주의하세요, `style` 속성은 스타일의 실제 값을 가져올 수 없으며, `style` 속성에 설정된 값만 가져올 수 있습니다. `style` 메서드는 [css 메서드](./css.md)와 유사하지만, 전체 스타일을 덮어쓸 수는 없습니다. `css`에 비해 `style` 메서드는 내부 실행 효율이 더 높습니다.

다음은 `style`을 사용하는 방법을 보여주는 예시입니다:

<o-playground name="style - 직접 사용" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").style.color;
        setTimeout(()=> {
          $('#target').style.color = 'red';
          $("#logger").text = $("#target").style.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

기억하세요, `style` 메소드는 `style` 속성의 값만 가져오고 설정하며, 실제 계산된 스타일이 아닙니다.

## 템플릿 구문 방식 사용

템플릿 문법을 사용하여 대상 요소의 스타일을 설정할 수도 있습니다.

<o-playground name="style - 템플릿 문법" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./style-demo.html"></l-m>
      <style-demo></style-demo>
      <script>
        setTimeout(()=>{
          \$("style-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="style-demo.html" active>
    <template component>
      <div :style.color="txt">I am target</div>
      <script>
        export default {
          tag: "style-demo",
          data: {
            txt: "red"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "blue";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

