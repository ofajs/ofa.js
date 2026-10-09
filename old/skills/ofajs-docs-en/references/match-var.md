# Style Query

`match-var` is a functional component in ofa.js for style matching based on CSS variables. Through `match-var`, different styles can be dynamically matched and applied based on the current component's CSS variable values. This feature is specifically designed for style-related context state passing, without needing JavaScript, making it more convenient to use, suitable for style passing needs like theme colors.

## Core Concepts

- **match-var**: Style matching component, decides whether to apply internal styles based on CSS variable values
- **Attribute Matching**: Defines CSS variables to match and expected values through component attributes
- **Style Application**: When matched successfully, styles in internal `<style>` tags are applied to the component

## Basic Usage

The `match-var` component defines matching rules for CSS variables through attributes. The attribute name corresponds to the CSS variable name (without `--` prefix), and the attribute value is the expected value to match.

```html
<match-var theme="dark">
  <style>
    :host {
      background-color: #333;
      color: white;
    }
  </style>
</match-var>
```

### Attributes

The `match-var` component uses arbitrary attributes to define CSS variable matching rules. Attribute names correspond to CSS variable names (without `--` prefix), and attribute values are the expected values to match.

### How It Works

1. **Browser Support**: If the browser supports `@container style()` queries, native CSS capabilities are used directly
2. **Fallback Handling**: If not supported, CSS variable value changes are detected through polling, and styles are dynamically injected after successful matching
3. **Manual Refresh**: Style detection can be triggered manually through the `$.checkMatch()` method

## Basic Example

```html
<!-- page1.html -->
<template page>
  <l-m src="./theme-box.html"></l-m>
  <style>
    :host{
        display: block;
    }
  </style>
  <style>
    .container{
       --theme: data(currentTheme);
    }
  </style>
  <button on:click="changeTheme">Switch Theme</button> - Theme:{{currentTheme}}
  <div class="container">
    <theme-box>
      Display different styles based on CSS variables
    </theme-box>
  </div>
    <theme-box style="--theme: light;">
      Display light theme
    </theme-box>
    <theme-box style="--theme: dark;">
      Display dark theme
    </theme-box>
  </div>
  <script>
    export default async ()=>{
      return {
        data: {
            currentTheme: "light",
        },
        proto:{
            changeTheme(){
                this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
            }
        }
      };
    };
  </script>
</template>
```

```html
<!-- theme-box.html -->
<template component>
  <style>
    :host {
      display: block;
      margin: 8px 0;
    }
    .content {
      padding: 20px;
      border-radius: 4px;
    }
  </style>
  <match-var theme="light">
    <style>
      .content {
        background-color: #f5f5f5;
        color: #333;
      }
    </style>
  </match-var>
  <match-var theme="dark">
    <style>
      .content {
        background-color: #333;
        color: white;
      }
    </style>
  </match-var>
  <div class="content">
    <slot></slot>
  </div>
  <script>
    export default {
      tag: "theme-box",
      data: {
        theme: "light",
      },
    };
  </script>
</template>
```

## Multi-Condition Matching

You can use multiple attributes simultaneously to define more complex matching conditions. Styles are only applied when all CSS variables match.

```html
<match-var theme="dark" size="large">
  <style>
    :host {
      padding: 20px;
      font-size: 18px;
    }
  </style>
</match-var>
```

## Multi-Condition Matching Example

```html
<!-- page1.html -->
<template page>
  <style>
    :host {
        display: block;
    }
  </style>
  <style>
    .content{
        --theme: data(theme);
        --size: data(size);
    }
  </style>
  <l-m src="./test-card.html"></l-m>
  <div>Theme: {{theme}} <button on:click="changeTheme">Switch Theme</button></div>
  <div>Size: {{size}} <button on:click="changeSize">Switch Size</button></div>
  <div class="content">
    <test-card>
      <div>Multi-condition style matching example</div>
    </test-card>
  </div>
  <script>
    export default async ()=>{
        return {
            data:{
                theme:"light",
                size:"small"
            },
            proto:{
                changeTheme(){
                    this.theme = this.theme === "light" ? "dark" : "light";
                },
                changeSize(){
                    this.size = this.size === "small" ? "large" : "small";
                }
            }
        };
    }
  </script>
</template>
```

```html
<!-- test-card.html -->
<template component>
  <style>
    :host {
      display: block;
      padding: 20px;
      margin: 10px;
    }
  </style>
  <match-var theme="light" size="small">
    <style>
      :host {
        background-color: #e3f2fd;
        border: 1px solid #2196f3;
      }
    </style>
  </match-var>
  <match-var theme="light" size="large">
    <style>
      :host {
        background-color: #bbdefb;
        border: 2px solid #1976d2;
      }
    </style>
  </match-var>
  <match-var theme="dark" size="small">
    <style>
      :host {
        background-color: #424242;
        border: 1px solid #757575;
        color: white;
      }
    </style>
  </match-var>
  <match-var theme="dark" size="large">
    <style>
      :host {
        background-color: #212121;
        border: 2px solid #616161;
        color: white;
      }
    </style>
  </match-var>
  <slot></slot>
  <script>
    export default {
      tag: "test-card",
      data: {},
    };
  </script>
</template>
```

## checkMatch Manual Refresh

In some cases, CSS variable changes may not be automatically detected. In such cases, you can manually call the `$.checkMatch()` method to trigger style detection.

> Currently Firefox doesn't support `@container style()` queries, so you need to manually call `$.checkMatch()`; in the future when browsers natively support it, the system will automatically detect variable changes without manual triggering.

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // Manually trigger style detection
    $.checkMatch();
  }
}
```

## Best Practices

1. **Prioritize Native CSS Capabilities**: `match-var` will prioritize using browser-native `@container style()` queries, which perform better in modern browsers
2. **Reasonably Organize Styles**: Put related matching styles together for easier maintenance and understanding
3. **Use data() Binding**: Combine with the `data()` directive to achieve responsive style switching
