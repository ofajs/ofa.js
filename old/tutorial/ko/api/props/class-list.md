# classList



`classList` 속성은 네이티브와 동일하게 유지됩니다. [classList](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList)를 사용하여 클래스 이름을 추가, 제거 및 전환할 수 있습니다.

다음은 `classList`를 사용하는 방법을 보여주는 예제입니다:

<o-playground name="classList - 사용 예제" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <style>
        .t-red{
          color: red;
          font-size: 14px;
        }
        .t-blue{
          color: blue;
          font-weight:bold;
          font-size:20px;
        }
      </style>
      <div id="target" class="t-red">origin text</div>
      <script>
        setTimeout(()=> {
          $("#target").classList.remove('t-red');
          setTimeout(()=>{
            $("#target").classList.add('t-blue');
          },1000);
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

`classList` 속성을 사용하면 클래스 이름을 쉽게 추가·삭제·전환해 요소의 스타일을 동적으로 변경할 수 있습니다.