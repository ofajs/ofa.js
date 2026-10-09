# $

`$` ist die Kernfunktion in ofa.js, die zum Abrufen und Manipulieren von DOM-Elementinstanzen verwendet wird. Im Folgenden werden die Hauptfunktionen von `$` im Detail beschrieben:

## Elementinstanz abrufen

Mit der `$`-Methode kannst du die erste Elementinstanz auf der Seite abrufen, die dem [CSS-Selektor](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Selectors/Selector_list) entspricht, und sie bearbeiten. Hier ist ein Beispiel:

<o-playground name="$ - Element abrufen">
  <code path="demo.html">
    <template>
      <div id="target1">target 1 text</div>
      <script>
        setTimeout(()=>{
          \$("#target1").text = 'change target 1';
        },500);
      </script>
    </template>
  </code>
</o-playground>

Im obigen Beispiel haben wir mit dem `$`-Symbol das Element mit der `id` "target1" ausgewählt und dessen Textinhalt durch Setzen der `text`-Eigenschaft geändert.

## Beispiel zum Auffinden von untergeordneten Elementen

Instanzen haben auch die `$`-Methode, mit der über die `$`-Methode auf der Instanz die erste untergeordnete Elementinstanz abgerufen werden kann, die den Bedingungen entspricht.

<o-playground name="$ - Unterelemente suchen">
  <code path="demo.html">
    <template>
      <div id="target1">
        <h3>target</h3>
        <p>I am target1</p>
      </div>
      <script>
        const tar = $("#target1");
        tar.$('h3').text = 'change target title';
      </script>
    </template>
  </code>
</o-playground>

Bitte fügen Sie die abgerufene Elementinstanz nicht direkt an anderer Stelle ein; eine solche Operation wirkt sich auf das ursprüngliche Element aus. Wenn Sie eine Kopie erstellen möchten, können Sie die Methode [clone](./clone.md) verwenden.

<o-playground name="$ - Instanzeigenschaften" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="pos1" style="border:red solid 1px;">
        <h3>position 1</h3>
        <p id="target1" style="color:green">I am target1</p>
      </div>
      <div id="pos2" style="border:blue solid 1px;margin:8px;">
        <h3>position 2</h3>
      </div>
      <script>
        setTimeout(()=>{
          const tar = $("#target1");
          \$("#pos2").push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

## Unterelemente im Shadow-Knoten abrufen

Man kann nach dem Abrufen der Instanz über die [shadow](./shadow.md)-Eigenschaft dann mit der `$`-Methode das gewünschte Element erhalten:

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

## Direktes Instanziieren von Elementen

Sie können native Elemente direkt wie folgt in eine `$`-Instanz initialisieren:

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

So kannst du bestehende HTML-Elemente bequem in `$`-Instanzen umwandeln, um die von `$` bereitgestellten Funktionen zum Manipulieren und Verarbeiten zu nutzen.

## Generieren von Elementinstanzen

Außer, `$` kann verwendet werden, um bestehende Elementinstanzen zu erhalten, und auch neue Elementinstanzen zu erstellen und sie der Seite hinzuzufügen.

### Generierung über Zeichenkette

Du kannst die `$`-Funktion verwenden, um neue Elementinstanzen aus einem String zu erstellen, wie folgt:

<o-playground name="$ - String-Generierung" style="--editor-height: 260px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $(`<div style="color:red">add target 1 text</div>`);
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel erstellen wir eine neue Elementinstanz mit dem angegebenen Stil und Textinhalt mithilfe der `$`-Funktion und fügen sie in die vorhandene Elementinstanz mit der `id` "target1" ein.

### Generierung durch Objekte

Du kannst auch die `$`-Funktion verwenden, um über ein Objekt neue Element-Instanzen zu erzeugen, wie folgt:

<o-playground name="$ - Objekterzeugung" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $({
          tag: "div",
          text: "add target 1 text",
          css: {
            color: "red"
          }
        });
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel verwenden wir die `$`-Funktion, um eine neue Elementinstanz durch ein Objekt zu definieren, einschließlich Tag-Typ, Textinhalt und Stilattributen, und fügen sie der vorhandenen Elementinstanz mit der `id` "target1" hinzu.

## Beziehung zwischen abgerufenen Beispielen und Seiten-/Komponenteninstanzen

`$`-Methode kann verwendet werden, um von globaler Ebene eine Instanz des entsprechenden Seiten- oder Komponentenelements abzurufen. Ihre Funktion entspricht dem `this`-Verweis in den Lebenszyklusmethoden innerhalb des Seiten- oder Komponentenmoduls.

```html
<!DOCTYPE html>
...
<l-m src="./test-comp.html"></l-m>
<test-comp id="target"></test-comp>
<script type="module">
  setTimeout(()=>{
    console.log($('#target').title);  // => OFAJS Komponentenbeispiel
  },300);
</script>
```

```html
<!-- test-comp.html -->
 <template component>
  <div>
    <p>{{title}}</p>
  </div>
  <script>
    export default async ({ load }) => {
      return {
        tag: "test-comp",
        data: {
          title: "OFAJS Komponentenbeispiel",
        },
        attached(){
          console.log(this === $('#target')); // true
        }
      };
    };
  </script>
 </template>
```