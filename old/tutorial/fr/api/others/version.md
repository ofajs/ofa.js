# version



Grâce à la propriété `ofa.version`, vous pouvez obtenir le numéro de version de ofa.js actuellement importé.

> **Exige la version ≥ 4.3.40 d'ofa.js**

<o-playground name="version - obtenir la version">
  <code path="demo.html">
    <template>
      <div id="logger"></div>
      <script>
        \$("#logger").text = ofa.version;
      </script>
    </template>
  </code>
</o-playground>

Ainsi, vous pouvez afficher la version actuelle d'ofa.js sur la page.