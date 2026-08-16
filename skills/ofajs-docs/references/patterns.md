# ofa.js 常见模式与最佳实践

本文档汇总了 ofa.js 开发中常用的代码模式和最佳实践，帮助开发者快速解决常见问题。

---

## 表单处理

### 基础表单双向绑定

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
    input, select, textarea { 
      padding: 8px; 
      margin: 5px 0; 
      width: 100%; 
      box-sizing: border-box; 
    }
  </style>
  
  <h3>用户注册</h3>
  <input type="text" sync:value="form.username" placeholder="用户名">
  <input type="email" sync:value="form.email" placeholder="邮箱">
  <input type="password" sync:value="form.password" placeholder="密码">
  <select sync:value="form.role">
    <option value="user">普通用户</option>
    <option value="admin">管理员</option>
  </select>
  <label>
    <input type="checkbox" sync:checked="form.agree"> 同意条款
  </label>
  <button on:click="submit">提交</button>
  
  <script>
    export default async () => ({
      data: {
        form: {
          username: '',
          email: '',
          password: '',
          role: 'user',
          agree: false
        }
      },
      proto: {
        submit() {
          if (!this.form.agree) {
            alert('请同意条款');
            return;
          }
          console.log('提交数据:', this.form);
        }
      }
    });
  </script>
</template>
```

### 表单验证模式

```html
<template page>
  <style>
    :host { display: block; padding: 15px; }
    .form-group { margin-bottom: 15px; }
    .error { color: red; font-size: 12px; }
    input.error-input { border-color: red; }
  </style>
  
  <div class="form-group">
    <input 
      type="text" 
      sync:value="form.username" 
      class:error-input="errors.username"
      placeholder="用户名（3-10字符）">
    <span class="error" o-if:="errors.username">{{errors.username}}</span>
  </div>
  
  <div class="form-group">
    <input 
      type="email" 
      sync:value="form.email"
      class:error-input="errors.email"
      placeholder="邮箱">
    <span class="error" o-if:="errors.email">{{errors.email}}</span>
  </div>
  
  <button on:click="submit" attr:disabled="!isValid">提交</button>
  
  <script>
    export default async () => ({
      data: {
        form: { username: '', email: '' },
        errors: {}
      },
      proto: {
        get isValid() {
          return Object.keys(this.errors).length === 0 
            && this.form.username 
            && this.form.email;
        }
      },
      watch: {
        'form.username'(val) {
          if (val.length < 3 || val.length > 10) {
            this.errors = { ...this.errors, username: '用户名需要3-10个字符' };
          } else {
            const { username, ...rest } = this.errors;
            this.errors = rest;
          }
        },
        'form.email'(val) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            this.errors = { ...this.errors, email: '请输入有效的邮箱' };
          } else {
            const { email, ...rest } = this.errors;
            this.errors = rest;
          }
        }
      }
    });
  </script>
</template>
```

---

## 列表操作

### 可增删改的列表

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
    .item { 
      display: flex; 
      align-items: center; 
      padding: 8px; 
      margin: 5px 0; 
      background: #f5f5f5; 
    }
    .item input { flex: 1; margin: 0 10px; }
    button { margin: 5px; padding: 5px 10px; }
  </style>
  
  <h3>待办事项</h3>
  <div>
    <input sync:value="newItem" placeholder="添加新事项">
    <button on:click="addItem">添加</button>
  </div>
  
  <o-fill :value="todos" fill-key="id">
    <div class="item">
      <input type="checkbox" sync:checked="$data.done">
      <input sync:value="$data.text">
      <button on:click="$host.removeItem($data.id)">删除</button>
    </div>
  </o-fill>
  
  <p>已完成: {{completedCount}} / {{todos.length}}</p>
  
  <script>
    let idCounter = 0;
    export default async () => ({
      data: {
        todos: [
          { id: ++idCounter, text: '学习 ofa.js', done: false },
          { id: ++idCounter, text: '构建应用', done: false }
        ],
        newItem: ''
      },
      proto: {
        get completedCount() {
          return this.todos.filter(t => t.done).length;
        },
        addItem() {
          if (!this.newItem.trim()) return;
          this.todos.push({
            id: ++idCounter,
            text: this.newItem,
            done: false
          });
          this.newItem = '';
        },
        removeItem(id) {
          const index = this.todos.findIndex(t => t.id === id);
          if (index > -1) {
            this.todos.splice(index, 1);
          }
        }
      }
    });
  </script>
</template>
```

