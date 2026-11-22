# $parent in o-fill Test Case

这个测试用例演示了在 `o-fill` 中如何正确使用 `$parent` 和 `$host`。

## 核心概念

### 第一层 o-fill
- 使用 `$host` 访问组件的数据和方法
- 使用 `$data` 访问当前迭代项的数据
- 不需要 `_$parent` 属性

### 嵌套 o-fill（第二层开始）
- 使用 `:_$parent="$data"` 传递父级 item 数据
- 在嵌套层中，`$parent` 指向父级的 item 数据
- `_$parent` 只接受 `$data`

## 数据访问层级

```
组件 data (startBalance, interestRate, items)
  │
  └─ 第一层 o-fill: :value="items"
      │  使用 $host 访问组件数据: {{$host.startBalance}}
      │  使用 $data 访问当前项: {{$data.name}}
      │
      └─ 第二层 o-fill: :value="$data.nestedArr" :_$parent="$data"
          │  $parent 指向第一层的 item 数据
          │  $data 是 nestedArr 的每一项
          │  可以访问: {{$parent.name}}, {{$parent.value}}
```

## 示例代码

### 第一层 o-fill
```html
<o-fill :value="items">
  <div>
    <!-- 访问组件数据 -->
    <div>Component Data: {{$host.startBalance}}</div>
    <!-- 访问当前项数据 -->
    <div>Item: {{$data.name}}</div>
  </div>
</o-fill>
```

### 嵌套 o-fill
```html
<o-fill :value="items">
  <div>
    <div>Item: {{$data.name}}</div>
    
    <!-- 嵌套 o-fill，传递父级 item 数据 -->
    <o-fill :value="$data.nestedArr" :_$parent="$data">
      <div>
        <!-- 访问父级 item 数据 -->
        <div>Parent Item: {{$parent.name}}</div>
        <!-- 访问当前项数据 -->
        <div>Nested: {{$data.nestedName}}</div>
      </div>
    </o-fill>
  </div>
</o-fill>
```

## 文件说明

- `demo.html` - 测试页面入口
- `test-comp.html` - 测试组件定义
- `parent-in-fill.spec.js` - 自动化测试脚本
- `test.html` - 手动测试页面（包含使用说明）

## 运行测试

```bash
# 运行自动化测试
npx playwright test parent-in-fill.spec.js

# 手动测试
# 在浏览器中打开 test.html 或 demo.html
```

## 关键要点

✅ 第一层 o-fill 使用 `$host` 访问组件数据  
✅ 嵌套 o-fill 使用 `:_$parent="$data"` 传递父级数据  
✅ `_$parent` 只接受 `$data`  
✅ 数据流向清晰，便于调试和维护  
