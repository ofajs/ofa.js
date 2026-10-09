# Listener

Watcher is a feature in ofa.js used to listen for data changes and execute corresponding logic. When reactive data changes, the watcher automatically triggers a callback function, allowing you to perform tasks such as data transformation, side effects operations, or asynchronous processing.

## Basic Usage

Listeners are defined in the component's `watch` object, where the key corresponds to the name of the data property to be observed, and the value is the callback function executed when the data changes.

<o-playground name="watchers - Basic Usage" style="--editor-height: 700px">
  <code>
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
  </code>
</o-playground>

## Callback Function Parameters

The listener callback function receives two parameters:- `newValue`: the new value after the change
- `{watchers}`: all watcher objects of the current component

After data changes, debounce processing will be performed first, and then the callback in `watch` will be executed; the `watchers` parameter is the set of all merged changes within this debounce cycle.

The functions in `watch` are called immediately after the component is initialized, used to establish data watchers. You can distinguish whether it's the first call by checking if `watchers` has any length.

<o-playground name="watchers - callback arguments" style="--editor-height: 700px">
  <code>
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
              name: "Zhang San",
              age: 25,
              log: "",
            },
            watch: {
              name(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // get one of them
                this.log += `Property "${watcher.name}" changed from "${watcher.oldValue}" to "${watcher.value}"\n`;
              },
              age(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // get one of them
                this.log += `Property "${watcher.name}" changed from "${watcher.oldValue}" to "${watcher.value}"\n`;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Deep Watch

For nested data of object or array types, watch will automatically perform deep listening.

<o-playground name="watchers - deep watching" style="--editor-height: 700px">
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
                name: "Zhang San",
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
                console.log("Modification: ",watcher.target);
                if(watcher.type === 'set'){
                  this.log += `Changed value-> Property "${watcher.name}" from "${watcher.oldValue}" to "${watcher.value}" <br>`;
                }else{
                  this.log += `Executed method ${watcher.type}-> Function name "${watcher.name}" Arguments "${watcher.args}" <br>`;
                }
              },
            },
            proto: {
              updateName() {
                this.user.name = "Li Si";
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
  </code>
</o-playground>

## Listening to Multiple Data Sources

You can listen for changes in multiple pieces of data simultaneously and execute corresponding logic in the callback function based on the changes of multiple data.

<o-playground name="watchers - multiple data sources" style="--editor-height: 600px">
  <code>
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
  </code>
</o-playground>

## Actual Application Scenarios

### 1. Form Validation

<o-playground name="watchers - form validation" style="--editor-height: 800px">
  <code>
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
  </code>
</o-playground>

### 2. Setting the Theme

<o-playground name="watchers - Set Theme" style="--editor-height: 800px">
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
      <p>Settings: {{settings.theme}}</p>
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
  </code>
</o-playground>

## Precautions

- **Avoid modifying watched data**: Modifying the data being watched in a watcher callback may cause an infinite loop. If modification is necessary, ensure proper conditional checks.
- **Consider using computed properties instead**: If you need to calculate a new value based on changes in multiple data, it is recommended to use [computed properties](./computed-properties.md) instead of watchers.