# Listen-Rendering

In ofa.js bietet die `o-fill`-Komponente leistungsstarke Listen-Render-Funktionen und kann Array-Daten effizient in mehrere ähnliche Elemente rendern. Sie unterstützt zwei Hauptverwendungsarten: Direktes Rendern und Template-Rendering.

## Einführung in die o-fill Komponente

`o-fill` ist eine Kernkomponente in ofa.js zur Listen-Rendering. Sie erhält ein Array-Attribut `value` und erzeugt für jeden Eintrag im Array ein entsprechendes DOM-Element. Während des Renderings verfolgt ofa.js automatisch Änderungen am Array und aktualisiert das DOM effizient.

### Hauptmerkmale:

- **Effiziente Aktualisierung**: Über Schlüsselwerte werden Array-Änderungen verfolgt und nur die betroffenen Teile aktualisiert
- **Indexzugriff**: Mit `$index` kann auf den Index des aktuellen Elements zugegriffen werden
- **Datenzugriff**: Mit `$data` erfolgt der Zugriff auf die Daten des aktuellen Elements
- **Host-Zugriff**: Über `$host` wird auf die aktuelle Komponenteninstanz zugegriffen, um Komponentenmethoden aufzurufen oder Komponentendaten abzurufen
- **Zugriff auf das übergeordnete Element**: In verschachtelten `o-fill`-Blöcken kann mit `$parent` auf die Daten des übergeordneten Elements zugegriffen werden
- **Vorlagenwiederverwendung**: Unterstützt die Nutzung benannter Vorlagen für komplexe Listenwiedergabe

## Direktes Rendern

Die direkte Renderung ist die einfachste Anwendung: Der Template-Inhalt wird direkt innerhalb des `o-fill`-Tags geschrieben. Wenn sich das Array ändert, erstellt `o-fill` automatisch für jeden Datensatz das entsprechende Element.

<o-playground name="o-fill - Direktes Rendern" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px; margin: 5px 0; background: #7e7e7e; border-radius: 4px; }
      </style>
      <h3>Obstliste</h3>
      <button on:click="addItem">Obst hinzufügen</button>
      <button on:click="removeItem">Letztes entfernen</button>
      <ul>
        <o-fill :value="fruits">
          <li> {{$index + 1}}. {{$data.name}} - Preis: ¥{{$data.price}} <button on:click="$host.removeItem($index)">Löschen</button></li>
        </o-fill>
      </ul>
      <script>
        export default async () => ({
          data: { 
            fruits: [
              { name: "🍎 Apfel", price: 5 },
              { name: "🍊 Orange", price: 6 },
              { name: "🍌 Banane", price: 3 }
            ],
            fruitIndex: 0,
          },
          proto: {
            addItem() {
              const fruitNames = ["🍇 Traube", "🍓 Erdbeere", "🥝 Kiwi", "🍑 Pfirsich", "🥭 Mango"];
              const name = fruitNames[this.fruitIndex % fruitNames.length];
              this.fruits.push({ 
                name: name, 
                price: Math.floor(Math.random() * 10) + 1 
              });
              this.fruitIndex++;
            },
            removeItem(index) {
              if (index >= 0 && index < this.fruits.length) {
                this.fruits.splice(index, 1);
                return;
              }
              this.fruits.length && this.fruits.pop();
            }
          }
        });
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel können wir sehen:- `$index` steht für den Index des aktuellen Elements (beginnend bei 0)
- `$data` steht für das Datenobjekt des aktuellen Elements
- `$host` steht für die aktuelle Komponenteninstanz, die zum Aufrufen von Komponentenmethoden oder zum Zugreifen auf Komponentendaten verwendet werden kann
- Wenn sich das Array ändert, wird die Liste automatisch aktualisiert

## Vorlagen-Rendering

Für komplexere Listenelementstrukturen kann der Ansatz benannter Vorlagen verwendet werden. Definieren Sie die Vorlage im `template`-Tag und referenzieren Sie sie dann in `o-fill` über das `name`-Attribut.

