# classList



Die `classList`-Eigenschaft ist mit der nativen Implementierung identisch. Sie können [classList](https://developer.mozilla.org/de/docs/Web/API/Element/classList) verwenden, um Klassen hinzuzufügen, zu entfernen und umzuschalten.

Nachfolgend ein Beispiel, das die Verwendung von `classList` demonstriert:

<o-playground name="classList - Verwendungsbeispiel" style="--editor-height: 500px">
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
      <div id="target" class="t-red">Ursprünglicher Text</div>
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

`classList`-Eigenschaft ermöglicht es Ihnen, Klassennamen einfach hinzuzufügen, zu entfernen und umzuschalten, um das Styling von Elementen dynamisch zu ändern.