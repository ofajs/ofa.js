# Computed Properties

Computed properties are a way to derive new data from reactive data, and they automatically update when the data they depend on changes. In ofa.js, computed properties are special methods defined in the `proto` object, using JavaScript's `get` or `set` keywords.

## Features and Advantages

- **Caching**: Computed property results are cached and only recalculated when their dependent data changes
- **Reactive**: Computed properties automatically update when dependent data is updated
- **Declarative**: Create dependencies in a declarative way, making code clearer and easier to understand

## get Computed Properties

get computed properties are used to derive new values from reactive data. They don't accept parameters and only return values calculated based on other data.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <button on:click="clickMe">Click Me - {{count}} - {{countDouble}}</button>
  <p>The value of computed property countDouble is: {{countDouble}}</p>
  <script>
    export default async () => {
      return {
        data: {
          count: 1,
        },
        proto: {
          get countDouble() {
            console.log('countDouble accessed');
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
```

### Practical Application Example

Computed properties are commonly used to handle complex data transformation logic, such as filtering arrays, formatting display text, etc.:

```html
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
  <input type="text" sync:value="filterText" placeholder="Filter names...">
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
          names: ['Zhang3', 'Li4', 'Wang54']
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
```

## set Computed Properties

set computed properties allow you to modify underlying data state through assignment operations. It receives one parameter, typically used to reverse update the original data it depends on.

```html
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
    <p>Base value: {{count}}</p>
    <p>Double value: {{countDouble}}</p>
    <button on:click="resetCount">Reset Count</button>
    <button on:click="setCountDouble">Set Double Value to 10</button>
    <button on:click="incrementCount">Increment Base Value</button>
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
            this.count = Math.max(0, val / 2); // Ensure count is not negative
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
```

## Computed Properties vs Methods

Although methods can achieve similar functionality, computed properties have caching characteristics and only re-evaluate when their dependent data changes, making them more performant.

```javascript
// Using computed property (recommended) - has caching
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// Using method - executes every time called
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## Notes

1. **Avoid Asynchronous Operations**: Computed properties should remain synchronous and side-effect free. Do not make asynchronous calls or directly modify component state in them.
2. **Dependency Tracking**: Make sure to only depend on reactive data, otherwise updates will be unpredictable.
3. **Error Protection**: If circular dependencies or abnormal assignments occur inside computed properties, it may cause rendering failures or even infinite loops. Be sure to set boundary conditions in advance and handle exceptions properly.

## Practical Application Example

Here's a simple form validation example showing the practicality of computed properties:

```html
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
  <h3>Simple Validation Example</h3>
  <input type="text" sync:value="username" placeholder="Enter username (at least 3 characters)">
  <p class="status" class:valid="isValid" class:invalid="!isValid">
    Status: {{statusMessage}}
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
            return this.isValid ? 'Username is valid' : 'Username is too short';
          },
        }
      };
    };
  </script>
</template>
```

## Key Points

- **Caching Feature**: Computed property results are cached and only recalculated when dependent data changes
- **get Computed Properties**: Used to derive new values, don't accept parameters
- **set Computed Properties**: Used to reverse update original data, accept one parameter
- **Performance Advantage**: Compared to method calls, computed properties have caching characteristics and better performance
- **Applicable Scenarios**: Data transformation, filtering, formatting, form validation, etc.
