# Beispieldatenmerkmale

Die durch `$` abgerufenen oder erstellten Instanzobjekte besitzen vollständige stanz-Dateneigenschaften, da die `$`-Instanz von stanz abgeleitet ist. Dies bedeutet, dass Sie die von `stanz` bereitgestellten Datenoperationsmethoden und -eigenschaften nutzen können, um die Daten der Instanzobjekte zu manipulieren und zu überwachen.

> Die folgenden Beispiele verwenden reguläre Elemente, da benutzerdefinierte Komponenten normalerweise bereits registrierte Daten enthalten, während reguläre Elemente meist nur Tag-Informationen enthalten und daher besser für die Demonstration geeignet sind.

## watch



Instanzen können mithilfe der `watch`-Methode Änderungen von Werten überwachen; selbst wenn ein Wert eines Unterobjekts geändert wird, kann die Änderung in der `watch`-Methode des Objekts erfasst werden.

Unten ist ein Beispiel, das die Verwendung der `$`-Instanz und der `watch`-Methode demonstriert:

<o-playground name="stanz - watch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target.bbb = {
            child: {
              val: "I am bbb child val",
            },
          };
        }, 1200);
        setTimeout(() => {
          target.bbb.child.val = "change bbb child val";
        }, 1800);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel erstellen wir zunächst eine `$`-Instanz namens `target` und verwenden dann die Methode `watch`, um Änderungen daran zu überwachen. Selbst wenn wir Werte in untergeordneten Objekten ändern, z. B. den Wert von `target.bbb.child.val`, werden diese Änderungen von der Methode `watch` erkannt und der Inhalt des `logger`-Elements entsprechend aktualisiert. Dies zeigt die leistungsstarke Funktionalität der `$`-Instanz und ermöglicht es dir, Änderungen an Objekten mühelos zu überwachen.

## watchTick



`watchTick` und die `watch`-Methode haben eine ähnliche Funktionalität, aber `watchTick` verfügt intern über eine Drosselungsoperation, die in einem einzelnen Thread einmal ausgeführt wird. Daher kann es in Szenarien mit höheren Leistungsanforderungen effektiver auf Datenänderungen überwachen.

Hier ist ein Beispiel, das zeigt, wie man die `watchTick`-Methode einer `$`-Instanz verwendet:

<o-playground name="stanz - watchTick" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        let count1 = 0;
        target.watch(() => {
          count1++;
          \$("#logger1").text = 'watch-Läufe：' + count1;
        });
        let count2 = 0;
        target.watchTick(()=>{
          count2++;
          \$("#logger2").text = 'watchTick-Läufe：' + count2;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.bbb = "I am bbb";
          target.ccc = "I am ccc";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel erstellen wir zunächst eine `$`-Instanz `target`. Danach nutzen wir die Methoden `watch` und `watchTick`, um Änderungen am Objekt zu überwachen. Die Methode `watch` wird sofort bei einer Datenänderung ausgeführt, während `watchTick` innerhalb eines einzelnen Threads nur einmal läuft und dadurch die Häufigkeit der Überwachungsoperationen begrenzt. Je nach Bedarf kannst du `watch` oder `watchTick` wählen, um Datenänderungen zu beobachten.

## unwatch



Die `unwatch`-Methode wird verwendet, um die Datenüberwachung abzubrechen, und kann zuvor registrierte `watch`- oder `watchTick`-Überwachungen widerrufen.

Hier ist ein Beispiel, das zeigt, wie die `unwatch`-Methode der `$`-Instanz verwendet wird:

<o-playground name="stanz - unwatch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        const tid1 = target.watch(() => {
          \$("#logger1").text = JSON.stringify(target);
        });
        const tid2 = target.watchTick(()=>{
          \$("#logger2").text = JSON.stringify(target);
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.unwatch(tid1);
          target.unwatch(tid2);
        }, 500);
        setTimeout(() => {
          target.bbb = "I am aaa";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel erstellen wir zunächst eine `$`-Instanz `target` und registrieren dann mit der `watch`-Methode und der `watchTick`-Methode jeweils einen Listener. Anschließend widerrufen wir diese beiden Listener, indem wir der `unwatch`-Methode die zuvor gespeicherten Rückgabewerte `tid1` und `tid2` übergeben. Das bedeutet, dass die Attributänderung im ersten `setTimeout` keinen Listener auslöst, da die Listener bereits widerrufen wurden.

## Der nicht überwachte Wert

In der `$`-Instanz zeigen Eigenschaftsnamen, die mit einem Unterstrich `_` beginnen, an, dass diese Werte nicht von den Methoden `watch` oder `watchTick` überwacht werden. Dies ist sehr nützlich für temporäre oder private Eigenschaften, bei denen Sie sie nach Belieben ändern können, ohne eine Überwachung auszulösen.

In der Vorlage wird dies als [nicht-reaktive Daten](../../documentation/state-management.md) bezeichnet.

Im Folgenden finden Sie ein Beispiel, das zeigt, wie Sie einen Attributwert, der mit einem Unterstrich beginnt, verwenden können, um das Abhören zu vermeiden:

<o-playground name="stanz - Nicht-reaktive Daten" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target._aaa = "Ich bin aaa";
        }, 600);
        setTimeout(() => {
          target._aaa = "Ändere aaa";
        }, 1200);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel erstellen wir eine `$`-Instanz `target` und überwachen mit der Methode `watch` Änderungen von Eigenschaftswerten. Innerhalb von `setTimeout` versuchen wir, den Wert der Eigenschaft `_aaa` zu ändern; diese Änderung löst jedoch keine Überwachung aus. Das ist besonders nützlich, wenn Eigenschaftswerte aktualisiert werden sollen, ohne dabei die Überwachung auszulösen.

## Grundlegende Merkmale

Auf der Instanz gesetzte Objektdaten werden in Stanz-Instanzen konvertiert, die das Abhören ermöglichen.

```javascript
const obj = {
  val: "I am obj"
};

$("#target").obj = obj;
console.log($("#target").obj.val === obj.val);
console.log($("#target").obj === obj);
```

Wir können auch `$.stanz` verwenden, um Stanz-Daten zu erstellen, die nicht an eine Instanz gebunden sind.

```javascript
const data = $.stanz({
  val: "Ich bin val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "ändere val";
```

Diese Beispiele zeigen die grundlegenden Merkmale des Setzens von Objektdaten als Stanz-Instanz zum Abhören.

Weitere vollständige Funktionen finden Sie unter [stanz](https://github.com/ofajs/stanz).