# Zustandsverwaltung

## Was ist Zustand

In ofa.js bezeichnet **Status** das `data`-Attribut einer Komponente oder Seitenmoduls selbst. Dieser Status kann nur innerhalb der aktuellen Komponente verwendet werden, um interne Daten der Komponente zu speichern und zu verwalten.

Wenn mehrere Komponenten oder Seiten dieselben Daten gemeinsam nutzen müssen, werden Daten traditionell durch Ereignisweitergabe oder schrittweise Props-Weitergabe übergeben. Diese Methode führt in komplexen Anwendungen zu schwer wartbarem Code. Daher ist eine **Zustandsverwaltung** erforderlich – durch die Definition eines gemeinsamen Zustandsobjekts, auf das mehrere Komponenten oder Seitenmodule zugreifen und dieses ändern können, wird eine gemeinsame Nutzung des Zustands ermöglicht.

> **Tipp**: Statusverwaltung eignet sich für Szenarien, in denen Daten über Komponenten und Seiten hinweg geteilt werden müssen, wie z. B. Benutzerinformationen, Warenkorb, Theme-Konfiguration, globale Einstellungen etc.

## Generieren des Statusobjekts

Erstellen Sie mit `$.stanz({})` ein reaktives Zustandsobjekt. Diese Methode nimmt ein einfaches Objekt als Ausgangsdaten entgegen und gibt einen reaktiven Zustandsproxy zurück.

### Grundlegende Verwendung (Globaler Status)

