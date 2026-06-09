# ofa.js Quick Reference Sheet

This document provides a quick reference to ofa.js core APIs and syntax, convenient for quick lookup during development.

## Template Syntax Quick Reference

### Content Rendering

| Syntax | Purpose | Example |
|------|------|------|
| `{{var}}` | Text rendering | `<span>{{name}}</span>` |
| `:html` | HTML content rendering | `<div :html="htmlContent"></div>` |

### Property Binding

| Syntax | Purpose | Example |
|------|------|------|
| `:prop="key"` | One-way property binding | `<input :value="name">` |
| `sync:prop="key"` | Two-way property binding | `<input sync:value="name">` |
| `attr:name="key"` | HTML attribute binding | `<a attr:href="url">` |
| `attr:disabled="bool"` | Boolean attribute binding | `<button attr:disabled="isDisabled">` |

### Class and Style Binding

| Syntax | Purpose | Example |
|------|------|------|
| `class:name="bool"` | Conditional class binding | `<div class:active="isActive">` |
| `:style.prop="value"` | Style property binding | `<p :style.color="textColor">` |
| `data(key)` | Using data in styles | `font-size: data(size);` |

### Event Binding

| Syntax | Purpose | Example |
|------|------|------|
| `on:event="handler"` | Bind event handler | `<button on:click="handleClick">` |
| `on:event="expr"` | Directly execute expression | `<button on:click="count++">` |
| `on:event="fn(arg)"` | Pass parameters | `<button on:click="add(5)">` |
| `$event` | Access event object | `on:click="handle($event)"` |

### Conditional Rendering

| Component | Purpose | Example |
|------|------|------|
| `<o-if :value="bool">` | Conditional rendering | `<o-if :value="show">Content</o-if>` |
| `<o-else-if :value="bool">` | Else if | `<o-else-if :value="type === 'A'">` |
| `<o-else>` | Else | `<o-else>Default content</o-else>` |
| `<x-if>` | Non-explicit conditional rendering | Conditional component not rendered to DOM |

### List Rendering

| Syntax/Property | Purpose | Example |
|------|------|------|
| `<o-fill :value="arr">` | List rendering | `<o-fill :value="items">...</o-fill>` |
| `name="tpl"` | Named template | `<o-fill :value="items" name="item-tpl">` |
| `fill-key="id"` | Specify key for performance | `<o-fill :value="items" fill-key="id">` |
| `$index` | Current item index | `{{$index}}` |
| `$data` | Current item data | `{{$data.name}}` |
| `$host` | Component instance reference | `on:click="$host.removeItem($index)"` |
| `<x-fill>` | Non-explicit list rendering | List component not rendered to DOM |

---

## Component Definition

### Basic Structure

```html
<template component>
  <style>
    :host { display: block; }
  </style>
  <div>{{title}}</div>
  <script>
    export default async () => {
      return {
        tag: "my-component",
        data: { title: "Hello" },
        proto: { /* methods */ },
        watch: { /* watchers */ },
        ready() { /* lifecycle */ },
        attached() { /* lifecycle */ },
        detached() { /* lifecycle */ },
        loaded() { /* lifecycle */ }
      };
    };
  </script>
</template>
```

### Component Reference

| Method | Syntax | Features |
|------|------|------|
| Async reference | `<l-m src="./comp.html">` | Non-blocking, recommended |
| Sync reference | `await load("./comp.html")` | Blocking loading, ensures registration completion |

---

## Lifecycle Hooks

| Hook | Timing | Typical Use |
|------|---------|---------|
| `ready()` | DOM creation complete | DOM operations, initialize third-party libraries |
| `attached()` | Mounted to DOM | Start timers, add event listeners |
| `detached()` | Removed from DOM | Clean up resources, remove listeners |
| `loaded()` | Fully loaded | Operations depending on complete component tree |

**Execution Order**: ready → attached → loaded (detached called on removal)

---

## Data Management

### data Object

```javascript
data: {
  message: "Hello",
  count: 0,
  user: { name: "John", age: 25 },
  items: [1, 2, 3]
}
```

### Computed Properties

```javascript
proto: {
  get fullName() {
    return this.firstName + ' ' + this.lastName;
  },
  set fullName(val) {
    [this.firstName, this.lastName] = val.split(' ');
  }
}
```

### Watchers

```javascript
watch: {
  count(newVal, { watchers }) {
    console.log('count changed:', newVal);
  },
  "prop1,prop2"() {
    // Watch multiple properties
  }
}
```

---

## Custom Events

### Trigger Events

```javascript
this.emit('custom-event');

this.emit('data-changed', {
  data: { value: 100 },
  bubbles: true,
  composed: true
});
```

### Listen to Events

```html
<my-component on:custom-event="handler"></my-component>
```

---

## State Management

### Create State Object

```javascript
export const store = $.stanz({
  user: null,
  theme: "light"
});
```

### Using in Components

```javascript
attached() {
  this.userData = store.user;
},
detached() {
  this.userData = {}; // Clean up reference
}
```

---

## Context State (Provider/Consumer)

### Provider

```html
<o-provider name="userInfo" user-id="123" user-name="John">
  ...
</o-provider>
```

### Consumer

```html
<o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
```

### Root Provider (Global)

```html
<o-root-provider name="globalConfig" theme="dark"></o-root-provider>
```

---

## Special Components

### Slots

```html
<slot></slot>
<slot name="header"></slot>
```

### Style Query

```html
<match-var theme="dark">
  <style>
    :host { background-color: #333; }
  </style>
</match-var>
```

### Inject Host Style

```html
<inject-host>
  <style>
    parent-comp child-comp { color: red; }
  </style>
</inject-host>
```

### replace-temp

```html
<select>
  <template is="replace-temp">
    <x-fill :value="options">
      <option>{{$data}}</option>
    </x-fill>
  </template>
</select>
```

---

## Pages and Applications

### Page Module

```html
<template page>
  <style>:host { display: block; }</style>
  <script>
    export default async ({ load, query }) => {
      return { data: {}, proto: {} };
    };
  </script>
</template>
```

### Micro Application

```html
<o-app src="./app-config.js"></o-app>
```

### Routing

```html
<o-router>
  <a href="#/page1">Page 1</a>
  <a href="#/page2">Page 2</a>
</o-router>
```

---

## Common Instance Methods

| Method | Purpose | Example |
|------|------|------|
| `this.goto(url)` | Page navigation | `this.goto('./detail.html')` |
| `this.back()` | Go back to previous page | `this.back()` |
| `this.getProvider(name)` | Get provider | `this.getProvider('userInfo')` |
| `this.emit(name, opts)` | Trigger custom event | `this.emit('change', { data: val })` |
| `this.remove()` | Remove component | `this.remove()` |

---

## Special Variables

| Variable | Purpose | Available Location |
|------|------|---------|
| `$event` | Event object | In event handlers |
| `$index` | List item index (starting from 0) | Inside o-fill / x-fill |
| `$data` | List item data object | Inside o-fill / x-fill |
| `$host` | Component instance reference | Inside o-fill / x-fill |

**⚠️ Important Reminder**: Inside o-fill / x-fill, **you must use `$data`, `$index`, `$host`** these special variables, **cannot use other variable names** (like item, element, row, etc.).

**Wrong Example**:
```html
<o-fill :value="items">
  <div>{{item.name}}</div>  <!-- ❌ Wrong: using item -->
</o-fill>
```

**Correct Example**:
```html
<o-fill :value="items">
  <div>{{$data.name}}</div>  <!-- ✅ Correct: using $data -->
</o-fill>
```
