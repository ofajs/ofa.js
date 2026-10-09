# インスタンスデータの特徴

`$` によって取得または作成されたインスタンスオブジェクトは、完全な stanz データ特性を持っている。なぜなら、`$` インスタンスは stanz を継承しているからだ。これは、stanz が提供するデータ操作メソッドや特性を利用して、インスタンスオブジェクトのデータを操作し、監視できることを意味する。

> 以下の例では通常の要素を使用しています。カスタムコンポーネントは通常、登録済みのデータを持っているのに対し、通常の要素はタグ情報のみを含むことが多いため、デモに適しています。

## watch



インスタンスは `watch` メソッドを使って値の変更を監視できます。オブジェクトの子オブジェクトの値を変更しても、そのオブジェクトの `watch` メソッドで変更を監視できます。

以下は、`$` インスタンスと `watch` メソッドの使用方法を示す例です：

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

この例では、まず `$` インスタンスオブジェクト `target` を作成し、`watch` メソッドを使ってその変更を監視します。オブジェクトの子オブジェクトの値（例えば `target.bbb.child.val` の値）を変更しても、`watch` メソッドでそれらの変更を検出し、`logger` 要素の内容を更新できます。これは `$` インスタンスオブジェクトの強力な特性を示しており、オブジェクトの変化を簡単に監視できるようにします。

## watchTick



`watchTick` と `watch` メソッドの機能は似ていますが、`watchTick` 内部にはスロットル操作があり、単一スレッドで1回実行されるため、パフォーマンスがより求められるシナリオでは、データの変動をより効果的に監視できます。

以下は、`$` インスタンスの `watchTick` メソッドの使用方法を示す例です：

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
          \$("#logger1").text = 'watch 実行回数：' + count1;
        });
        let count2 = 0;
        target.watchTick(()=>{
          count2++;
          \$("#logger2").text = 'watchTick 実行回数：' + count2;
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

この例では、まず `$` インスタンスオブジェクト `target` を作成します。そして、`watch` メソッドと `watchTick` メソッドを使用して、オブジェクトの変更を監視します。`watch` メソッドはデータが変更されるとすぐに実行され、`watchTick` メソッドは単一スレッド下で一度だけ実行されるため、監視操作の頻度を制限できます。ニーズに応じて、`watch` または `watchTick` メソッドを使用してデータの変化を監視できます。

## unwatch



`unwatch`メソッドは、データの監視を解除するために使用され、以前に登録した`watch`または`watchTick`の監視をキャンセルできます。

以下は、`$` インスタンスの `unwatch` メソッドの使用例です：

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

この例では、まず `$` インスタンスオブジェクト `target` を作成し、次に `watch` メソッドと `watchTick` メソッドを使用してそれぞれ2つのリスナーを登録しました。その後、`unwatch` メソッドを使用して、前に保存したリスナーの戻り値 `tid1` と `tid2` を渡し、これら2つのリスナーを取り消します。つまり、最初の `setTimeout` 内でのプロパティ変更は、リスナーが取り消されているため、どのリスナーもトリガーされません。

## 盗聴されない値

`$` インスタンスでは、アンダースア `_` で始まるプロパティ名は、`watch` や `watchTick` メソッドで監視されないことを示します。これは一時的またはプライベートなプロパティに非常に便利で、監視をトリガーせずに自由に変更できます。

テンプレート内では、これは[非反応データ](../../documentation/state-management.md)と呼ばれます。

以下は、アンダースコアで始まる属性値を使用して監視を避ける方法を示す例です：

<o-playground name="stanz - 非リアクティブデータ" style="--editor-height: 480px">
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
          target._aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target._aaa = "change aaa";
        }, 1200);
      </script>
    </template>
  </code>
</o-playground>

この例では、`$` インスタンスオブジェクト `target` を作成し、`watch` メソッドを使ってプロパティ値の変更を監視しています。`setTimeout` 内で `_aaa` プロパティ値を変更しようとしますが、この変更は監視をトリガーしません。これは、監視をトリガーせずにプロパティ値を更新する必要がある場合に非常に便利です。

## 基本特徴

インスタンスに設定されたオブジェクトデータはStanzインスタンスに変換され、このStanzインスタンスは監視を可能にします。

```javascript
const obj = {
  val: "I am obj"
};

$("#target").obj = obj;
console.log($("#target").obj.val === obj.val);
console.log($("#target").obj === obj);
```

また `$.stanz` を使用して、インスタンスにバインドされていない Stanz データを作成することもできます。

```javascript
const data = $.stanz({
  val: "I am val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "change val";
```

これらの例は、オブジェクトデータを Stanz インスタンスに設定してリスニングを行うための基本的な特徴を示しています。

より完全な機能については [stanz](https://github.com/ofajs/stanz) をご覧ください。