# 条件渲染

在 ofa.js 中，条件渲染是一种重要的功能，允许根据数据状态决定是否渲染某个元素或组件。ofa.js 提供了基于组件的条件渲染方案，通过 `o-if`、`o-else-if` 和 `o-else` 组件实现。

## o-if 组件

`o-if` 组件用于根据表达式的真假值决定是否渲染其内容。当绑定的 `value` 属性为真值时，组件内的内容会被渲染；否则内容不会出现在 DOM 中。

```html
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
```

### o-if 的工作原理

`o-if` 会在条件为真时才将内容渲染到 DOM 中，当条件为假时，o-if 内的 DOM 元素会被完全移除。这种实现方式适合在条件变化不太频繁的情况下使用，因为它涉及到 DOM 的创建和销毁。

## o-else-if 和 o-else 组件

当需要多个条件分支时，可以使用 `o-else-if` 和 `o-else` 组件配合 `o-if` 实现多分支条件渲染。

- `o-if`：必须的第一个条件组件
- `o-else-if`：可选的中间条件组件，可以有多个
- `o-else`：可选的默认条件组件，放在最后

```html
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
```

## 实际应用场景示例

### 用户权限控制

```html
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
```

### 表单验证状态显示

```html
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
```

## o-fill 内部使用 o-if（作用域约束）

`o-if` 放在 `o-fill` 内部时，其 `:value` 表达式同样受到 o-fill 的**独立作用域**约束（详见[列表渲染](./list-rendering.md)）：只能访问 `$data`、`$index`、`$host`，**不能直接引用页面 data 中的变量名**。

❌ **错误写法**（直接引用页面 data 变量 `canEditPrice` → 条件恒为 undefined，内容不渲染且控制台无报错，难以排查）：

```html
<o-fill :value="products">
  <o-if :value="canEditPrice">
    <button>改价</button>
  </o-if>
</o-fill>
```

✅ **正确写法**（通过 `$host` 访问页面数据 / 调用方法）：

```html
<o-fill :value="products">
  <o-if :value="$host.canEditPrice">
    <button>改价</button>
  </o-if>
</o-fill>
```

- `:value` 中访问当前列表项数据用 `$data.xxx`；访问页面级数据或调用方法用 `$host.xxx`
- 踩坑特征：页面其余部分正常渲染、唯独 `o-if` 内容一直不出现、控制台无报错——优先检查是否忘了 `$host` 前缀

## 条件渲染最佳实践

1. **使用场景**：当元素在不同条件下很少切换时，使用 `o-if` 更合适，因为这样可以完全移除不需要的元素，节省内存。

2. **性能考虑**：频繁切换的元素更适合使用类绑定（如 `class:hide`）而非条件渲染，因为条件渲染涉及 DOM 的创建和销毁。

3. **结构清晰**：条件渲染特别适合用于具有不同结构的内容切换，比如选项卡、步骤引导等。

## 关键要点

- **o-if 组件**：根据条件决定是否渲染内容，条件为假时 DOM 元素被完全移除
- **多分支条件**：使用 `o-if`、`o-else-if`、`o-else` 实现多分支条件渲染
- **性能优化**：频繁切换使用类绑定，不频繁切换使用条件渲染
- **适用场景**：权限控制、表单验证、内容切换等
