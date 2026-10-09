# shadow



Usando la propiedad `shadow`, puedes obtener la instancia del nodo raíz de sombra del elemento.

<o-playground name="shadow - nodo sombra" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
    </template>
  </code>
  <code path="test-shadow.html" active>
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'change target';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

Es importante evitar modificar directamente los elementos dentro del nodo de sombra en elementos con sintaxis de plantilla, para garantizar la coherencia y mantenibilidad de las operaciones.

## Obtener instancias de elementos dentro del shadow DOM de un componente desde el exterior

También puede obtener una instancia del elemento personalizado desde el exterior y luego acceder a los elementos dentro del nodo sombra a través del atributo `shadow`, como se muestra a continuación:

```javascript
$("test-shadow").shadow.$('selector').method(xxx);
```

<o-playground name="shadow - acceso externo" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
      <script>
        setTimeout(()=>{
          $("test-shadow").shadow.$("#target").text = 'cambiar target desde fuera - ' + new Date();
        },1000);
      </script>
    </template>
  </code>
  <code path="test-shadow.html">
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'cambiar target';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

