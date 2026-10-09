# Kontextstatus

Der Kontextstatus ist ein Mechanismus in ofa.js für die gemeinsame Nutzung von Daten über Komponenten hinweg. Durch das Provider- und Consumer-Muster kann die Datenweitergabe zwischen über- und untergeordneten Komponenten sowie über mehrere Hierarchieebenen hinweg realisiert werden, ohne dass Daten über Props schrittweise weitergegeben werden müssen.

## Kernkonzepte

- **o-provider**: Datenanbieter, definiert die zu teilenden Daten
- **o-consumer**: Datenkonsument, ruft Daten vom nächsten Anbieter ab
- **watch:xxx**: Überwacht Änderungen der Konsumentendaten und bindet sie an die Eigenschaften der Komponente oder des Seitenmoduls

## o-provider Anbieter

Die Komponente `o-provider` dient zur Definition eines Providers für gemeinsame Daten. Sie kennzeichnet sich über das Attribut `name` und definiert die bereitzustellenden Daten durch Attribute wie `custom-a="value"`.

```html
<o-provider name="userInfo" custom-name="Zhang San" custom-age="25">
  ...
</o-provider>
```

### Eigenschaften

- `name`: der eindeutige Name des Anbieters, der vom Verbraucher verwendet wird, um den entsprechenden Anbieter zu finden

### Eigenschaften

1. **Automatische Eigenschaftsweitergabe**: Alle nicht reservierten Eigenschaften des Providers werden als gemeinsame Daten weitergegeben.
2. **Reaktive Aktualisierung**: Wenn sich die Daten des Providers ändern, wird der Consumer, der den entsprechenden Namen dieses Providers konsumiert, automatisch aktualisiert.
3. **Hierarchische Suche**: Der Consumer beginnt die Suche nach den Daten des entsprechenden Namens beim nächstgelegenen übergeordneten Provider.

## o-consumer Verbraucher

Die Komponente `o-consumer` dient dem Verbrauch (der Nutzung) von Daten eines Providers. Sie gibt über das Attribut `name` an, welchen Provider sie beziehen möchte.

```html
<o-consumer name="userInfo"></o-consumer>
```

### Eigenschaften

- `name`: Der Name des anzusprechenden Providers

### Eigenschaften

1. **Automatische Datenerfassung**: Der Consumer ruft automatisch die Daten des entsprechenden `name` vom nächstgelegenen übergeordneten Provider ab.
2. **Eigenschaftszusammenführung**: Wenn mehrere Provider mit demselben `name` eine bestimmte Eigenschaft besitzen, hat die Eigenschaft des Providers, der dem Consumer am nächsten liegt, Vorrang.
3. **Eigenschaftsüberwachung**: Die Änderung bestimmter Eigenschaften kann über `watch:xxx` überwacht werden.

## Datenänderungen überwachen

Durch `watch:xxx` können Änderungen der Daten des Providers überwacht werden:

```html
<o-consumer name="userInfo" watch:custom-age="age"></o-consumer>

<script>
export default {
  data:{
    age: 0,
  },
};
</script>
```

## Grundlegendes Beispiel

<o-playground name="Grundlegendes Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" user-id="9527">
        <o-page src="page1.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./user-avatar.html"></l-m>
      <l-m src="./user-name.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #007acc;
          padding: 10px;
        }
      </style>
      <user-avatar></user-avatar>
      <div>Benutzer-ID: {{userId}}</div>
      <user-name></user-name>
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default {
          data:{
            userId: 0,
          },
        };
      </script>
    </template>
  </code>
  <code path="user-avatar.html">
    <template component>
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(68, 107, 133, 1);
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      </style>
      {{userId}}Avatar
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-avatar",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="user-name.html">
    <template component>
      <style>
        :host {
          display: block;
          color: rgba(204, 153, 0, 1);
        }
      </style>
      Benutzer-{{userId}}
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-name",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
</o-playground>

## o-root-provider Root-Provider

`o-root-provider` ist der globale Anbieter der Root-Ebene, dessen Geltungsbereich das gesamte Dokument ist. Selbst wenn es keinen übergeordneten Provider gibt, können Verbraucher die Daten des Root-Anbieters abrufen.

