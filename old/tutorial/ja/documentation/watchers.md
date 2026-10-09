# リスナー

ウォッチャー（Watcher）は、ofa.jsにおいてデータの変化を監視し、対応するロジックを実行する機能です。リアクティブデータが変化すると、ウォッチャーは自動的にコールバック関数をトリガーし、データ変換、副作用の操作、非同期処理などのタスクを実行できます。

## 基本的な使い方

ウォッチャーはコンポーネントの `watch` オブジェクト内に定義され、キー名は監視するデータプロパティ名に対応し、値はデータが変化したときに実行されるコールバック関数です。

<o-playground name="watchers - 基本的な使い方" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>
        count:{{count}}
        <br />
        doubleCount:{{doubleCount}}
      </p>
      <input sync:value="count" type="number" />
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              doubleCount: 0,
            },
            watch: {
              count(count) {
                setTimeout(() => {
                  this.doubleCount = count * 2;
                }, 500);
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## コールバック関数のパラメータ

リスナーコールバック関数は2つのパラメーターを受け取ります：- `newValue`：変化後の新しい値
- `{watchers}`：現在のコンポーネントのすべてのウォッチャーオブジェクト

データ変更後は、まずデバウンス処理が実行され、その後 `watch` 内のコールバックが実行されます。`watchers` パラメータは、今回のデバウンス周期内でマージされたすべての変更の集合です。

`watch` 内の関数はコンポーネントの初期化完了直後に呼び出され、データ監視を確立するために使用されます。`watchers` の長さがあるかどうかを判断することで、初回呼び出しかどうかを区別できます。

<o-playground name="watchers - コールバックパラメータ" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .log {
          margin-top: 10px;
          padding: 10px;
          background-color: #7e7e7eff;
          font-family: monospace;
          white-space: pre-wrap;
        }
      </style>
      <p>名前: {{name}}</p>
      <p>年齢: {{age}}</p>
      <input sync:value="name" placeholder="名前を入力" />
      <input sync:value="age" type="number" placeholder="年齢を入力" />
      <div class="log">{{log}}</div>
      <script>
        export default async () => {
          return {
            data: {
              name: "张三",
              age: 25,
              log: "",
            },
            watch: {
              name(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // いずれかを取得
                this.log += `プロパティ "${watcher.name}" が "${watcher.oldValue}" から "${watcher.value}" に変更されました\n`;
              },
              age(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // いずれかを取得
                this.log += `プロパティ "${watcher.name}" が "${watcher.oldValue}" から "${watcher.value}" に変更されました\n`;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 深層リスニング

オブジェクトや配列型のネストされたデータに対して、watch 内では自動的に深い監視が行われます。

<o-playground name="watchers - 深度監視" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
        .info {
          margin-top: 10px;
          padding: 10px;
          background-color: gray;
        }
      </style>
      <div>
        <p>ユーザー情報:</p>
        <p>名前: {{user.name}}</p>
        <p>年齢: {{user.age}}</p>
        <p>趣味: {{user.hobbies.join(', ')}}</p>
      </div>
      <div>
        <button on:click="updateName">名前を変更</button>
        <button on:click="updateAge">年齢を変更</button>
        <button on:click="addHobby">趣味を追加</button>
        <button on:click="updateHobby">趣味を変更</button>
      </div>
      <div class="info" :html="log"></div>
      <script>
        export default async () => {
          return {
            data: {
              user: {
                name: "张三",
                age: 25,
                hobbies: ["バスケットボール", "サッカー"],
              },
              log: "",
            },
            watch: {
              user(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // いずれかを取得
                console.log("変更: ",watcher.target);
                if(watcher.type === 'set'){
                  this.log += `値を変更-> プロパティ "${watcher.name}" が "${watcher.oldValue}" から "${watcher.value}" に変わりました <br>`;
                }else{
                  this.log += `メソッド実行${watcher.type}-> 関数名 "${watcher.name}"  引数 "${watcher.args}" <br>`;
                }
              },
            },
            proto: {
              updateName() {
                this.user.name = "李四";
              },
              updateAge() {
                this.user.age = 30;
              },
              addHobby() {
                this.user.hobbies.push("水泳");
              },
              updateHobby() {
                this.user.hobbies[0] = "バドミントン";
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 複数のデータソースを監視する

複数のデータの変化を同時に監視し、コールバック関数内でそれらの変化に応じて適切なロジックを実行することができます。

<o-playground name="watchers - 多データソース" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px;
          padding: 5px;
        }
      </style>
      <p>幅: {{rectWidth}}</p>
      <p>高さ: {{rectHeight}}</p>
      <p>面積: {{area}}</p>
      <input sync:value="rectWidth" type="number" placeholder="幅" />
      <input sync:value="rectHeight" type="number" placeholder="高さ" />
      <script>
        export default async () => {
          return {
            data: {
              rectWidth: 10,
              rectHeight: 5,
              area: 0,
            },
            watch: {
              // "rectWidth,rectHeight"(){
              ["rectWidth,rectHeight"](){
                this.area = (this.rectWidth || 0) * (this.rectheight || 0);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 実際の応用シーン

### 1. フォーム検証

<o-playground name="watchers - フォーム検証" style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
        }
        input {
          display: block;
          margin: 10px 0;
          padding: 8px;
          width: 200px;
        }
        .error {
          color: red;
          font-size: 12px;
        }
      </style>
      <input sync:value="username" placeholder="ユーザー名（3～10文字）" />
      <span class="error">{{usernameError}}</span>
      <input sync:value="email" placeholder="メールアドレス" />
      <span class="error">{{emailError}}</span>
      <script>
        export default async () => {
          return {
            data: {
              username: "",
              email: "",
              usernameError: "",
              emailError: "",
            },
            watch: {
              username(val) {
                if (val.length < 3 || val.length > 10) {
                  this.usernameError = "ユーザー名は3～10文字である必要があります";
                } else {
                  this.usernameError = "";
                }
              },
              email(val) {
                const emailRegex = /^.+@.+\..+$/;
                if (!emailRegex.test(val)) {
                  this.emailError = "有効なメールアドレスを入力してください";
                } else {
                  this.emailError = "";
                }
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 2. テーマの設定

<o-playground name="watchers - 設定テーマ" style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
      </style>
      <p>設定: {{settings.theme}}</p>
      <p>保存状態: {{saveStatus}}</p>
      <button on:click="setLight">ライトテーマ</button>
      <button on:click="setDark">ダークテーマ</button>
      <button on:click="resetSettings">リセット</button>
      <script>
        export default async () => {
          return {
            data: {
              settings: {
                theme: "light",
              },
              saveStatus: "保存済み",
            },
            watch: {
              settings(){
                  this.saveStatus = "保存中...";
                  setTimeout(() => {
                    this.saveStatus = "保存済み";
                    console.log("設定が保存されました:", this.settings);
                  }, 500);
              }
            },
            proto: {
              setLight() {
                this.settings.theme = "light";
              },
              setDark() {
                this.settings.theme = "dark";
              },
              resetSettings() {
                this.settings = { theme: "light" };
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 注意事項

- **監視対象データの変更を避ける**：ウォッチャーのコールバック内で監視対象データを変更すると、無限ループが発生する可能性があります。変更が必要な場合は、適切な条件判断を必ず行ってください。
- **代わりに算出プロパティを使用する**：複数のデータの変化に基づいて新しい値を計算する必要がある場合は、ウォッチャーではなく[算出プロパティ](./computed-properties.md)を使用することを推奨します。