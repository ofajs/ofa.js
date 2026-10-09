# classList



La propriété `classList` est cohérente avec celle native. Vous pouvez utiliser [classList](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList) pour ajouter, supprimer et basculer des noms de classe.

Voici un exemple qui montre comment utiliser `classList`：

<o-playground name="classList - exemple d'utilisation" style="--editor-height: 500px">
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

La propriété `classList` vous permet d'ajouter, supprimer et basculer facilement les noms de classe afin de modifier dynamiquement le style d'un élément.