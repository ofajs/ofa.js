# Stil-Abfrage

`match-var` ist eine Funktionskomponente in ofa.js, die zur Stilzuordnung basierend auf CSS-Variablen dient. Mit `match-var` können Sie je nach aktuellen CSS-Variablenwerten der Komponente dynamisch verschiedene Stile zuordnen und anwenden. Diese Funktion ist speziell für die Übergabe von stilbezogenen Kontextzuständen gedacht, erfordert keine Verwendung von JavaScript, ist bequemer zu verwenden und eignet sich für die Übergabe von Stilen wie z. B. Themenfarben.

## Kernkonzepte

- **match-var**: Eine Komponente zur Stilübereinstimmung, die basierend auf dem Wert einer CSS-Variable entscheidet, ob der interne Stil angewendet wird.
- **Attributübereinstimmung**: Definiert die abzugleichende CSS-Variable und den erwarteten Wert über die Komponenteneigenschaften.
- **Stilanwendung**: Bei erfolgreicher Übereinstimmung wird der Stil des internen `<style>`-Tags auf die Komponente angewendet.

## Grundlegende Verwendung

`match-var` Komponente definiert über Attribute die zu übereinstimmenden CSS-Variablen und die erwarteten Werte. Wenn der CSS-Variablenwert der Komponente mit dem angegebenen Attributwert übereinstimmt, werden die intern definierten Stile angewendet.

```html
<match-var theme="dark">
  <style>
    :host {
      background-color: #333;
      color: white;
    }
  </style>
</match-var>
```

### Eigenschaften

`match-var`-Komponente verwendet beliebige Attribute, um die Übereinstimmungsregeln für CSS-Variablen zu definieren. Der Attributname entspricht dem CSS-Variablennamen (ohne das `--`-Präfix), und der Attributwert ist der erwartete übereinstimmende Wert.

### Funktionsweise

1. **Browser-Unterstützung**: Unterstützt der Browser `@container style()`-Abfragen, werden die nativen CSS-Funktionen direkt verwendet
2. **Fallback**: Falls nicht, wird durch Polling auf Änderungen des CSS-Variablenwerts geprüft; bei Übereinstimmung werden Stile dynamisch eingefügt
3. **Manuelles Neuladen**: Über die Methode `$.checkMatch()` kann die Stilprüfung manuell ausgelöst werden

## Grundlegendes Beispiel

<o-playground name="Grundlegendes Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./theme-box.html"></l-m>
      <style>
        :host{
            display: block;
        }
      </style>
      <style>
        .container{
           --theme: data(currentTheme);
        }
      </style>
      <button on:click="changeTheme">Thema wechseln</button> - Thema:{{currentTheme}}
      <div class="container">
        <theme-box>
          Zeige unterschiedliche Stile basierend auf CSS-Variablen
        </theme-box>
      </div>
        <theme-box style="--theme: light;">
          Helles Thema zeigen
        </theme-box>
        <theme-box style="--theme: dark;">
          Dunkles Thema zeigen
        </theme-box>
      </div>
      <script>
        export default async ()=>{
          return {
            data: {
                currentTheme: "light",
            },
            proto:{
                changeTheme(){
                    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
                }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="theme-box.html" active>
    <template component>
      <style>
        :host {
          display: block;
          margin: 8px 0;
        }
        .content {
          padding: 20px;
          border-radius: 4px;
        }
      </style>
      <match-var theme="light">
        <style>
          .content {
            background-color: #f5f5f5;
            color: #333;
          }
        </style>
      </match-var>
      <match-var theme="dark">
        <style>
          .content {
            background-color: #333;
            color: white;
          }
        </style>
      </match-var>
      <div class="content">
        <slot></slot>
      </div>
      <script>
        export default {
          tag: "theme-box",
          data: {
            theme: "light",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## Mehrfachbedingungsabgleich

Man kann mehrere Attribute gleichzeitig verwenden, um komplexere Übereinstimmungsbedingungen zu definieren. Der Stil wird nur angewendet, wenn alle CSS-Variablen übereinstimmen.

```html
<match-var theme="dark" size="large">
  <style>
    :host {
      padding: 20px;
      font-size: 18px;
    }
  </style>
</match-var>
```

## Mehrfachbedingungs-Matching-Beispiel

<o-playground name="Attribut-Matching Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <style>
        :host {
            display: block;
        }
      </style>
      <style>
        .content{
            --theme: data(theme);
            --size: data(size);
        }
      </style>
      <l-m src="./test-card.html"></l-m>
      <div>Thema: {{theme}} <button on:click="changeTheme">Thema wechseln</button></div>
      <div>Größe: {{size}} <button on:click="changeSize">Größe wechseln</button></div>
      <div class="content">
        <test-card>
          <div>Beispiel für mehrfaches Stil-Matching</div>
        </test-card>
      </div>
      <script>
        export default async ()=>{
            return {
                data:{
                    theme:"light",
                    size:"small"
                },
                proto:{
                    changeTheme(){
                        this.theme = this.theme === "light" ? "dark" : "light";
                    },
                    changeSize(){
                        this.size = this.size === "small" ? "large" : "small";
                    }
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="test-card.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 20px;
          margin: 10px;
        }
      </style>
      <match-var theme="light" size="small">
        <style>
          :host {
            background-color: #e3f2fd;
            border: 1px solid #2196f3;
          }
        </style>
      </match-var>
      <match-var theme="light" size="large">
        <style>
          :host {
            background-color: #bbdefb;
            border: 2px solid #1976d2;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="small">
        <style>
          :host {
            background-color: #424242;
            border: 1px solid #757575;
            color: white;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="large">
        <style>
          :host {
            background-color: #212121;
            border: 2px solid #616161;
            color: white;
          }
        </style>
      </match-var>
      <slot></slot>
      <script>
        export default {
          tag: "test-card",
          data: {},
        };
      </script>
    </template>
  </code>
</o-playground>

## checkMatch manuell aktualisieren

In bestimmten Fällen können Änderungen an CSS-Variablen möglicherweise nicht automatisch erkannt werden. In diesem Fall kann die Methode `$.checkMatch()` manuell aufgerufen werden, um die Stilprüfung auszulösen.

> Derzeit unterstützt Firefox die `@container style()`-Abfrage noch nicht, daher muss `$.checkMatch()` manuell aufgerufen werden. Sobald der Browser diese Funktion nativ unterstützt, erkennt das System Änderungen an Variablen automatisch, ohne dass ein manueller Aufruf erforderlich ist.

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // Stilprüfung manuell auslösen
    $.checkMatch();
  }
}
```

## Beste Praktiken

1. **Bevorzugung nativer CSS-Funktionen**: `match-var` verwendet bevorzugt die native `@container style()`-Abfrage des Browsers, die in modernen Browsern eine bessere Leistung bietet
2. **Sinnvolle Organisation der Styles**: Platzieren Sie zusammengehörige Match-Styles gemeinsam, um die Wartung und das Verständnis zu erleichtern
3. **Verwendung der data()-Bindung**: In Kombination mit der `data()`-Direktive können reaktive Stilwechsel realisiert werden