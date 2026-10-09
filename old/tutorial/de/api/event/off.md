# off



Verwenden Sie die `off`-Methode, um einen registrierten Ereignishandler zu deregistrieren und das Abhören des Ereignisses abzubrechen.

Nachfolgend ein Beispiel, das zeigt, wie man die Methode `off` verwendet, um die Ereignisüberwachung zu beenden:

<o-playground name="off - Ereignis-Listener entfernen" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        const f = ()=> {
          \$("#logger").text = count++;
          if(count === 3){
            \$("#target").off("click", f);
          }
        }
        \$("#target").on("click", f);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel registrieren wir einen Klickereignis-Handler `f`. Wenn die Schaltfläche angeklickt wird, zeigt der Handler die Anzahl der Klicks in `#logger` an. Mit der Methode `off` heben wir das Ereignis-Listening auf, wenn die Anzahl der Klicks 3 erreicht hat.