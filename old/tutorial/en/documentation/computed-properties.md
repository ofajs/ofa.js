# Computed Properties

Computed properties are a way to derive new data from reactive data; they automatically update when the dependent data changes. In ofa.js, computed properties are special methods defined in the `proto` object, using JavaScript's `get` or `set` keywords.

## Features and Advantages

- **Caching**: The result of a computed property is cached and only recalculated when its dependent data changes
- **Reactivity**: When dependent data updates, the computed property automatically updates
- **Declarative**: Dependencies are created declaratively, making the code clearer and easier to understand

## get computed property

get computed property is used to derive a new value from reactive data, it does not accept parameters and only returns a value calculated based on other data.

<o-playground name="get computed property example" style="--editor-height: 600px">
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
      <p>The computed property countDouble value is: {{countDouble}}</p>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                console.log('countDouble was accessed');
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

### Example of Practical Application Scenario

Computed properties are often used to handle complex data transformation logic, such as filtering arrays, formatting displayed text, etc.:

<o-playground name="Computed Property Example" style="--editor-height: 500px">
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
              names: ['Zhang 3', 'Li 4', 'Wang 54']
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

## set computed properties

Set computed property allows you to modify the underlying data state through assignment operations. It receives a parameter, usually used for reverse-updating the original data that depends on it.

<o-playground name="set computed property example" style="--editor-height: 700px">
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
        <p>Base value: {{count}}</p>
        <p>Double value: {{countDouble}}</p>
        <button on:click="resetCount">Reset count</button>
        <button on:click="setCountDouble">Set double value to 10</button>
        <button on:click="incrementCount">Increase base value</button>
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
                this.count = Math.max(0, val / 2); // ensure count is not negative
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

## Computed Properties vs Methods

Although methods can also achieve similar functions, computed properties have caching characteristics and will only recalculate when their dependent data changes, which makes performance better.

```javascript
// Using computed properties (recommended) - cached
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// Using methods - executed on each call
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## Notes

1. **Avoid Asynchronous Operations**: Computed properties should remain synchronous and side-effect-free; asynchronous calls or direct state mutations are prohibited.  
2. **Dependency Tracking**: Rely solely on reactive data; otherwise, updates will be unpredictable.  
3. **Error Protection**: Circular dependencies or abnormal assignments inside a computed property can cause rendering failures or even infinite loops—set boundary conditions and handle exceptions in advance.

## Practical Application Examples

The following is a simple form validation example that demonstrates the practicality of computed properties:

<o-playground name="Form Validation Example" style="--editor-height: 600px">
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
  </code>
</o-playground>

