# Template Syntax

ofa.js uses concise and intuitive template syntax to achieve data binding and dynamic rendering. This chapter introduces the core template syntax of ofa.js.

## Text Interpolation

Use double curly braces `{{}}` to insert variables or expressions:

```html
<p>Hello, {{name}}!</p>
<p>Count: {{count}}</p>
<p>Sum: {{a + b}}</p>
```

## HTML Rendering

Use the `:html` attribute to render HTML strings:

```html
<div :html="htmlContent"></div>
```

⚠️ **Security Note**: Ensure HTML content is trusted to avoid XSS attacks.

## Property Binding

### One-Way Binding

Use `:property="expression"` for one-way property binding:

```html
<input :value="inputValue" />
<img :src="imageUrl" />
```

### Two-Way Binding

Use `sync:property="expression"` for two-way binding:

```html
<input sync:value="inputValue" />
<input type="checkbox" sync:checked="isChecked" />
```

## Event Binding

Use `on:event="handler"` to bind events:

```html
<button on:click="handleClick">Click Me</button>
<input on:input="handleInput" />
```

## Class Binding

Use `class:className="condition"` for dynamic class binding:

```html
<div class:active="isActive">Content</div>
<p class:highlight="count > 5">Highlighted</p>
```

## Style Binding

Use `:style.property="expression"` for dynamic style binding:

```html
<p :style.color="textColor">Colored Text</p>
<div :style.fontSize="size + 'px'">Sized Text</div>
```

## Conditional Rendering

Use `<o-if>`, `<o-else-if>`, `<o-else>` components for conditional rendering:

```html
<o-if :value="count > 10">
  <p>Count is greater than 10</p>
</o-if>
<o-else-if :value="count > 5">
  <p>Count is greater than 5</p>
</o-else-if>
<o-else>
  <p>Count is 5 or less</p>
</o-else>
```

## List Rendering

Use `<o-fill>` component for list rendering:

```html
<o-fill :value="items">
  <div>{{$index}}: {{$data.name}}</div>
</o-fill>
```

## Attribute Passing

Use `attr:property="expression"` to pass attributes:

```html
<my-component attr:title="pageTitle"></my-component>
```

## Template Variables

| Variable | Description |
|---------|------|
| `$index` | Current index in list rendering |
| `$data` | Current data item in list rendering |
| `$event` | Event object |
| `$host` | Parent component instance |

## Expression Support

Template expressions support JavaScript expressions:

```html
<!-- Arithmetic operations -->
<p>{{a + b}}</p>
<p>{{count * 2}}</p>

<!-- Comparison operations -->
<p class:active="count > 5"></p>

<!-- Ternary expressions -->
<p>{{isActive ? 'Active' : 'Inactive'}}</p>

<!-- Method calls -->
<p>{{formatDate(date)}}</p>
```

## Key Points

- **Text Interpolation**: Use `{{}}` to insert variables
- **HTML Rendering**: Use `:html` attribute
- **Property Binding**: One-way `:`, Two-way `sync:`
- **Event Binding**: Use `on:event`
- **Class Binding**: Use `class:className`
- **Style Binding**: Use `:style.property`
- **Conditional Rendering**: `<o-if>`, `<o-else-if>`, `<o-else>`
- **List Rendering**: `<o-fill>` component
- **Template Variables**: `$index`, `$data`, `$event`, `$host`
