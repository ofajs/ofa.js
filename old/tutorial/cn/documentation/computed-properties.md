# 计算属性

计算属性是基于响应式数据派生出新数据的一种方式，它会根据依赖的数据变化而自动更新。在 ofa.js 中，计算属性是定义在 `proto` 对象中的特殊方法，使用 JavaScript 的 `get` 或 `set` 关键字来定义。

## 特性与优势

- **缓存性**：计算属性的结果会被缓存，只有当其依赖的数据发生变化时才会重新计算
- **响应式**：当依赖的数据更新时，计算属性会自动更新
- **声明式**：以声明的方式创建依赖关系，代码更加清晰易懂

## get 计算属性

get 计算属性用于从响应式数据中派生出新的值，它不接受参数，只返回基于其他数据计算得出的值。

<o-playground name="get 计算属性示例" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}} - {{countDouble}}</button>
      <p>计算属性 countDouble 的值为：{{countDouble}}</p>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                console.log('countDouble 被访问');
                return this.count * 2;
              },
              clickMe() {
                this.count++;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 实际应用场景示例

计算属性常用于处理复杂的数据转换逻辑，例如过滤数组、格式化显示文本等：

<o-playground name="计算属性示例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 5px;
          margin: 3px 0;
          background-color: #838383ff;
        }
      </style>
      <input type="text" sync:value="filterText" placeholder="过滤姓名...">
      <ul>
        <o-fill :value="filteredNames">
          <li>{{$data}}</li>
        </o-fill>
      </ul>
      <script>
        export default async () => {
          return {
            data: {
              filterText: '',
              names: ['张3', '李4', '王54']
            },
            proto: {
              get filteredNames() {
                if (!this.filterText) {
                  return this.names;
                }
                return this.names.filter(name => 
                  name.includes(this.filterText)
                );
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## set 计算属性

set 计算属性允许你通过赋值操作来修改底层的数据状态。它接收一个参数，通常用于反向更新依赖它的原始数据。

<o-playground name="set 计算属性示例" style="--editor-height: 700px">
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
      <div>
        <p>基础数值: {{count}}</p>
        <p>双倍数值: {{countDouble}}</p>
        <button on:click="resetCount">重置计数</button>
        <button on:click="setCountDouble">设置双倍值为 10</button>
        <button on:click="incrementCount">增加基础值</button>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                return this.count * 2;
              },
              set countDouble(val) {
                this.count = Math.max(0, val / 2); // 确保 count 不为负数
              },
              resetCount() {
                this.count = 0;
              },
              setCountDouble() {
                this.countDouble = 10;
              },
              incrementCount() {
                this.count++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 计算属性 vs 方法

虽然方法也可以实现类似的功能，但计算属性具有缓存特性，只有在其依赖的数据发生变化时才会重新求值，这使得性能更优。

```javascript
// 使用计算属性（推荐）- 有缓存
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// 使用方法 - 每次调用都会执行
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## 注意事项

1. **避免异步操作**：计算属性应保持同步且无副作用，禁止在其中进行异步调用或直接修改组件状态。  
2. **依赖追踪**：务必仅依赖响应式数据，否则更新将不可预期。  
3. **错误防护**：若计算属性内部出现循环依赖或异常赋值，可能导致渲染失败甚至死循环，务必提前设定边界条件并做好异常处理。

## 实际应用示例

以下是一个简单的表单验证示例，展示了计算属性的实用性：

<o-playground name="表单验证示例" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 200px;
        }
        .status {
          margin-top: 10px;
          padding: 8px;
          border-radius: 4px;
        }
        .valid {
          background-color: #d4edda;
          color: green;
        }
        .invalid {
          background-color: #f8d7da;
          color: red;
        }
      </style>
      <h3>简单验证示例</h3>
      <input type="text" sync:value="username" placeholder="输入用户名(至少3字符)">
      <p class="status" class:valid="isValid" class:invalid="!isValid">
        状态: {{statusMessage}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              username: ''
            },
            proto: {
              get isValid() {
                return this.username.length >= 3;
              },
              get statusMessage() {
                return this.isValid ? '用户名有效' : '用户名长度不足';
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>