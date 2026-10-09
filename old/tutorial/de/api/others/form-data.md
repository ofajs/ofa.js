# formData



Die `formData`-Methode wird verwendet, um ein mit Formularelementen verknüpftes Objekt zu erzeugen, wodurch die Verarbeitung von Formularelementen einfacher und effizienter wird. Diese Methode erzeugt ein Objekt, das alle Werte der Formularelemente innerhalb des Zielelements enthält, und spiegelt Änderungen an den Formularelementen in Echtzeit wider.

Im folgenden Beispiel zeigen wir, wie man die `formData`-Methode verwendet, um mit Formularelementen verknüpfte Objektdaten zu generieren:

<o-playground name="formData - Grundlegende Verwendung" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" />
        <div>
          Geschlecht:
          <label>
            Mann
            <input type="radio" name="sex" value="man" />
          </label>
          <label>
            Frau
            <input type="radio" name="sex" value="woman" />
          </label>
        </div>
        <textarea name="message">Hallo Welt!</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData();
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel erstellen wir ein Formular, das ein Textfeld, Optionsschaltflächen und einen Textbereich enthält. Mit der `formData`-Methode erstellen wir ein Objekt `data`, das die Werte dieser Formularelemente enthält. Wir verwenden auch die `watch`-Methode, um Änderungen der Daten zu überwachen und die Daten in Echtzeit auf der Seite anzuzeigen. Wenn der Benutzer die Werte der Formularelemente ändert, wird das Objekt `data` entsprechend aktualisiert, was die Datenverarbeitung sehr einfach und effizient macht.

## umgekehrte Datenbindung

Die generierten Objektdaten besitzen ebenfalls die Fähigkeit zur Rückbindung, was bedeutet, dass beim Ändern einer Eigenschaft des Objekts die Werte der zugehörigen Formularelemente automatisch aktualisiert werden. Dies ist bei der Verarbeitung von Formulardaten sehr nützlich, da Sie so problemlos eine bidirektionale Datenbindung implementieren können.

Im folgenden Beispiel zeigen wir, wie die mit der Methode `formData` erzeugten Objektdaten verwendet werden, sowie wie eine Rückwärtsdatenbindung durchgeführt wird.

<o-playground name="formData - Rückwärtsbindung" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" />
        <div>
          Geschlecht:
          <label>
            Mann
            <input type="radio" name="sex" value="man" />
          </label>
          <label>
            Frau
            <input type="radio" name="sex" value="woman" />
          </label>
        </div>
        <textarea name="message">Hello World!</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData();
        setTimeout(()=>{
          data.username = "Yao";
          data.sex = "man";
          data.message = "ofa.js is good!";
        },1000);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel erstellen wir zunächst ein Formular, das ein Texteingabefeld, Optionsschaltflächen und einen Textbereich enthält. Anschließend generieren wir mit der `formData`-Methode ein Datenobjekt `data`. Durch Ändern der Eigenschaften des `data`-Objekts realisieren wir dann eine umgekehrte Datenbindung, d.h., die Werte der Formularelemente werden automatisch aktualisiert, wenn sich die Objekteigenschaften ändern. Diese Funktion der bidirektionalen Datenbindung macht die Interaktion mit Formulardaten wesentlich bequemer.

## Überwachen eines bestimmten Formulars

Standardmäßig überwacht die `formData()`-Methode alle `input`-, `select`- und `textarea`-Elemente innerhalb des Zielelements. Wenn Sie jedoch nur bestimmte Formularelemente überwachen möchten, können Sie dies durch Übergabe eines CSS-Selektors erreichen.

Im folgenden Beispiel zeigen wir, wie man durch Übergeben eines CSS-Selektors auf bestimmte Formularelemente lauschen kann:

