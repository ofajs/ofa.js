# data



요소의 `dataset`을 가져옵니다. `data` 속성과 네이티브 [dataset](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset)을 사용하여 일관성을 유지합니다.

<o-playground name="data - 사용 예시" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <style>
        [data-red="1"]{
          color:red;
        }
      </style>
      <div id="target" data-one="I am one">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        setTimeout(()=> {
          \$("#logger").text = $("#target").data.one;
          \$('#target').data.red = "1";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

