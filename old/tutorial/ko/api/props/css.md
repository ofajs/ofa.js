# css



`css` 메서드는 대상 요소의 스타일을 가져오거나 설정하는 데 사용됩니다.

## 직접 사용

당신은 직접 `css` 메서드를 사용하여 요소의 스타일을 가져오거나 설정할 수 있습니다.

<o-playground name="css - 직접 사용" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">원본 텍스트</div>
      <br>
      <h4>로거</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").css.color;
        setTimeout(()=> {
          $('#target').css.color = 'red';
          $("#logger").text = $("#target").css.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

## 전체 설정

획득한 `css` 객체를 통해 요소에 직접 style 값을 설정할 수 있습니다.

<o-playground name="css - 전체 설정" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = Object.keys($("#target").css);
        setTimeout(()=>{
          \$("#target").css = {
            color: "blue",
            lineHeight: "5em"
          };
          \$("#logger").text = Object.keys($("#target").css);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

`css` 객체의 특성을 사용하면 대상 요소의 스타일을 빠르게 조정할 수 있습니다.

## 템플릿 구문 방식 사용

템플릿 문법을 사용하여 대상 요소의 스타일을 설정할 수도 있습니다.

<o-playground name="css - 템플릿 구문" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./css-demo.html"></l-m>
      <css-demo></css-demo>
      <script>
        setTimeout(()=>{
          \$("css-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="css-demo.html" active>
    <template component>
      <div :css.color="txt">I am target</div>
      <script>
        export default {
          tag: "css-demo",
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

## CSS를 설정하는 팁

`$ele.css = {...$ele.css, color:'red'}` 방식을 통해 요소의 특정 스타일 속성을 수정할 수 있으며, 다른 스타일 속성에는 영향을 미치지 않습니다. 이 방식은 전체 스타일을 다시 작성하지 않고도 하나의 속성만 수정할 수 있습니다.

### 예시

```javascript
const myElement = $("#myElement");

myElement.css = { ...myElement.css, color: 'red' };
```

위의 예시에서 `{ ...myElement.css, color: 'red' }`를 사용하여 요소의 색상 스타일만 수정하고 다른 스타일 속성은 그대로 유지했습니다. 이는 요소의 스타일을 유연하게 수정할 수 있는 매우 편리한 기술입니다.