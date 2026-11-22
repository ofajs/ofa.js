# off



使用 `off` メソッドを使用すると、登録されたイベントハンドラを解除して、イベントの監視をキャンセルできます。

以下は、`off` メソッドを使用してイベントリスナーを解除する例です：

<o-playground name="off - イベントリスナー削除" style="--editor-height: 400px">
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

この例では、クリックイベントハンドラ `f` を登録し、ボタンがクリックされると、イベントハンドラが `#logger` にクリック回数を表示します。`off` メソッドを使用して、クリック回数が3に達したときにイベントのリスニングを解除します。