<o-playground name="Zustandsverwaltungsbeispiel" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // Startseite der App
    export const home = "./list.html";
    // Konfiguration der Seitenübergangsanimation
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="data.js">
  export const contacts = $.stanz({
    list: [{
        id: 10010,
        name: "Pete",
        info: "Jeder Tag ist ein neuer Anfang, nach dem Regen kommt die Sonne.",
    },{
        id: 10020,
        name: "Mike",
        info: "Das Leben ist wie ein Ozean, nur wer einen starken Willen hat, kann das andere Ufer erreichen.",
    },{
        id: 10030,
        name: "John",
        info: "Das Geheimnis des Erfolgs liegt darin, an seinen Träumen festzuhalten und niemals aufzugeben.",
    }]
  });
  // await fetch("/list.api").then(e=>e.json()).then(list=>data.list = list)
  </code>
  <code path="list.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <h2>Kontaktliste</h2>
      <ul>
        <o-fill :value="list">
          <li>
          Name: {{$data.name}} <button on:click="$host.gotoDetail($data)">Detail</button>
          </li>
        </o-fill>
      </ul>
      <script>
        export default async ({load}) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              list:[]
            },
            proto:{
                gotoDetail(user){
                    this.goto(`./detail.html?id=${user.id}`);
                }
            },
            attached(){
              this.list = contacts.list;
            },
            detached(){
              this.list = []; // Wenn die Komponente zerstört wird, die angehängten Zustandsdaten löschen
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="detail.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        .avatar{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(204, 204, 204, 1);
            color: rgba(58, 58, 58, 1);
        }
        .user-info{
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Zurück</button> </div>
      <div class="user-info">
        <div class="avatar">Avatar</div>
        <div style="font-size: 24px;">
        Benutzername: 
          <o-if :value="editorMode">
            <input type="text" sync:value="userData.name"/>
            <button on:click="editorMode = false">✅</button>
          </o-if>
          <o-else>
            <span>{{userData.name}}</span>
            <button on:click="editorMode = true">🖊️</button>
          </o-else>
        </div>
        <div style="font-size: 16px;">Benutzer-ID: {{userData.id}}</div>
        <p style="font-size: 14px;">{{userData.info}}</p>
      </div>
      <script>
        export default async ({ load,query }) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              userData:{},
              editorMode:false
            },
            attached(){
              this.userData = contacts.list.find(e=>e.id == query.id);
            },
            detached(){
              this.userData = {}; // Wenn die Komponente zerstört wird, die angehängten Zustandsdaten löschen
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Eigenschaften des Zustandsobjekts

### 1. Reaktives Update

`$.stanz()` erzeugte Statusobjekte sind reaktiv. Wenn sich die Statusdaten ändern, werden alle Komponenten, die diese Daten referenzieren, automatisch aktualisiert.

```javascript
const store = $.stanz({ count: 0 });

// In der Komponente
export default {
  data: {
    store: {},
  },
  proto: {
    increment() {
      store.count++; // Alle Komponenten, die auf store.count verweisen, werden automatisch aktualisiert
    },
  },
  attached() {
    // Direkt auf die Eigenschaft des Zustandsobjekts verweisen
    this.store = store;
  },
  detached() {
    this.store = {}; // Wenn die Komponente zerstört wird, die angehängten Zustandsdaten leeren
  },
};
```

### 2. Tiefe Responsivität

Zustandsobjekte unterstützen tiefe Reaktivität, Änderungen in verschachtelten Objekten und Arrays werden ebenfalls überwacht.

```javascript
const store = $.stanz({
  user: {
    name: "ZhangSan",
    settings: {
      theme: "dark",
    },
  },
  list: [],
});

// Das Ändern verschachtelter Eigenschaften löst ebenfalls ein Update aus
store.user.name = "LiSI";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "Neue Aufgabe" });
```

## Beste Praktiken

### 1. Status beim attached-Zyklus des Components mounten

Es wird empfohlen, den gemeinsamen Zustand im `attached`-Lebenszyklus der Komponente zu mounten.

```javascript
export default {
  data: {
    list: [],
  },
  attached() {
    // Gemeinsamen Zustand an die data-Komponente anhängen
    this.list = data.list;
  },
  detached() {
    // Beim Zerstören der Komponente die angehängten Zustandsdaten leeren, um Speicherverluste zu vermeiden
    this.list = [];
  },
};
```

### 2. Sinnvolle Verwaltung des Zustandsbereichs

Der Gültigkeitsbereich des Zustands hängt von der **Definitionsposition und der Exportmethode** ab:

**In einer eigenständigen JS-Datei exportierter Zustand**:Globaler Zustand, auf den die gesamte Anwendung zugreifen und ihn ändern kann, nach dem Import mit `import` oder `load`.

```javascript
// user-store.js
export const userStore = $.stanz({ user: null, theme: "light" });
```

**Zustand, der innerhalb von Seiten- oder Komponentenmodulen definiert ist**: Modulzustand, der nur innerhalb dieses Moduls verwendet wird.

```html
<template component>
  ...
  <script>
    const localStore = $.stanz({ total: 0 });

    export default async () => {
      return {
        data: {
          localStore: {}
        },
        attached() {
          this.localStore = localStore;
        },
        detached() {
          // Beim Zerstören der Komponente die eingehängten Zustandsdaten leeren
          this.localStore = {};
        }
      };
    };
  </script>
</template>
```

## Statusverwaltung innerhalb des Moduls

<o-playground name="Beispiel für Zustandsverwaltung innerhalb eines Moduls" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 8px;
        }
      </style>
      <button on:click="addItem">Add Item</button>
      <o-fill :value="list">
        <div>{{$index}} - <demo-comp :val="$data.val"></demo-comp></div>
      </o-fill>
      <script>
        export default async () => {
          return {
            data: {
                list:[{
                    val:Math.random().toString(36).slice(2, 6)
                }]
            },
            proto:{
                addItem(item){
                    this.list.push({
                        val:Math.random().toString(36).slice(2, 6)
                    });
                }
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host{
            display: inline-block;
        }
      </style>
      {{val}} - {{cartStore.total}} <button on:click="addStoreTotal">Add Store Total</button>
      <script>
        const cartStore = $.stanz({ total: 0 });
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
                val:"",
                cartStore:{}
            },
            proto:{
                addStoreTotal(){
                    this.cartStore.total++;
                }
            },
            attached(){
                this.cartStore = cartStore;
            },
            detached(){
                this.cartStore = {}; // Beim Zerstören der Komponente den gemounteten Zustand leeren
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Hinweise

1. **Zustandsbereinigung**: Bereinigen Sie im Lebenszyklus "detached" der Komponente rechtzeitig die Verweise auf Zustandsdaten, um Speicherlecks zu vermeiden.

2. **Zirkuläre Abhängigkeiten vermeiden**: Zwischen Zustandsobjekten sollten keine zirkulären Verweise entstehen, da dies zu Problemen im reaktiven System führen kann.

3. **Große Datenstrukturen**: Ziehen Sie bei großen Datenstrukturen die Verwendung von berechneten Eigenschaften oder fragmentiertes Management in Betracht, um unnötige Leistungseinbußen zu vermeiden.

4. **Zustandskonsistenz**: Achten Sie bei asynchronen Operationen auf die Konsistenz des Zustands und verwenden Sie Transaktionen oder Batch-Updates, um die Datenintegrität zu gewährleisten.