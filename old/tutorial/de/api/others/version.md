# version



Über das Attribut `ofa.version` können Sie die Versionsnummer der aktuell eingebundenen ofa.js abrufen.

> **Erfordert ofa.js Version ≥ 4.3.40**

<o-playground name="version - Version abrufen">
  <code path="demo.html">
    <template>
      <div id="logger"></div>
      <script>
        \$("#logger").text = ofa.version;
      </script>
    </template>
  </code>
</o-playground>

Auf diese Weise kannst du die aktuell verwendete Version von ofa.js auf der Seite anzeigen.