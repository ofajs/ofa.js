# 属性応答

前述の[プロパティバインディング](./property-binding.md)では、コンポーネントのプロパティ値をテキスト表示にレンダリングする方法、つまり単純なプロパティ応答メカニズムを紹介しました。

ofa.jsは基本的な属性値のリアクティブをサポートするだけでなく、多層にネストされたオブジェクト内部の属性値のリアクティブレンダリングもサポートしています。

<o-playground name="非レスポンシブデータの例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{obj.count2}}</p>
      <button on:click="handleAddCount">増加</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              obj: {
                count2: 100,
              },
            },
            proto:{
              handleAddCount(){
                this.count++;
                this.obj.count2++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

すべてのofa.jsインスタンスオブジェクトにバインドされたデータは、自動的にリアクティブデータに変換されます。リアクティブデータは、文字列、数値、ブール値、配列、オブジェクトなどの基本データ型のみをサポートしています。関数やクラスインスタンスなどの複雑なデータ型については、**非リアクティブ属性**として保存する必要があり、これらの属性の変更はコンポーネントの再レンダリングをトリガーしません。

## 非リアクティブデータ

時には、Promiseインスタンスや正規表現オブジェクト、その他の複雑なオブジェクトなど、リアクティブな更新を必要としないデータを保存する必要があります。その場合、非リアクティブなプロパティを使用します。これらのプロパティの変更はコンポーネントの再レンダリングを引き起こさず、ビューとの連動を必要としないデータの保存に適しています。

非レスポンシブプロパティの命名では、通常、プロパティ名の前にアンダースコア `_` をプレフィックスとして付け、レスポンシブプロパティとの区別を示します。

<o-playground name="非リアクティブデータの例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{_count2}}</p>
      <button on:click="count++">Blue increases</button>
      <button on:click="_count2++">Green increments</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              _count2: 100,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

`Green increments`ボタンをクリックすると、`_count2`の数値は実際に増加しているが、それは非リアクティブなプロパティであるためビューの更新がトリガーされず、画面上の表示は変化しない。`Blue increases`ボタンをクリックすると、`count`はリアクティブなプロパティなのでコンポーネント全体の再レンダリングがトリガーされ、その際に初めてGreenの表示内容が同期して更新される。

非応答的なオブジェクトデータは、応答的なオブジェクトデータよりもパフォーマンスが良くなります。非応答的なデータはコンポーネントの再レンダリングをトリガーしないためです。


