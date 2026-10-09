# Élément enfant

Obtenir une instance d'élément enfant est très simple, il vous suffit de traiter l'instance comme un tableau et d'obtenir l'instance de son élément enfant via un index numérique.

<o-playground name="children" style="--editor-height: 380px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <div id="logger1" style="color:red;"></div>
      <div id="logger2" style="color:blue;"></div>
      <script>
        setTimeout(()=>{
          $("#logger1").text = $('ul').length;
          $("#logger2").text = $('ul')[1].text;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## length



Obtenez le nombre d'éléments enfants de l'élément cible, comme illustré ci-dessus :

```javascript
$("#logger1").text = $('ul').length;
```