<o-playground name="o-fill - Vorlagen-Rendering" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        .product-card { border: 1px solid #747474; border-radius: 8px; padding: 12px; margin: 10px 0; }
        .product-name { font-weight: bold; font-size: 1.1em; }
        .product-price { color: #832c22; font-weight: bold; }
        .product-desc { color: #929292; font-size: 0.9em; margin-top: 5px; }
      </style>
      <h3>Produktliste</h3>
      <button on:click="addProduct">Produkt hinzufügen</button>
      <div class="products-container">
        <o-fill :value="products" name="product-template"></o-fill>
      </div>
      <template name="product-template">
        <div class="product-card">
          <div class="product-name">{{$data.name}}</div>
          <div class="product-price">¥{{$data.price}}</div>
          <div class="product-desc">{{$data.description}}</div>
          <small>Nr.: {{$index + 1}}</small>
        </div>
      </template>
      <script>
        export default async () => ({
          data: {
            products: [
              { name: "MacBook Pro", price: 12999, description: "Hochleistungs-Laptop, geeignet für professionelle Arbeiten" },
              { name: "iPhone 15", price: 5999, description: "Neuestes Smartphone mit hervorragender Fotoqualität" },
              { name: "AirPods Pro", price: 1999, description: "Kabellose Rauschunterdrückungskopfhörer mit exzellentem Klang" }
            ],
            productIndex: 0,
          },
          proto: {
            addProduct() {
              const productNames = ["iPad Air", "Apple Watch", "Magic Mouse", "Pro Display"];
              const productDescs = ["Leichtes und tragbares Tablet", "Intelligente Uhr, Gesundheitsüberwachung", "Ergonomisch gestaltete Maus", "Professioneller Monitor"];
              const name = productNames[this.productIndex % productNames.length];
              const desc = productDescs[this.productIndex % productDescs.length];
              this.products.push({
                name: name,
                price: Math.floor(Math.random() * 5000) + 1000,
                description: desc
              });
              this.productIndex++;
            }
          }
        });
      </script>
    </template>
  </code>
</o-playground>

## Verschachtelte Listen rendern

`o-fill` unterstützt verschachtelte Verwendung und kann komplexe hierarchische Datenstrukturen wie Baummenüs, Kategorielisten usw. verarbeiten.

<o-playground name="o-fill - Verschachtelte Listendarstellung" style="--editor-height: 800px">
  <code>
    <!-- Verschachtelte Listendarstellung -->
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .category {
          border-left: 3px solid #3498db;
          padding-left: 15px;
          margin: 10px 0;
        }
        .subcategory {
          border-left: 2px solid #9b59b6;
          padding-left: 15px;
          margin: 8px 0;
        }
        .item {
          padding: 5px 0;
          margin: 5px 0;
          color: #2c3e50;
        }
        h4 {
          margin: 10px 0 5px 0;
          color: #34495e;
        }
      </style>
      <h3>Navigationsbereich für Produktkategorien</h3>
      <div class="navigation">
        <o-fill :value="categories" name="category-template"></o-fill>
      </div>
      <template name="category-template">
        <div class="category">
          <h4> {{$data.name}} </h4>
          <o-fill :value="$data.subcategories" name="subcategory-template"></o-fill>
        </div>
      </template>
      <template name="subcategory-template">
        <div class="subcategory">
          <strong>{{$data.name}}</strong>
          <o-fill :value="$data.items">
            <div class="item"> • {{$data}} </div>
          </o-fill>
        </div>
      </template>
      <script>
        export default async () => {
          return {
            data: {
              categories: [
                {
                  name: "Elektronikprodukte",
                  subcategories: [
                    {
                      name: "Handys",
                      items: ["iPhone", "Android-Handys", "Feature-Phones"]
                    },
                    {
                      name: "Computer",
                      items: ["Laptops", "Desktop-Computer", "Tablets"]
                    }
                  ]
                },
                {
                  name: "Haushaltswaren",
                  subcategories: [
                    {
                      name: "Küchenutensilien",
                      items: ["Kochtöpfe", "Geschirr", "Kleingeräte"]
                    },
                    {
                      name: "Schlafzimmerartikel",
                      items: ["Bettwäsche", "Kleiderschränke", "Dekorationen"]
                    }
                  ]
                },
                {
                  name: "Bekleidung & Accessoires",
                  subcategories: [
                    {
                      name: "Herrenbekleidung",
                      items: ["T-Shirts", "Hemden", "Jacken"]
                    },
                    {
                      name: "Damenbekleidung",
                      items: ["Kleider", "Hosen", "Accessoires"]
                    }
                  ]
                }
              ]
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Das obige Beispiel zeigt das grundlegende Rendern von verschachtelten Listen. Wenn Sie in einem verschachtelten `o-fill` auf die Daten des übergeordneten Elements zugreifen müssen, können Sie `$parent` verwenden.

### Zugriff auf übergeordnete Daten mit $parent

> **Versionsanforderung**: Die Funktion `$parent` erfordert ofa.js Version 4.7.0 oder höher.

In verschachtelten `o-fill` können Sie `$parent` verwenden, um auf die Daten des übergeordneten Elements zuzugreifen. Um `$parent` zu aktivieren, müssen Sie das Attribut `:_$parent="$data"` zum verschachtelten `o-fill` hinzufügen.

**Wichtige Regeln:**- Die erste Ebene `o-fill` benötigt kein `_$parent`, verwendet `$host` zum Zugriff auf Komponentendaten
- Verschachtelte `o-fill`（ab der zweiten Ebene）verwenden `:_$parent="$data"`, um übergeordnete Daten zu übergeben
- `_$parent` akzeptiert nur `$data`, um einen klaren Datenfluss zu gewährleisten

### $parent Anwendungsbeispiel

Das folgende Beispiel zeigt, wie Sie in einem verschachtelten `o-fill` mit `$parent` auf die Daten des übergeordneten Elements zugreifen:

<o-playground name="o-fill - $parent Verwendungsbeispiel" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 20px; }
        .category { background: #e3f2fd; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .item { background: #fff; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #2196f3; }
      </style>
      <h3>Kategorieliste</h3>
      <o-fill :value="categories">
        <div class="category">
          <h4>Kategorie: {{$data.name}}</h4>
          <o-fill :value="$data.items" :_$parent="$data">
            <div class="item">
              <div>Produkt: {{$data}}</div>
              <div>Zugehörige Kategorie: {{$parent.name}}</div>
            </div>
          </o-fill>
        </div>
      </o-fill>
      <script>
        export default async () => {
          return {
            data: {
              categories: [
                {
                  name: "Obst",
                  items: ["Apfel", "Banane", "Orange"]
                },
                {
                  name: "Gemüse",
                  items: ["Tomate", "Gurke", "Aubergine"]
                }
              ]
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem einfachen Beispiel:- **Erste Ebene o-fill**：Durchläuft das Kategorie-Array, `$data.name` ist der Kategoriename
- **Verschachtelter o-fill**：Verwendet `:_$parent="$data"`, um die übergeordneten Kategoriedaten zu übergeben
- **$parent Zugriff**：In der verschachtelten Ebene wird über `$parent.name` auf den Namen der übergeordneten Kategorie zugegriffen

## Leistungsoptimierung und Schlüssel-Wert-Verwaltung

Für Listen, die häufig aktualisiert werden müssen, kann das eindeutige Identifikationsmerkmal über das Attribut `fill-key` angegeben werden, um die Rendering-Leistung zu verbessern.

```html
<!-- Verwendung eines benutzerdefinierten Schlüssels zur Leistungssteigerung -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

Im obigen Beispiel teilt `fill-key="id"` ofa.js mit, die `id`-Eigenschaft jedes Datensatzes als eindeutigen Identifikator zu verwenden, sodass auch bei einer Änderung der Reihenfolge des Arrays die entsprechenden Elemente korrekt erkannt und aktualisiert werden können.

## Best Practices für das Rendern von Listen

1. **Ereignisverarbeitung**: Bei der Verwendung von Ereignissen in Listenelementen beachten Sie, dass `$host` auf die aktuelle Komponenteninstanz und `$data` auf die aktuellen Elementdaten verweist.
2. **Auswahl der geeigneten Rendermethode**: Einfache Listen mit direktem Rendern, komplexe Strukturen mit Template-Rendering.
3. **Leistungsaspekte**: Für große oder häufig aktualisierte Listen mit `fill-key` einen Schlüsselwert angeben.
4. **Datenstruktur**: Sicherstellen, dass jedes Element im Array ein gültiges Datenobjekt ist.
5. **Übermäßige Verschachtelung vermeiden**: Obwohl Verschachtelung unterstützt wird, sollte eine zu tiefe Verschachtelungsebene vermieden werden.
6. **Korrekte Verwendung von $parent**:
   - `$parent` nur in verschachtelten `o-fill` verwenden.
   - Muss mit `:_$parent="$data"` aktiviert werden, um `$parent` zu nutzen.
   - Die erste `o-fill`-Ebene verwendet `$host` für den Zugriff auf Komponentendaten, nicht `$parent`.
   - `_$parent` akzeptiert nur `$data`, keine anderen Werte übergeben.

## Zusammenfassung der Variablenverwendung

In `o-fill` haben verschiedene Variablen unterschiedliche Verwendungszwecke und Einsatzszenarien:

| Variable | Verwendung | Anwendungsszenario | Beispiel |
|------|------|----------|------|
| `$host` | Zugriff auf Daten und Methoden der Komponenteninstanz | erste Ebene von `o-fill` | `{{$host.totalAmount}}` |
| `$data` | Daten des aktuellen Iterationselements | alle Ebenen von `o-fill` | `{{$data.name}}` |
| `$index` | Index des aktuellen Elements | alle Ebenen von `o-fill` | `{{$index + 1}}` |
| `$parent` | Daten des übergeordneten Elements | verschachteltes `o-fill` (ab der zweiten Ebene) | `{{$parent.orderName}}` |### Datenzugriffsebene Beispiel

```
Komponentendaten (totalAmount, orders)
  │
  └─ Erste Ebene o-fill: :value="orders"
      │  Zugriff auf Komponentendaten mit $host: {{$host.totalAmount}}
      │  Zugriff auf aktuelle Bestellung mit $data: {{$data.orderName}}
      │
      └─ Zweite Ebene o-fill: :value="$data.items" :_$parent="$data"
          │  $parent verweist auf die Bestelldaten der ersten Ebene
          │  $data ist jedes Element von items
          │  Zugriff möglich auf: {{$parent.orderName}}, {{$data.name}}
```

Durch die korrekte Verwendung dieser Variablen können komplexe Szenarien mit verschachtelten Listen-Renderings problemlos gehandhabt werden.