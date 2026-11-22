# Nicht explizite Komponenten

ofa.js enthält zwei implizite Komponenten:

* Bedingte Rendering-Komponenten: `x-if`, `x-else-if`, `x-else`
* Füllkomponente: `x-fill`

Die Funktionen dieser beiden Komponenten sind jeweils identisch mit den Komponenten `o-if` und `o-fill`, aber sie selbst werden nicht wirklich im DOM gerendert, sondern ihre inneren Elemente werden direkt in den entsprechenden Bereich gerendert.

zum Beispiel:

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- Der Stil ist nicht rot, da die o-if-Komponente selbst im DOM vorhanden ist -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- Der Stil ist rot, da die x-if-Komponente nicht in das DOM gerendert wird -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="Nicht-explizite Komponente" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* Wählt direkte untergeordnete .item-Elemente und färbt sie rot */
            color:red;
        }
        /* Muss .item-Elemente innerhalb der o-if-Komponente auswählen */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- Der Stil ist nicht rot, weil die o-if-Komponente selbst im DOM existiert -->
                <div class="item">Wird nicht rot angezeigt</div>
            </o-if>
            <x-if :value="true">
                <!-- Der Stil ist rot, weil die x-if-Komponente nicht ins DOM gerendert wird -->
                <div class="item">Wird rot angezeigt</div>
            </x-if>
        </div>
        <script>
        export default async () => {
            return {
            data: {},
            };
        };
        </script>
    </template>
  </code>
</o-playground>

## x-if-Komponente für bedingtes Rendering

`x-if` hat genau die gleiche Funktionalität wie [o-if](./conditional-rendering.md) und wird verwendet, um zu entscheiden, ob Inhalte basierend auf dem Wahrheitswert eines bedingten Ausdrucks gerendert werden sollen. Der Unterschied besteht darin, dass `x-if` selbst nicht als DOM-Element existiert; sein interner Inhalt wird direkt im übergeordneten Container gerendert.

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>Willkommen zurück, Benutzer!</p>
    </x-if>
</div>
```

`x-if` kann auch mit `x-else-if` und `x-else` verwendet werden:

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>Administrationsbereich</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>Benutzerzentrum</p>
    </x-else-if>
    <x-else>
        <p>Bitte anmelden</p>
    </x-else>
</div>
```

## x-fill Füllkomponente

`x-fill` hat die exakt gleiche Funktionalität wie [o-fill](./list-rendering.md) und wird verwendet, um Array-Daten in mehrere DOM-Elemente zu rendern. Ähnlich wie `x-if` wird `x-fill` selbst nicht ins DOM gerendert, sondern die innere Vorlage wird direkt in das übergeordnete Container-Element gerendert.

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

Beispiel für die Verwendung benannter Vorlagen:

```html
<ul>
    <x-fill name="li" :value="items"></x-fill>
</ul>

<template name="li">
    <li class:active="$data.active">
        <a attr:href="$data.href">{{$data.name}}</a>
    </li>
</template>
```

## Leistungshinweise

Abgesehen von den funktionalen Unterschieden ist die Rendering-Leistung von nicht-expliziten Komponenten **viel schlechter** als die von expliziten Komponenten (`o-if`, `o-fill`). Dies liegt daran, dass nicht-explizite Komponenten nicht tatsächlich im DOM gerendert werden und zusätzliche simulierte Rendering-Logik erfordern, um die Positionierung und Aktualisierung interner Elemente zu verarbeiten.

Darüber hinaus können implizite Komponenten einige schwer erkennbare Bugs verursachen: Da sie nicht wirklich in das DOM eintreten, können Operationen, die von der DOM-Struktur abhängen (wie Event-Bindungen, Stilberechnungen oder Abfragen durch Drittanbieter-Bibliotheken), unwirksam oder anomal sein.

Daher wird empfohlen, **vorzugsweise explizite Komponenten** (`o-if`, `o-else-if`, `o-else`, `o-fill`) zu verwenden und nicht explizite Komponenten nur in bestimmten Szenarien einzusetzen.

## Anwendungsszenario

Obwohl nicht-explizite Komponenten eine schlechtere Leistung aufweisen, können sie in den folgenden Szenarien verwendet werden:

1. **Vermeide zusätzliche DOM-Ebenen**: Wenn du nicht möchtest, dass `o-if`- oder `o-fill`-Elemente Teil der DOM-Struktur werden
2. **Stilvererbung**: Wenn du möchtest, dass innere Elemente direkt die Stile des übergeordneten Containers erben, ohne von Zwischenkomponenten beeinflusst zu werden
3. **Einschränkungen bei CSS-Selektoren**: Wenn du Eltern-Direktkind-Selektoren (wie `.container > .item`) verwenden musst, um Stile präzise zu steuern, aber keine zusätzlichen Wrapper-Elemente dazwischen haben willst