### 嵌套列表（树形结构）

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
    .tree-node { margin-left: 20px; }
    .node-label { 
      padding: 5px; 
      cursor: pointer; 
      display: inline-block;
    }
    .node-label:hover { background: #e0e0e0; }
  </style>
  
  <o-fill :value="tree" fill-key="id">
    <div>
      <span class="node-label" on:click="$host.toggle($data)">
        {{$data.expanded ? '▼' : '▶'}} {{$data.name}}
      </span>
      <div class="tree-node" o-if:="$data.expanded && $data.children">
        <o-fill :value="$data.children" fill-key="id">
          <div class="node-label">{{$data.name}}</div>
        </o-fill>
      </div>
    </div>
  </o-fill>
  
  <script>
    export default async () => ({
      data: {
        tree: [
          {
            id: 1,
            name: '前端技术',
            expanded: false,
            children: [
              { id: 11, name: 'HTML' },
              { id: 12, name: 'CSS' },
              { id: 13, name: 'JavaScript' }
            ]
          },
          {
            id: 2,
            name: '后端技术',
            expanded: false,
            children: [
              { id: 21, name: 'Node.js' },
              { id: 22, name: 'Python' }
            ]
          }
        ]
      },
      proto: {
        toggle(node) {
          node.expanded = !node.expanded;
        }
      }
    });
  </script>
</template>
```

---

## 组件通信

### 父子组件通信（Props + Events）

```html
<!-- parent.html -->
<template page>
  <l-m src="./child.html"></l-m>
  <style>:host { display: block; padding: 10px; }</style>
  
  <child-comp :message="parentMessage" on:message-change="handleMessageChange">
  </child-comp>
  <p>来自子组件: {{receivedMessage}}</p>
  
  <script>
    export default async () => ({
      data: {
        parentMessage: 'Hello from parent',
        receivedMessage: ''
      },
      proto: {
        handleMessageChange(e) {
          this.receivedMessage = e.data.text;
        }
      }
    });
  </script>
</template>
```

```html
<!-- child.html -->
<template component>
  <style>
    :host { display: block; padding: 10px; border: 1px solid #ccc; }
  </style>
  
  <p>来自父组件: {{message}}</p>
  <input sync:value="reply" placeholder="回复父组件">
  <button on:click="sendReply">发送</button>
  
  <script>
    export default async () => ({
      tag: 'child-comp',
      data: {
        message: '',
        reply: ''
      },
      proto: {
        sendReply() {
          this.emit('message-change', {
            data: { text: this.reply }
          });
        }
      }
    });
  </script>
</template>
```

### 跨层级通信（Provider/Consumer）

```html
<!-- app.html -->
<template>
  <o-provider name="appState" user-name="张三" theme="dark">
    <o-page src="./page.html"></o-page>
  </o-provider>
</template>
```

```html
<!-- page.html -->
<template page>
  <l-m src="./user-info.html"></l-m>
  <user-info></user-info>
  
  <o-consumer name="appState" watch:user-name="userName" watch:theme="theme"></o-consumer>
  
  <script>
    export default {
      data: { userName: '', theme: '' }
    };
  </script>
</template>
```

---

## 单页面业务拆分（内嵌子页面模式）

### 何时拆分

一个页面模块同时承载「主列表 + 弹窗表单 + 多个子流程」时，`data` / `proto` 会迅速膨胀且职责不清。判断标准：

- 弹窗内含**独立表单或多步流程** → 拆成独立页面模块
- 页面 `data` 混入大量与主内容无关的临时状态（`form` / `dialogOpen` / `editingId` …）→ 拆
- 纯展示、无独立业务状态的小片段 → 用组件模块（`<template component>`），不要拆 page

### 通信模式：方法下发 + 事件上抛

```
宿主页面                                子页面（如 form.html）
   │                                        │
   │  this.shadow.$("#x").openForm(params)  │  ← 方法调用下发参数
   │ ────────────────────────────────────▶  │
   │                                        │
   │  emit("form-save", { data,             │  ← 事件冒泡上抛结果
   │    bubbles: true, composed: true })    │
   │ ◀────────────────────────────────────  │
   │  on:form-save="onFormSave" → event.data│
```

关键规则：

1. **`<o-page>` 的 `src` 初始化后不可变**。运行时再赋值（含 `:src` 动态绑定、改 query 传参）会抛错 `A page that has already been initialized cannot be set with the src attribute`。因此运行时传参**必须走方法调用**，不能靠改 src/query
2. **上抛事件必须 `bubbles: true, composed: true`**：子页面处于宿主 Shadow DOM 内，`composed` 缺省为 `false`，宿主在 `<o-page>` 标签上的 `on:xxx` 监听不到
3. **分工**：子页面只管表单完整性（非空校验、交互状态）；归一化、id/时间戳生成、写库都在宿主
4. **取消/关闭不通知宿主**：只置子页面自身 `dialogOpen = false`，无副作用

### 完整示例

宿主页面（列表 + 常驻内嵌弹窗页）：

```html
<template page>
  <style>:host { display: block; }</style>

  <!-- 常驻内嵌子页面；on:form-save 接住上抛事件 -->
  <o-page id="form-page" src="./form.html" on:form-save="onFormSave"></o-page>

  <button on:click="openAdd">新增</button>
  <script>
    export default async () => ({
      data: { items: [] },
      proto: {
        getForm() {
          const page = this.shadow.$("#form-page");
          return page?.openForm ? page : null; // 子页面未就绪时防御
        },
        openAdd() {
          this.getForm()?.openForm({ count: this.items.length });
        },
        openEdit(event, item) {
          event.stopPropagation();
          this.getForm()?.openForm({ id: item.id, name: item.name });
        },
        onFormSave(event) {
          const { id, name } = event.data;
          if (id) {
            const target = this.items.find((it) => it.id === id);
            if (target) target.name = name;
          } else {
            this.items.push({ id: `${Date.now()}`, name });
          }
          // 业务归一化与持久化都在宿主处理
        },
      },
    });
  </script>
</template>
```

子页面（自带 `p-dialog`，自持表单状态）：

```html
<template page>
  <style>:host { display: block; }</style>

  <p-dialog sync:open="dialogOpen" auto-close>
    <span slot="title">{{editingId ? '编辑' : '新增'}}</span>
    <!-- 表单控件 sync:value="form.xxx" -->
    <div slot="bottom">
      <p-button variant="text" on:click="dialogOpen = false">取消</p-button>
      <p-button color="primary" on:click="save">保存</p-button>
    </div>
  </p-dialog>

  <script>
    export default async ({ load }) => {
      // 子页面自己按需 load 依赖（toast 等），不依赖宿主
      return {
        data: {
          dialogOpen: false,
          editingId: "",
          form: { name: "" },
        },
        proto: {
          // 宿主调用的打开入口：回填参数并打开弹窗
          openForm({ id = "", name = "" } = {}) {
            this.editingId = id;
            this.form.name = name;
            this.dialogOpen = true;
          },
          save() {
            if (!this.form.name.trim()) return; // 只管非空校验
            this.emit("form-save", {
              data: { id: this.editingId, name: this.form.name },
              bubbles: true,
              composed: true, // 穿透 Shadow DOM，宿主才能监听
            });
            this.dialogOpen = false;
          },
        },
      };
    };
  </script>
</template>
```

### 需要每次全新实例（销毁重建）

子页面允许状态丢失、想每次全新开始时，用 `o-if` 包裹（`o-if` 切换会清空并重新渲染内部节点，`o-page` 随之销毁重建，可规避 src 不可变限制）：

```html
<o-if :value="formVisible">
  <o-page src="./form.html" on:form-save="onFormSave"></o-page>
</o-if>
```

注意：重建后是全新实例，需重新调用方法传参；弹窗场景更推荐**常驻 + `openForm()` 重置状态**的方式。

---

## 状态管理

### 全局状态

```javascript
// store.js
export const userStore = $.stanz({
  isLoggedIn: false,
  userInfo: null,
  token: ''
});

export const cartStore = $.stanz({
  items: [],
  get total() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
});
```

```html
<!-- component.html -->
<template component>
  <style>:host { display: block; }</style>
  
  <div o-if:="user.isLoggedIn">
    欢迎, {{user.userInfo.name}}
  </div>
  <div o-else>
    <button on:click="login">登录</button>
  </div>
  
  <script>
    import { userStore } from './store.js';
    
    export default async () => ({
      tag: 'user-panel',
      data: {
        user: {}
      },
      attached() {
        this.user = userStore;
      },
      detached() {
        this.user = {};
      },
      proto: {
        login() {
          userStore.isLoggedIn = true;
          userStore.userInfo = { name: '张三' };
        }
      }
    });
  </script>
</template>
```

---

## 条件渲染最佳实践

### 频繁切换用 class，不频繁用 o-if

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
    .hidden { display: none; }
    .fade-in { animation: fadeIn 0.3s; }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  </style>
  
  <!-- 频繁切换：使用 class -->
  <div class:hidden="!isVisible" class="fade-in">
    这个元素会频繁显示/隐藏
  </div>
  
  <!-- 不频繁切换：使用 o-if -->
  <o-if :value="hasPermission">
    <div>管理员面板（条件变化不频繁）</div>
  </o-if>
  
  <script>
    export default async () => ({
      data: {
        isVisible: true,
        hasPermission: false
      }
    });
  </script>
</template>
```

---

## 性能优化

### 列表渲染使用 fill-key

```html
<!-- 推荐：使用唯一标识 -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>

<!-- 不推荐：无 fill-key，数组顺序变化时性能差 -->
<o-fill :value="items">
  <div>{{$data.name}}</div>
</o-fill>
```

### 分离动态样式

```html
<!-- 推荐：动态样式单独存放 -->
<style>
  .box { padding: 10px; border: 1px solid #ccc; }
</style>
<style>
  .box { 
    font-size: data(fontSize); 
    color: data(textColor);
  }
</style>

<!-- 不推荐：所有样式混在一起，每次都重新渲染 -->
<style>
  .box { 
    padding: 10px; 
    font-size: data(fontSize); 
    color: data(textColor);
  }
</style>
```

### 及时清理资源

```javascript
export default async () => ({
  data: { timer: null },
  attached() {
    this.timer = setInterval(() => {
      console.log('tick');
    }, 1000);
  },
  detached() {
    // 必须清理定时器，避免内存泄漏
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
});
```

---

## 常见错误避免

### 避免在侦听器中直接修改被监听数据

```javascript
// 错误：可能导致无限循环
watch: {
  count(val) {
    this.count = val + 1; // 危险！
  }
}

// 正确：添加条件判断
watch: {
  count(val) {
    if (val < 100) {
      this.count = val + 1;
    }
  }
}
```

### 组件标签名必须与 tag 一致

```html
<!-- 错误：标签名与 tag 不匹配 -->
<my-component></my-component>
<script>
  export default async () => ({
    tag: 'my-comp', // 不匹配！
    // ...
  });
</script>

<!-- 正确：标签名与 tag 一致 -->
<my-comp></my-comp>
<script>
  export default async () => ({
    tag: 'my-comp', // 匹配
    // ...
  });
</script>
```

### 状态管理中及时清理引用

```javascript
// 正确模式
attached() {
  this.userData = store.user;
},
detached() {
  this.userData = {}; // 清理引用，防止内存泄漏
}
```

---

## 实用代码片段

### 防抖搜索

```html
<template page>
  <input sync:value="keyword" placeholder="搜索...">
  <ul>
    <o-fill :value="results">
      <li>{{$data.name}}</li>
    </o-fill>
  </ul>
  
  <script>
    export default async () => ({
      data: {
        keyword: '',
        results: [],
        allItems: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']
      },
      watch: {
        keyword(val) {
          clearTimeout(this._searchTimer);
          this._searchTimer = setTimeout(() => {
            this.results = this.allItems.filter(item => 
              item.toLowerCase().includes(val.toLowerCase())
            );
          }, 300);
        }
      },
      attached() {
        this.results = this.allItems;
      },
      detached() {
        clearTimeout(this._searchTimer);
      }
    });
  </script>
</template>
```

### 选项卡切换

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
    .tabs { display: flex; border-bottom: 1px solid #ccc; }
    .tab { 
      padding: 10px 20px; 
      cursor: pointer; 
      border-bottom: 2px solid transparent;
    }
    .tab.active { 
      border-bottom-color: #007acc; 
      color: #007acc; 
    }
    .panel { padding: 20px; }
  </style>
  
  <div class="tabs">
    <div 
      class="tab" 
      class:active="activeTab === 'home'"
      on:click="activeTab = 'home'">首页</div>
    <div 
      class="tab" 
      class:active="activeTab === 'profile'"
      on:click="activeTab = 'profile'">个人</div>
    <div 
      class="tab" 
      class:active="activeTab === 'settings'"
      on:click="activeTab = 'settings'">设置</div>
  </div>
  
  <div class="panel">
    <o-if :value="activeTab === 'home'">首页内容</o-if>
    <o-else-if :value="activeTab === 'profile'">个人中心</o-else-if>
    <o-else>设置页面</o-else>
  </div>
  
  <script>
    export default async () => ({
      data: { activeTab: 'home' }
    });
  </script>
</template>
```

### 模态框组件

```html
<template component>
  <style>
    :host { display: block; }
    .overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal {
      background: white;
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
    }
  </style>
  
  <div class="overlay" o-if:="visible" on:click="close">
    <div class="modal" on:click="event.stopPropagation()">
      <h3>{{title}}</h3>
      <slot></slot>
      <button on:click="close">关闭</button>
    </div>
  </div>
  
  <script>
    export default async () => ({
      tag: 'modal-dialog',
      data: {
        visible: false,
        title: '提示'
      },
      proto: {
        open() {
          this.visible = true;
        },
        close() {
          this.visible = false;
          this.emit('close');
        }
      }
    });
  </script>
</template>
```