<o-playground name="formData - spezifisches Formular" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" class="use-it" />
        <div>
          sex:
          <label>
            man
            <input type="radio" name="sex" value="man" class="use-it" />
          </label>
          <label>
            woman
            <input type="radio" name="sex" value="woman" class="use-it" />
          </label>
        </div>
        <textarea name="message">Dieses Formularelement ist nicht gebunden.</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData(".use-it");
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel möchten wir nur Formularelemente mit der Klasse "use-it" abhören, daher übergeben wir `".use-it"` als Argument an die `formData()`-Methode. Nur Formularelemente mit diesem Klassennamen werden abgehört und in das generierte Datenobjekt aufgenommen. Dies ist nützlich, um selektiv Formularelemente zu überwachen und deine Formulardaten präziser zu verwalten.

## Benutzerdefiniertes Formular

Die Verwendung von benutzerdefinierten Formularkomponenten ist sehr einfach, Sie müssen nur eine **Wert-Eigenschaft** zur benutzerdefinierten Komponente hinzufügen und das **Namens-Attribut** festlegen.

<o-playground name="formData - benutzerdefiniertes Formular" style="--editor-height: 500px">
  <code path="demo.html" preview active>
    <template>
      <div id="myForm">
        <input type="text" name="username" value="John Doe" />
        <l-m src="./custom-input.html"></l-m>
        <custom-input name="message"></custom-input>
        <div id="logger"></div>
      </div>
      <script>
        const data = $("#myForm").formData("input,custom-input");
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
  <code path="custom-input.html">
    <template component>
      <style>
        :host{
          display: block;
        }
        .editor {
          display: inline-block;
          min-width: 200px;
          line-height: 30px;
          height: 30px;
          border: #aaa solid 1px;
          border-radius: 4px;
          padding: 4px;
          font-size: 14px;
        }
      </style>
      <div
        class="editor"
        contenteditable="plaintext-only"
        :text="value"
        on:input="changeText"
      ></div>
      <script>
        export default {
          tag:"custom-input",
          attrs: {
            name: "",
          },
          data: {
            value: "Default txt",
          },
          proto: {
            changeText(e) {
              this.value = $(e.target).text;
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

Wenn Sie benutzerdefinierte Formularkomponenten verwenden, müssen Sie sie lediglich zu Ihrem Formular hinzufügen und die erforderliche `name`-Eigenschaft festlegen. Im obigen Beispiel haben wir die benutzerdefinierte Formularkomponente verwendet, indem wir das `<custom-input>`-Element hinzugefügt und die `name`-Eigenschaft gesetzt haben. Anschließend verwenden wir die `formData()`-Methode, um die Werte der Eingabeelemente und der benutzerdefinierten Komponenten zu überwachen, sodass wir die Formulardaten in Echtzeit abrufen und verarbeiten können. Diese Methode ermöglicht es Ihnen, Ihr Formular sehr einfach um benutzerdefinierte Formularkomponenten zu erweitern, um Ihren spezifischen Anforderungen gerecht zu werden.

## Verwendung von Formulardaten in Komponenten oder Seiten

Manchmal musst du Formulardaten innerhalb einer Komponente oder Seite verwenden und diese im `attached`-Lebenszyklus generieren und an die Komponente binden.

<o-playground name="formData - Verwendung innerhalb der Komponente" style="--editor-height: 600px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./form-data-demo.html"></l-m>
      <form-data-demo></form-data-demo>
    </template>
  </code>
  <code path="form-data-demo.html" active>
    <template component>
      <style>
        :host{
          display: block;
        }
      </style>
      <input type="text" name="username" value="John Doe" />
      <div>{{logtext}}</div>
      <script>
        export default {
          tag:"form-data-demo",
          data: {
            fdata:{},
            logtext: ""
          },
          watch:{
            fdata(data){
              if(data){
                this.logtext = JSON.stringify(data);
              }
            }
          },
          attached(){
            this.fdata = this.shadow.formData();
          }
        };
      </script>
    </template>
  </code>
</o-playground>

Durch den `attached`-Lebenszyklus, nachdem die Komponente bereit ist, verwenden wir die Methode `this.shadow.formData()`, um das Formulardatenobjekt `fdata` zu generieren.

`formData()` eignet sich besser für Formularszenarien mit relativ einfacher Interaktionslogik.