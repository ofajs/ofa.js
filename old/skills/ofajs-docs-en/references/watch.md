# Watch

In ofa.js, the `watch` feature is used to monitor data changes and execute corresponding callback functions. Through watchers, you can perform specific operations when data changes, such as logging, asynchronous requests, or complex calculations.

## Basic Usage

Define watchers in the `watch` object, the property name is the data property to monitor, and the value is the callback function:

```javascript
export default async () => {
  return {
    data: {
      count: 0,
      message: "Hello"
    },
    watch: {
      count(newValue, { watchers }) {
        console.log(`count changed to ${newValue}`);
      },
      message(newValue) {
        console.log(`message changed to ${newValue}`);
      }
    }
  };
};
```

## Watcher Parameters

The watcher callback function receives two parameters:

1. **newValue**: The new value after the data change
2. **options**: An object containing additional information
   - `watchers`: An array containing watcher information objects
     - `watchers[0].oldValue`: The old value before the data change

```javascript
watch: {
  count(newValue, { watchers }) {
    if (watchers) {
      const watcher = watchers[0];
      console.log(`count changed from ${watcher.oldValue} to ${newValue}`);
    } else {
      // No watchers means this is initial assignment monitoring
      console.log(`count initialized to ${newValue}`);
    }
  }
}
```

## Watcher Execution Timing

### Initial Assignment

When data is first assigned, the watcher is called but the `watchers` parameter is empty:

```javascript
watch: {
  count(newValue, { watchers }) {
    if (!watchers) {
      console.log("Initial assignment, no old value");
    }
  }
}
```

### Data Changes

When data changes, the watcher is called and the `watchers` parameter contains old value information:

```javascript
watch: {
  count(newValue, { watchers }) {
    if (watchers) {
      const oldValue = watchers[0].oldValue;
      console.log(`count changed from ${oldValue} to ${newValue}`);
    }
  }
}
```

## Practical Application Examples

### 1. Logging

```javascript
watch: {
  message(newValue, { watchers }) {
    console.log(`Message updated: ${newValue}`);
  }
}
```

### 2. Asynchronous Operations

```javascript
watch: {
  async searchKeyword(newValue) {
    if (newValue.length > 2) {
      const results = await fetch(`/api/search?q=${newValue}`);
      this.searchResults = results;
    }
  }
}
```

### 3. Computed Values

```javascript
watch: {
  firstName() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  },
  lastName() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}
```

### 4. Form Validation

```javascript
watch: {
  email(newValue) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isEmailValid = emailRegex.test(newValue);
  }
}
```

## Complete Example

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
    .input-group {
      margin: 10px 0;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input {
      padding: 8px;
      width: 200px;
    }
    .log {
      margin-top: 20px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .log-item {
      margin: 5px 0;
      font-family: monospace;
    }
  </style>
  
  <h3>Watcher Demo</h3>
  
  <div class="input-group">
    <label>Count: {{count}}</label>
    <button on:click="count++">+1</button>
    <button on:click="count--">-1</button>
  </div>
  
  <div class="input-group">
    <label>Message:</label>
    <input sync:value="message" />
  </div>
  
  <div class="log">
    <h4>Change Logs:</h4>
    <o-fill :value="logs">
      <div class="log-item">{{$data}}</div>
    </o-fill>
  </div>
  
  <script>
    export default async () => {
      return {
        data: {
          count: 0,
          message: "Hello",
          logs: []
        },
        watch: {
          count(newValue, { watchers }) {
            if (watchers) {
              const oldValue = watchers[0].oldValue;
              this.logs.push(`count: ${oldValue} → ${newValue}`);
            } else {
              this.logs.push(`count initialized: ${newValue}`);
            }
          },
          message(newValue, { watchers }) {
            if (watchers) {
              const oldValue = watchers[0].oldValue;
              this.logs.push(`message: "${oldValue}" → "${newValue}"`);
            }
          }
        }
      };
    };
  </script>
</template>
```

## Notes

1. **Avoid Infinite Loops**: Don't modify the monitored data in the watcher, this will cause infinite loops
2. **Performance Consideration**: Watchers execute on every data change, avoid heavy operations
3. **Asynchronous Operations**: Watchers support async functions, can perform asynchronous operations

## Key Points

- **watch Object**: Define data watchers
- **Callback Parameters**: `newValue`, `{ watchers }`
- **watchers Array**: Contains old value information
- **Initial Assignment**: `watchers` is empty
- **Data Change**: `watchers[0].oldValue` gets old value
- **Use Cases**: Logging, asynchronous operations, computed values, validation
