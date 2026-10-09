# Komponente erstellen

In ofa.js ist die Komponente der Kernmechanismus zur Wiederverwendung und Modularisierung von Seiten. Eine Komponente ist im Wesentlichen ein benutzerdefiniertes Web Component, durch das Vorlagen, Stile und Logik definiert werden, um wiederverwendbare UI-Elemente zu erstellen.

## Grundstruktur der Komponente

Im Unterschied zum Seitenmodul verwendet das `<template>`-Element des Komponentenmoduls stattdessen die `component`-Eigenschaft und deklariert die `tag`-Eigenschaft, um den Komponenten-Tag-Namen anzugeben.

An der Stelle, an der die Komponente verwendet werden soll, wird das Komponentenmodul asynchron über das `l-m`-Tag geladen, und das System führt die Registrierung automatisch durch; danach kann die Komponente direkt wie ein normales HTML-Tag verwendet werden.

<o-playground name="Komponenten-Grundbeispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS Komponenten-Beispiel",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Komponenten-Kernkonzepte

### tag - Komponenten-Tag-Name

`tag` ist der Tag-Name der Komponente, **muss mit dem verwendeten Tag-Namen der Komponente übereinstimmen**. Beispiel: Wenn der `tag` Ihrer Komponente als `"demo-comp"` definiert ist, dann muss im HTML `<demo-comp></demo-comp>` verwendet werden.

Da Komponenten im Wesentlichen Web Components sind, **muss der Komponenten-Tag-Name einen Bindestrich `-` enthalten**. Dies ist eine Anforderung der Web-Component-Spezifikation, um Konflikte mit den Tag-Namen nativer HTML-Elemente zu vermeiden. Beispielsweise sind `demo-comp`, `my-button`, `user-card` usw. gültige Tag-Namen, während `democomp`, `button`, `card` usw. ohne Bindestrich ungültig sind.

### Komponenten-Modulreferenz

Durch das `l-m`-Tag wird ein Komponentenmodul eingefügt, das automatisch Komponenten registriert. Dies ähnelt der Verwendung des `script`-Tags zum Einbinden von Skripten, aber `l-m` ist speziell für das Laden und Registrieren von Komponentenmodulen vorgesehen.

> Hinweis: Das `l-m`-Referenz-Tag ist ein **asynchroner Verweis** und eignet sich zum bedarfsgesteuerten Laden von Komponenten beim Seitenaufruf.

## Synchronisierungszitat-Komponente

In manchen Szenarien musst du möglicherweise Komponenten synchron laden (z. B. um sicherzustellen, dass die Komponente vor der Verwendung vollständig registriert ist). In diesem Fall kannst du die `load`-Methode mit dem Schlüsselwort `await` verwenden, um einen synchronen Verweis zu implementieren.

In Komponenten- und Seitenmodulen wird automatisch die `load`-Funktion injiziert, damit Entwickler benötigte Ressourcen synchron laden können.

<o-playground name="Beispiel für synchrones Referenzieren von Komponenten" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <demo-comp></demo-comp>
      </div>
      <script>
        // eslint-disable-next-line
        export default async ({ load }) => {
          await load("./demo-comp.html");
          return {
            data: {},
            proto: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS Komponentenbeispiel",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Asynchrone Referenzen vs. synchrone Referenzen

| Referenzart | Stichwort | Merkmale |
|---------|-------|------|
| Asynchrone Referenz | `l-m`-Tag | Nicht-blockierendes Laden, geeignet für bedarfsgesteuertes Laden von Komponenten |
| Synchrone Referenz | `load`-Methode mit `await`-Schlüsselwort | Blockierendes Laden, stellt sicher, dass die Komponente vor der Verwendung registriert ist |`l-m`-Tag-Referenz und die `load`-Methode können beide Komponentenmodule laden. Im Allgemeinen wird empfohlen, den `l-m`-Tag zur asynchronen Referenzierung von Komponenten zu verwenden, um nicht blockierendes Laden und bedarfsgesteuertes Laden zu erreichen.