```html
<!-- Definieren Sie den globalen Root-Provider -->
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- Kann an beliebiger Stelle auf der Seite konsumiert werden -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

### Eigenschaften

1. **Globaler Gültigkeitsbereich**: Die Daten des Root-Providers sind auf der gesamten Seite verfügbar.
2. **Priorität**: Wenn gleichzeitig ein Provider und ein Root-Provider mit demselben Namen existieren, hat der Provider, der dem Consumer am nächsten ist, Vorrang.
3. **Entfernbar**: Nach dem Entfernen des Root-Providers fällt der Consumer auf die Suche nach anderen Providern zurück.

## root-provider Beispiel

<o-playground name="root-provider Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./header.html"></l-m>
      <l-m src="./content.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .info {
          padding: 10px;
          border: 1px solid #007acc;
        }
      </style>
      <div class="info">
        <div>Thema: {{theme}}</div>
        <div>Sprache: {{language}}</div>
      </div>
      <header-com></header-com>
      <content-com></content-com>
      <o-consumer name="globalConfig" watch:custom-theme="theme" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          data: {
            theme: "",
            language: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="header.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: #333;
          color: white;
        }
      </style>
      Header - Thema: {{theme}}
      <o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
      <script>
        export default {
          tag:"header-com",
          data: {
            theme: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="content.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: rgba(137, 133, 133, 1);
        }
      </style>
      Content - Sprache: {{language}}
      <o-consumer name="globalConfig" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          tag:"content-com",
          data: {
            language: "",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### Beispiel für Prioritäten

```html
<o-root-provider name="test" custom-value="root"></o-root-provider>

<o-provider name="test" custom-value="parent">
 ...
 <!-- Hier👇 erhaltenes custom-value ist "parent" -->
 <o-consumer name="test"></o-consumer>
 ...
</o-provider>

<!-- Hier👇 erhaltenes custom-value ist "root" -->
<o-consumer name="test"></o-consumer>

```

### Prioritätsbeispiel-Demonstration

<o-playground name="Prioritätsbeispiel-Demo" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="test" custom-value="root"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./child.html"></l-m>
      <o-provider name="test" custom-value="parent">
        <div style="padding: 10px; border: 1px solid #007acc;">
          <p>Wert im elterlichen Provider: {{parentValue}}</p>
          <child-com></child-com>
        </div>
        <o-consumer name="test" watch:custom-value="parentValue"></o-consumer>
      </o-provider>
      <div style="padding: 10px; border: 1px solid #cc6600; margin-top: 10px;">
        <p>Wert des Root-Providers: {{rootValue}}</p>
      </div>
      <child-com></child-com>
      <o-consumer name="test" watch:custom-value="rootValue"></o-consumer>
      <script>
        export default () => ({
          data: {
            parentValue: "",
            rootValue: "",
          },
        });
      </script>
    </template>
  </code>
  <code path="child.html">
    <template component>
      <div style="padding: 10px;  border: 1px dashed gray;">
        Wert in der Kind-Komponente: {{customValue}} (am nächsten ist {{customValue}} provider)
      </div>
      <o-consumer name="test" watch:custom-value="customValue"></o-consumer>
      <script>
        export default () => ({
          tag:"child-com",
          data: {
            customValue: "",
          },
        });
      </script>
    </template>
  </code>
</o-playground>

## getProvider(name) Methode

`getProvider(name)` ist eine Instanzmethode, um das Provider-Element mit dem entsprechenden Namen zu erhalten. Es sucht entlang des DOM nach dem nächstgelegenen übergeordneten Provider. Wenn keiner gefunden wird, wird der root-provider zurückgegeben.

### In der Komponente oder im Seitenmodul die Methode getProvider(name) verwenden

```html
<script>
...
proto:{
  changeValue(){
    const provider = this.getProvider("name");
    provider.customValue = "new value";
  }
}
...
</script>
```

## getProvider Beispiel

<o-playground name="getProvider Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" custom-name="Max" custom-age="25">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <button on:click="getProviderData">Provider-Daten abrufen</button>
      <div>Aktueller Name: {{currentName}}</div>
      <div>Aktuelles Alter: {{currentAge}}</div>
      <div style="margin-top: 10px;">
        <button on:click="updateProvider">Provider-Daten ändern</button>
      </div>
      <o-consumer name="userInfo" watch:custom-name="currentName" watch:custom-age="currentAge"></o-consumer>
      <script>
        export default {
          data: {
            currentName: "",
            currentAge: 0,
          },
          proto: {
            getProviderData() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                console.log("Provider gefunden:", provider);
                console.log("Name:", provider.customName);
                console.log("Alter:", provider.customAge);
                alert(`Provider-Daten: ${provider.customName}, ${provider.customAge} Jahre`);
              }
            },
            updateProvider() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                provider.customName = "Lisa";
                provider.customAge = 30;
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### Provider über das Element abrufen

```javascript
// Den Provider des aktuellen Elements abrufen
const provider = $(".my-element").getProvider("userInfo");

