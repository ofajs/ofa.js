# Watchers

Watchers are a feature in ofa.js used to monitor data changes and execute corresponding logic. When reactive data changes, watchers automatically trigger callback functions, allowing you to perform tasks such as data transformation, side effect operations, or asynchronous processing.

## Basic Usage

Watchers are defined in the component's `watch` object, where key names correspond to the data property names to monitor, and values are callback functions executed when data changes.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p>
    count:{{count}}
    <br />
    doubleCount:{{doubleCount}}
  </p>
  <input sync:value="count" type="number" />
  <script>
    export default async () => {
      return {
        data: {
          count: 0,
          doubleCount: 0,
        },
        watch: {
          count(count) {
            setTimeout(() => {
              this.doubleCount = count * 2;
            }, 500);
          },
        },
      };
    };
  </script>
</template>
```

## Callback Function Parameters

Watcher callback functions receive two parameters:
- `newValue`: The new value after change
- `{watchers}`: All watcher objects of the current component

After data changes, debouncing is performed first, then callbacks in `watch` are executed; the `watchers` parameter is the collection of all changes merged within this debounce cycle.

Functions in `watch` are called immediately after component initialization completes, used to establish data monitoring. You can distinguish whether it's the first call by checking if `watchers` has length.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    .log {
      margin-top: 10px;
      padding: 10px;
      background-color: #7e7e7eff;
      font-family: monospace;
      white-space: pre-wrap;
    }
  </style>
  <p>Name: {{name}}</p>
  <p>Age: {{age}}</p>
  <input sync:value="name" placeholder="Enter name" />
  <input sync:value="age" type="number" placeholder="Enter age" />
  <div class="log">{{log}}</div>
  <script>
    export default async () => {
      return {
        data: {
          name: "John",
          age: 25,
          log: "",
        },
        watch: {
          name(newVal,{watchers}) {
            if(!watchers){
              return;
            }
            const watcher = watchers[0]; // Get one of them
            this.log += `Property "${watcher.name}" changed from "${watcher.oldValue}" to "${watcher.value}"\n`;
          },
          age(newVal,{watchers}) {
            if(!watchers){
              return;
            }
            const watcher = watchers[0]; // Get one of them
            this.log += `Property "${watcher.name}" changed from "${watcher.oldValue}" to "${watcher.value}"\n`;
          },
        },
      };
    };
  </script>
</template>
```

## Deep Watching

For nested data of object or array types, deep monitoring is automatically performed inside watch.

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
    .info {
      margin-top: 10px;
      padding: 10px;
      background-color: gray;
    }
  </style>
  <div>
    <p>User Info:</p>
    <p>Name: {{user.name}}</p>
    <p>Age: {{user.age}}</p>
    <p>Hobbies: {{user.hobbies.join(', ')}}</p>
  </div>
  <div>
    <button on:click="updateName">Update Name</button>
    <button on:click="updateAge">Update Age</button>
    <button on:click="addHobby">Add Hobby</button>
    <button on:click="updateHobby">Update Hobby</button>
  </div>
  <div class="info" :html="log"></div>
  <script>
    export default async () => {
      return {
        data: {
          user: {
            name: "John",
            age: 25,
            hobbies: ["Basketball", "Football"],
          },
          log: "",
        },
        watch: {
          user(newVal,{watchers}) {
            if(!watchers){
              return;
            }
            const watcher = watchers[0]; // Get one of them
            console.log("Modified: ",watcher.target);
            if(watcher.type === 'set'){
              this.log += `Modify value-> Property "${watcher.name}" changed from "${watcher.oldValue}" to "${watcher.value}" <br>`;
            }else{
              this.log += `Execute method${watcher.type}-> Function name "${watcher.name}" Arguments "${watcher.args}" <br>`;
            }
          },
        },
        proto: {
          updateName() {
            this.user.name = "Jane";
          },
          updateAge() {
            this.user.age = 30;
          },
          addHobby() {
            this.user.hobbies.push("Swimming");
          },
          updateHobby() {
            this.user.hobbies[0] = "Badminton";
          },
        },
      };
    };
  </script>
</template>
```

## Watching Multiple Data Sources

You can simultaneously monitor changes in multiple data and execute corresponding logic in the callback function based on changes in multiple data.

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
  <p>Width: {{rectWidth}}</p>
  <p>Height: {{rectHeight}}</p>
  <p>Area: {{area}}</p>
  <input sync:value="rectWidth" type="number" placeholder="Width" />
  <input sync:value="rectHeight" type="number" placeholder="Height" />
  <script>
    export default async () => {
      return {
        data: {
          rectWidth: 10,
          rectHeight: 5,
          area: 0,
        },
        watch: {
          // "rectWidth,rectHeight"(){
          ["rectWidth,rectHeight"](){
            this.area = (this.rectWidth || 0) * (this.rectheight || 0);
          }
        }
      };
    };
  </script>
</template>
```

## Practical Application Scenarios

### 1. Form Validation

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 15px;
    }
    input {
      display: block;
      margin: 10px 0;
      padding: 8px;
      width: 200px;
    }
    .error {
      color: red;
      font-size: 12px;
    }
  </style>
  <input sync:value="username" placeholder="Username (3-10 characters)" />
  <span class="error">{{usernameError}}</span>
  <input sync:value="email" placeholder="Email" />
  <span class="error">{{emailError}}</span>
  <script>
    export default async () => {
      return {
        data: {
          username: "",
          email: "",
          usernameError: "",
          emailError: "",
        },
        watch: {
          username(val) {
            if (val.length < 3 || val.length > 10) {
              this.usernameError = "Username must be 3-10 characters";
            } else {
              this.usernameError = "";
            }
          },
          email(val) {
            const emailRegex = /^.+@.+\..+$/;
            if (!emailRegex.test(val)) {
              this.emailError = "Please enter a valid email address";
            } else {
              this.emailError = "";
            }
          },
        },
      };
    };
  </script>
</template>
```

### 2. Setting Theme

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
  <p>Setting: {{settings.theme}}</p>
  <p>Save Status: {{saveStatus}}</p>
  <button on:click="setLight">Light Theme</button>
  <button on:click="setDark">Dark Theme</button>
  <button on:click="resetSettings">Reset</button>
  <script>
    export default async () => {
      return {
        data: {
          settings: {
            theme: "light",
          },
          saveStatus: "Saved",
        },
        watch: {
          settings(){
              this.saveStatus = "Saving...";
              setTimeout(() => {
                this.saveStatus = "Saved";
                console.log("Settings saved:", this.settings);
              }, 500);
          }
        },
        proto: {
          setLight() {
            this.settings.theme = "light";
          },
          setDark() {
            this.settings.theme = "dark";
          },
          resetSettings() {
            this.settings = { theme: "light" };
          },
        },
      };
    };
  </script>
</template>
```

## Notes

- **Avoid Modifying Monitored Data**: Modifying monitored data in watcher callbacks may cause infinite loops. If modification is needed, ensure appropriate conditional checks are in place.
- **Consider Using Computed Properties**: If you need to calculate new values based on changes in multiple data, it's recommended to use computed properties instead of watchers.

## Key Points

- **watch Object**: Define watchers in the `watch` object
- **Callback Parameters**: Receives `newValue` and `{watchers}` two parameters
- **Deep Watching**: Automatically performs deep monitoring for objects and arrays
- **Multiple Data Sources**: Supports simultaneously watching multiple data sources
- **Debounce Processing**: Data changes are debounced before executing callbacks
- **Applicable Scenarios**: Form validation, data persistence, asynchronous operations, etc.
