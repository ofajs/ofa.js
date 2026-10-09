# data



Holen Sie das `dataset` des Elements, verwenden Sie das `data`-Attribut und halten Sie es mit dem nativen [dataset](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset) konsistent.

<o-playground name="data - Anwendungsbeispiel" style="--editor-height: 400px">
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

