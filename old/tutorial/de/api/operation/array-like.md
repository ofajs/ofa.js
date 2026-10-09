# Hinzufügen oder Entfernen von Unterelementen

Element-Instanzen haben array-ähnliche Eigenschaften; das Hinzufügen oder Entfernen von Knoten erfolgt einfach mit den üblichen Array-Methoden. Bei Verwendung von `push`, `unshift`, `pop`, `shift` und `splice` wird intern automatisch die Initialisierung der [$-Methode](../instance/dollar.md) ausgeführt, sodass direkt konkrete Element-Strings oder -Objekte angegeben werden können.

Gleichermaßen können Sie auch andere Array-Methoden verwenden, z. B. `forEach`, `map`, `some` usw.

**Beachten Sie, dass Sie auf Elementen mit Vorlagensyntax keine untergeordneten Elemente hinzufügen oder entfernen dürfen.**

## push



Füge das untergeordnete Element am Ende hinzu.

<o-playground name="array-like - push" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Ich bin 1</li>
        <li>Ich bin 2</li>
        <li>Ich bin 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").push(`<li style="color:red;">neues li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## unshift



Füge am Anfang des Arrays untergeordnete Elemente hinzu.

<o-playground name="array-like - unshift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").unshift(`<li style="color:blue;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## pop



Entferne untergeordnete Elemente vom Ende.

<o-playground name="array-like - pop" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").pop();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## shift



Lösche untergeordnete Elemente am Anfang des Arrays.

<o-playground name="array-like - shift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").shift();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## splice



Vorhandene untergeordnete Elemente können gelöscht oder ersetzt werden, ebenso können neue untergeordnete Elemente hinzugefügt werden. Die Verwendung ähnelt der `splice`-Methode von Arrays.

<o-playground name="array-like - splice" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").splice(1, 2, `<li style="color:green;">new li 1</li>`, `<li style="color:green;">new li 2</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