if (provider) {
  console.log("Anbieter gefunden:", provider.customName);
}

// Direkt den globalen Root-Provider abrufen
const globalProvider = $.getRootProvider("globalConfig");
```

### Verwendungsszenarien

1. **Manuelle Datenbeschaffung**: Verwendung in Szenarien, bei denen direkt auf die Daten des Providers zugegriffen werden muss  
2. **Über Shadow DOM hinweg**: Suche nach einem Provider auf einer höheren Ebene innerhalb des Shadow DOM  
3. **Ereignisbehandlung**: Abrufen des entsprechenden Providers in Ereignis-Callbacks

## dispatch Ereignisverteilung

Der Provider kann Ereignisse an alle Consumer, die ihn konsumieren, senden:

```html
<o-provider name="test" id="myProvider" custom-value="Hello">
  <o-consumer name="test" on:custom-event="handleEvent">
    <div>{{customValue}}</div>
  </o-consumer>
</o-provider>

<script>
// Ereignis auslösen
$("#myProvider").dispatch("custom-event", {
  data: { message: "Hello World" }
});
</script>
```

## Beispiel für die Ereignisverteilung

<o-playground name="Ereignis-Dispatch-Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="chat" custom-messages='["Willkommen im Chatraum"]' id="chatProvider">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./chat-list.html"></l-m>
      <l-m src="./chat-input.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
        }
      </style>
      <h3>Chatraum</h3>
      <chat-list></chat-list>
      <chat-input></chat-input>
    </template>
  </code>
  <code path="chat-list.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
          max-height: 200px;
          overflow-y: auto;
        }
        .message {
          padding: 5px;
          margin: 5px 0;
          background: gray;
          border-radius: 4px;
        }
      </style>
      <div class="messages">
        <o-fill :value="messages">
          <div class="message">{{$data}}</div>
        </o-fill>
      </div>
      <o-consumer name="chat" on:new-message="addMessage"></o-consumer>
      <script>
        export default {
          tag:"chat-list",
          data: {
            messages: [],
          },
          proto: {
            addMessage(event) {
              this.messages.push(event.data.text);
            },
          },
        };
      </script>
    </template>
  </code>
  <code path="chat-input.html">
    <template component>
      <style>
        :host {
          display: flex;
          gap: 10px;
        }
        input {
          flex: 1;
          padding: 8px;
        }
        button {
          padding: 8px 16px;
          background: #007acc;
          color: white;
          border: none;
          cursor: pointer;
        }
      </style>
      <input type="text" sync:value="inputText" placeholder="Nachricht eingeben...">
      <button on:click="sendMessage">Senden</button>
      <script>
        export default {
          tag:"chat-input",
          data: {
            inputText: "",
          },
          proto: {
            sendMessage() {
              const provider = this.getProvider("chat");
              if (provider && this.inputText.trim()) {
                provider.dispatch("new-message", {
                  data: { text: this.inputText }
                });
                this.inputText = "";
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## Beste Praktiken

1. **Sinnvolle Benennung**: Verwenden Sie sinnvolle Namen für Provider und Consumer, um die Nachverfolgung und Wartung zu erleichtern.
2. **Übermäßige Verwendung vermeiden**: Der Kontextstatus eignet sich für die gemeinsame Nutzung von Daten zwischen Komponenten. Für normale Eltern-Kind-Komponenten wird die Verwendung von Props empfohlen.
3. **Root-Provider für globale Konfigurationen**: Themen, Sprachen, globale Zustände usw. eignen sich für die Verwendung des Root-Providers.
4. **Rechtzeitige Bereinigung**: Wenn der Provider entfernt wird, löscht der Consumer automatisch die Daten, ohne dass ein manuelles Eingreifen erforderlich ist.