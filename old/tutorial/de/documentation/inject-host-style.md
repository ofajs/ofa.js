# Host-Stile einfügen

In Web Components ist es aufgrund der Einschränkungen von `slot`-Elementen nicht möglich, direkt die Stile von mehrschichtigen Elementen innerhalb eines Slots festzulegen. Um dieses Problem zu lösen, stellt ofa.js die Komponente `<inject-host>` bereit, die es ermöglicht, innerhalb einer Komponente Stile in das Host-Element einzufügen und so die Stile mehrschichtiger Elemente innerhalb von Slot-Inhalten zu steuern.

> Hinweis: Es wird empfohlen, zuerst den [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) Selektor zu verwenden, um das Styling des Slot-Inhalts festzulegen. Verwenden Sie die `<inject-host>` Komponente nur dann, wenn die Anforderungen nicht erfüllt werden können.

## Grundlegende Verwendung

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* Stile für direkte Kindelemente festlegen */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* Mehrstufige verschachtelte Stile können ebenfalls gesetzt werden */
            user-list user-list-item .user-list-item-content {
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag: "user-list",
                // ...
            };
        };
    </script>
</template>
```

## Fallbeispiel

Das folgende Beispiel zeigt, wie man mit `<inject-host>` die Stile von geschachtelten Elementen innerhalb eines Slots setzt. Wir erstellen zwei Komponenten: die `user-list`-Komponente als Listen-Container und die `user-list-item`-Komponente als Listeneintrag. Durch `<inject-host>` können wir in der `user-list`-Komponente die Stile von `user-list-item` und dessen inneren Elementen festlegen.

<o-playground name="Host-Styles einfügen" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>Max Mustermann</span>
          <span slot="age">25</span>
        </user-list-item>
        <user-list-item>
          <span class="item-name">Erika Mustermann</span>
          <span slot="age">30</span>
        </user-list-item>
      </user-list>
    </template>
  </code>
  <code path="user-list.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 10px;
        }
      </style>
      <inject-host>
        <style>
          user-list user-list-item {
            background-color: blue;
            display: block;
            padding: 10px;
            margin: 5px 0;
          }
          user-list user-list-item .item-name {
            color: red;
            font-weight: bold;
          }
        </style>
      </inject-host>
      <slot></slot>
      <script>
        export default async () => {
          return {
            tag: "user-list",
          };
        };
      </script>
    </template>
  </code>
  <code path="user-list-item.html">
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
      <div class="item-age">
        Alter: <slot name="age"></slot>
      </div>
      <script>
        export default async () => {
          return {
            tag: "user-list-item",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Im Ergebnis ist zu sehen:- Die Hintergrundfarbe der Komponente `user-list-item` ist aqua (gesetzt über das `<inject-host>` der Komponente `user-list`)
- Die Textfarbe des Namens ist rot (gesetzt über den `user-list-item .item-name`-Stil des `<inject-host>` der Komponente `user-list`)

## Funktionsweise

`<inject-host>` Komponente injiziert die Inhalte des enthaltenen `<style>`-Tags in das Host-Element der Komponente. Dadurch können die injizierten Stilregeln die Komponentengrenzen durchdringen und auf Elemente innerhalb des Slots wirken.

Auf diese Weise kannst du:- Stile für Elemente beliebiger Tiefe im Slot-Inhalt festlegen
- Verwenden eines vollständigen Selektorpfads, um sicherzustellen, dass die Stile nur auf das Zielelement wirken
- Die Kapselung der Komponentenstile beibehalten und gleichzeitig einen flexiblen Stildurchgriff ermöglichen

## Hinweise

⚠️ **Stil-Kontaminationsrisiko**: Da die injizierten Stile auf den Bereich des Wirtselements angewendet werden, können sie auch Elemente in anderen Komponenten beeinflussen. Beachten Sie bei der Verwendung unbedingt folgende Grundsätze:

1. **Verwenden Sie spezifische Selektoren**: Verwenden Sie möglichst vollständige Komponenten-Tag-Pfade und vermeiden Sie zu allgemeine Selektoren.
2. **Fügen Sie ein Namespace-Präfix hinzu**: Fügen Sie Ihren Style-Klassen ein eindeutiges Präfix hinzu, um Konflikte mit anderen Komponenten zu reduzieren.
3. **Vermeiden Sie generische Tag-Selektoren**: Verwenden Sie nach Möglichkeit Klassen- oder Attribut-Selektoren anstelle von Tag-Selektoren.
4. **Überdenken Sie das Komponenten-Design**: Überlegen Sie, ob Sie durch Optimierung des Komponenten-Designs die Verwendung von `<inject-host>` vermeiden können. Beispielsweise ist die Verwendung des [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) Selektors in Verbindung mit untergeordneten Komponenten oft eleganter.

```html
<!-- Empfohlen ✅: Spezifische Selektoren verwenden -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- Nicht empfohlen ❌: Zu allgemeine Selektoren verwenden -->
<inject-host>
    <style>
        .content {  /* Leicht mit anderen Komponenten in Konflikt geraten */
            color: red;
        }
    </style>
</inject-host>
```

### Leistungstipps

Da `<inject-host>` die erneute Injektion von Host-Stilen auslöst und dadurch möglicherweise das Neuordnen oder Neuzeichnen von Komponenten verursacht, verwenden Sie es vorsichtig in Szenarien mit häufigen Aktualisierungen.  
Wenn Sie nur Stile für die Elemente der ersten Ebene innerhalb eines Slots festlegen müssen, verwenden Sie vorzugsweise den Pseudo-Klassen-Selektor [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted), um zusätzliche Rendering-Kosten durch durchdringende Injektion zu vermeiden und so eine bessere Leistung zu erzielen.