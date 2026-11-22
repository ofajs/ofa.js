# 条件付きレンダリング

在 ofa.js 中，条件渲染是一种重要的功能，允许根据数据状态决定是否渲染某个元素或组件。ofa.js 提供了基于组件的条件渲染方案，通过 `o-if`、`o-else-if` 和 `o-else` 组件实现。

## o-if コンポーネント

`o-if`コンポーネントは、式の真偽値に基づいてその内容をレンダリングするかどうかを決定するために使用されます。バインドされた`value`属性が真値の場合、コンポーネント内の内容がレンダリングされます。それ以外の場合、内容はDOMに現れません。

<o-playground name="o-if 動作原理例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="isHide = !isHide">Toggle Display</button>
      <o-if :value="!isHide">
        <p>{{val}}</p>
      </o-if>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### o-if の動作原理

`o-if` は、条件が真の場合にのみ内容をDOMにレンダリングし、条件が偽の場合、o-if内のDOM要素は完全に削除されます。この実装方法は、条件の変更があまり頻繁でない場合に適しています。これはDOMの作成と破棄を伴うためです。

## o-else-if および o-else コンポーネント

複数の条件分岐が必要な場合、`o-else-if` と `o-else` コンポーネントを `o-if` と組み合わせて使用することで、多分岐条件レンダリングを実現できます。

- `o-if`：必須の最初の条件コンポーネント
- `o-else-if`：省略可能な中間の条件コンポーネント、複数設定可能
- `o-else`：省略可能なデフォルトの条件コンポーネント、最後に配置

<o-playground name="多分岐条件レンダリングの例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="num++">表示切替 - {{num}}</button>
      <!-- numを3で割った余りに応じて、異なる内容を切り替えて表示 -->
      <o-if :value="num % 3 === 0">
        <p>❤️ 0 / 3</p>
      </o-if>
      <o-else-if :value="num % 3 === 1">
        <p>😊 1 / 3</p>
      </o-else-if>
      <o-else>
        <p>😭 2 / 3</p>
      </o-else>
      <script>
        export default async () => {
          return {
            data: {
              num: 0,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 実用的な応用シナリオの例

### ユーザー権限制御

<o-playground name="ユーザー権限制御の例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .admin-panel {
          background-color: #813b3bff;
          padding: 10px;
          margin: 10px 0;
        }
        .user-info {
          background-color: #3f6e86ff;
          padding: 10px;
          margin: 10px 0;
        }
      </style>
      <div>
        <button on:click="toggleUserRole">ユーザー役割を切り替え</button>
        <p>現在の役割: {{role}}</p>
        <o-if :value="role === 'admin'">
          <div class="admin-panel">
            <h3>管理者パネル</h3>
            <button>ユーザー管理</button>
            <button>システム設定</button>
          </div>
        </o-if>
        <o-else-if :value="role === 'user'">
          <div class="user-info">
            <h3>ユーザー情報</h3>
            <p>ようこそ {{userName}}!</p>
          </div>
        </o-else-if>
        <o-else>
          <p>ログインしてコンテンツを表示してください</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              role: 'guest',
              userName: 'ゲスト'
            },
            proto: {
              toggleUserRole() {
                if (this.role === 'guest') {
                  this.role = 'user';
                  this.userName = '田中太郎';
                } else if (this.role === 'user') {
                  this.role = 'admin';
                } else {
                  this.role = 'guest';
                  this.userName = '';
                }
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### フォーム検証ステータス表示

<o-playground name="フォーム検証状態表示例" style="--editor-height: 500px">
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
      <div>
        <h3>メールアドレス検証例</h3>
        <input type="email" :value="email" on:input="email = $event.target.value" placeholder="メールアドレスを入力">
        <o-if :value="email && isValidEmail(email)">
          <p style="color:green;">✓ メール形式が正しい</p>
        </o-if>
        <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
          <p style="color:red;">✗ メール形式が不正</p>
        </o-else-if>
        <o-else>
          <p style="color:orange;">検証のためメールアドレスを入力してください</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              email: ''
            },
            proto: {
              isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 条件レンダリングのベストプラクティス

1. **使用シーン**：要素が異なる条件でほとんど切り替わらない場合、`o-if` を使用する方が適切です。これにより不要な要素を完全に削除でき、メモリを節約できます。

2. **パフォーマンスの考慮**：頻繁に切り替わる要素には、条件付きレンダリングよりもクラスバインディング（`class:hide` など）を使用する方が適しています。条件付きレンダリングはDOMの作成と破棄を伴うためです。

3. **構造の明確さ**：条件付きレンダリングは、タブやステップガイドなど、異なる構造を持つコンテンツの切り替えに特に適しています。