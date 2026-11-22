# extend



`extend` ist eine höhere Methode, die verwendet wird, um die Attribute oder Methoden einer Instanz zu erweitern.

> In der Regel wird es nicht empfohlen, dass Benutzer die Eigenschaften oder Methoden der Instanz erweitern, da dies die Lernkurve erhöht. Es sei denn, es gibt im Team spezielle Szenarien, in denen das Verhalten der Instanz angepasst werden muss, andernfalls ist dies nicht ratsam.

<o-playground name="extend - Erweiterungsbeispiel" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        const target = $("#target");
        target.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          const target = $("#target");
          \$("#logger").html = `
          good : ${target.good} <br>
          say() : ${target.say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Erweitern Sie die $-Unterstützung

Ähnlich wie jQuery kannst du auch mit fn.extend die Eigenschaften oder Methoden der zugrunde liegenden Instanz erweitern; die von fn erweiterten Eigenschaften oder Methoden werden auf alle Instanzen angewendet.

<o-playground name="extend - Basis erweitern" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        \$.fn.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          \$("#logger").html = `
          target good : ${$("#target").good} <br>
          logger say() : ${$("#logger").say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Erweiterte Vorlagensyntax

Durch das Erweitern von Eigenschaften oder Funktionen mit `extend` kann die Funktionalität der Vorlagensyntax erweitert werden, sogar bis hin zur Bereitstellung spezifischer Vorlagen-Syntaktischer Zucker für Komponenten. Es ist jedoch zu beachten, dass **nicht offizielle** Vorlagensyntax möglichst vermieden werden sollte, da sie für Benutzer einen gewissen Lernaufwand mit sich bringt und eine große Anzahl nicht offizieller Vorlagen-Syntaktischer Zucker die Entwicklungserfahrung beeinträchtigt.

### Erweiterte Attribute

Sie können über Erweiterungsattribute im Template mit `:` Einstellungen vornehmen. Im Folgenden erweitern wir ein `red`-Attribut: Wenn `red` den Wert `true` hat, wird die Schriftfarbe rot.

```javascript
$.fn.extend({
  set red(bool){
    if(bool){
      this.css.color = "red";
    }else{
      this.css.color = '';
    }
  }
});
```

<o-playground name="extend - erweiterte Attribute" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-one.html"></l-m>
      <temp-one></temp-one>
      <script>
        \$.fn.extend({
          set red(bool){
            if(bool){
              this.css.color = "red";
            }else{
              this.css.color = '';
            }
          }
        });
      </script>
    </template>
  </code>
  <code path="temp-one.html">
    <template component>
      <button on:click="addCount">Add Count</button>
      <div :red="count % 3">{{count}}</div>
      <script>
        export default {
          tag: "temp-one",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel haben wir der Templatsyntax eine `red`-Eigenschaft hinzugefügt. Wenn `count % 3` nicht 0 ist, wird die Schriftfarbe rot.

### Erweiterungsmethoden

Du kannst sie auch durch die `extend`-Erweiterungsmethode in der Templatesyntax verfügbar machen. Der Methodenname ist der Teil vor dem Doppelpunkt. Hier haben wir eine `color`-Templatesyntax erweitert, und die nachfolgenden Parameter werden an die definierte Erweiterungsmethode übergeben.

Hier wurde das `always`-Attribut auf `true` gesetzt, was bedeutet, dass diese definierte Methode jedes Mal aufgerufen wird, wenn die Komponente die Oberfläche aktualisieren muss. Wenn `always` nicht gesetzt wird, wird diese Template-Syntax-Funktion nur einmal ausgeführt.

Dabei bietet `options` mehr Parameter, die Ihnen helfen, eine individuellere Vorlagensyntax zu entwickeln:

```javascript
$.fn.extend({
  color(value, func, options){
    const bool = func();
    if(bool){
      this.css.color = value;
    }else{
      this.css.color = '';
    }
  }
});

$.fn.color.always = true;
```

<o-playground name="extend - Erweiterungsmethoden" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-two.html"></l-m>
      <temp-two></temp-two>
      <script>
        \$.fn.extend({
          color(color, func, options){
            const bool = func();
            if(bool){
              this.css.color = color;
            }else{
              this.css.color = '';
            }
          }
        });
        \$.fn.color.always = true;
      </script>
    </template>
  </code>
  <code path="temp-two.html">
    <template component>
      <button on:click="addCount" color:blue="count % 3">Add Count</button>
      <div color:red="!(count % 3)">{{count}}</div>
      <script>
        export default {
          tag: "temp-two",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

## Prinzip der Vorlagen-Syntax

Bis jetzt solltest du bereits verstanden haben, dass viele der Template-Syntaxen auf ofa.js tatsächlich über `extend` erweitert werden:

- Die Methoden `class` und `attr` werden bei jedem Neuladen der Ansicht ausgeführt
- Funktionsbindungen wie `on` oder `one` werden nur einmal ausgeführt

Du kannst dir das folgende Beispiel ansehen, um das Prinzip des Template-Renderings von ofa.js besser zu verstehen:

<o-playground name="extend - Vorlagen-Syntax-Prinzip" style="--editor-height: 480px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./temp-three.html"></l-m>
      <temp-three></temp-three>
    </template>
  </code>
  <code path="temp-three.html" active>
    <template component>
      <div>class always => {{classalways}}</div>
      <div>attr always => {{attralways}}</div>
      <div>on always => {{onalways}}</div>
      <script>
        export default {
          tag: "temp-three",
          data: {
            classalways:"",
            attralways:"",
            onalways:""
          },
          ready(){
            this.classalways = $.fn.class.always;
            this.attralways = $.fn.attr.always;
            this.onalways = !!$.fn.on.always;
          }
        };
      </script>
    </template>
  </code>
</o-playground>

