# before



`before` se utiliza para añadir elementos antes del elemento de destino. Antes de ejecutar la operación `before`, se ejecuta automáticamente la inicialización del [$ método](../instance/dollar.md), por lo que se puede pasar directamente una cadena de elemento concreta o un objeto.

**Nota: no opere dentro de los componentes de plantilla como o-fill o o-if。**

<o-playground name="before - Agregar antes" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').before(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

