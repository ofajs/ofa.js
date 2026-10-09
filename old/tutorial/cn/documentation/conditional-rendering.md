# 条件渲染

在 ofa.js 中，条件渲染是一种重要的功能，允许根据数据状态决定是否渲染某个元素或组件。ofa.js 提供了基于组件的条件渲染方案，通过 `o-if`、`o-else-if` 和 `o-else` 组件实现。

## o-if 组件

`o-if` 组件用于根据表达式的真假值决定是否渲染其内容。当绑定的 `value` 属性为真值时，组件内的内容会被渲染；否则内容不会出现在 DOM 中。

<o-playground name="o-if 工作原理示例" style="--editor-height: 500px">
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

### o-if 的工作原理

`o-if` 会在条件为真时才将内容渲染到 DOM 中，当条件为假时，o-if 内的 DOM 元素会被完全移除。这种实现方式适合在条件变化不太频繁的情况下使用，因为它涉及到 DOM 的创建和销毁。

## o-else-if 和 o-else 组件

当需要多个条件分支时，可以使用 `o-else-if` 和 `o-else` 组件配合 `o-if` 实现多分支条件渲染。

- `o-if`：必须的第一个条件组件
- `o-else-if`：可选的中间条件组件，可以有多个
- `o-else`：可选的默认条件组件，放在最后

<o-playground name="多分支条件渲染示例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="num++">Toggle Display - {{num}}</button>
      <!-- 根据 num 对 3 取模的结果，切换显示不同内容 -->
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

## 实际应用场景示例

### 用户权限控制

<o-playground name="用户权限控制示例" style="--editor-height: 500px">
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
        <button on:click="toggleUserRole">切换用户角色</button>
        <p>当前角色: {{role}}</p>
        <o-if :value="role === 'admin'">
          <div class="admin-panel">
            <h3>管理员面板</h3>
            <button>管理用户</button>
            <button>系统设置</button>
          </div>
        </o-if>
        <o-else-if :value="role === 'user'">
          <div class="user-info">
            <h3>用户信息</h3>
            <p>欢迎 {{userName}}!</p>
          </div>
        </o-else-if>
        <o-else>
          <p>请登录以查看内容</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              role: 'guest',
              userName: '访客'
            },
            proto: {
              toggleUserRole() {
                if (this.role === 'guest') {
                  this.role = 'user';
                  this.userName = '张三';
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

### 表单验证状态显示

<o-playground name="表单验证状态显示示例" style="--editor-height: 500px">
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
        <h3>邮箱验证示例</h3>
        <input type="email" :value="email" on:input="email = $event.target.value" placeholder="输入邮箱地址">
        <o-if :value="email && isValidEmail(email)">
          <p style="color:green;">✓ 邮箱格式正确</p>
        </o-if>
        <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
          <p style="color:red;">✗ 邮箱格式不正确</p>
        </o-else-if>
        <o-else>
          <p style="color:orange;">请输入邮箱地址进行验证</p>
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

## 条件渲染最佳实践

1. **使用场景**：当元素在不同条件下很少切换时，使用 `o-if` 更合适，因为这样可以完全移除不需要的元素，节省内存。

2. **性能考虑**：频繁切换的元素更适合使用类绑定（如 `class:hide`）而非条件渲染，因为条件渲染涉及 DOM 的创建和销毁。

3. **结构清晰**：条件渲染特别适合用于具有不同结构的内容切换，比如选项卡、步骤引导等。