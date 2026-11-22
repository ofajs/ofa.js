# Observateurs

L'observateur (Watcher) est une fonctionnalité de ofa.js utilisée pour surveiller les changements de données et exécuter une logique correspondante. Lorsque les données réactives changent, l'observateur déclenche automatiquement une fonction de rappel, vous permettant d'effectuer des tâches telles que la transformation de données, des opérations à effet secondaire ou un traitement asynchrone.

## Utilisation de base

Les observateurs sont définis dans l'objet `watch` du composant, où les noms de clé correspondent aux noms des propriétés de données à observer, et les valeurs sont les fonctions de rappel exécutées lorsque les données changent.

<o-playground name="watchers - utilisation de base" style="--editor-height: 700px">
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

## Paramètres de la fonction de rappel

La fonction de rappel du listener reçoit deux paramètres :- `newValue`：la nouvelle valeur après le changement
- `{watchers}`：l’ensemble des objets observateurs du composant actuel

Après les changements de données, un traitement anti-rebond est d'abord effectué, puis le callback dans `watch` est exécuté ; le paramètre `watchers` est l'ensemble de toutes les modifications fusionnées pendant ce cycle anti-rebond.

Les fonctions dans `watch` sont appelées immédiatement après l'initialisation du composant, afin d'établir l'écoute des données. On peut distinguer s'il s'agit du premier appel en vérifiant si `watchers` possède une longueur.

<o-playground name="watchers - paramètres de rappel" style="--editor-height: 700px">
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
      <p>Nom : {{name}}</p>
      <p>Âge : {{age}}</p>
      <input sync:value="name" placeholder="Entrez le nom" />
      <input sync:value="age" type="number" placeholder="Entrez l'âge" />
      <div class="log">{{log}}</div>
      <script>
        export default async () => {
          return {
            data: {
              name: "ZhangShan",
              age: 25,
              log: "",
            },
            watch: {
              name(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // obtenir l'un d'entre eux
                this.log += `propriété "${watcher.name}" est passée de "${watcher.oldValue}" à "${watcher.value}"\n`;
              },
              age(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // obtenir l'un d'entre eux
                this.log += `propriété "${watcher.name}" est passée de "${watcher.oldValue}" à "${watcher.value}"\n`;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Écoute approfondie

Pour les données imbriquées de type objet ou tableau, une écoute profonde est automatiquement effectuée dans watch.

<o-playground name="watchers - Écoute approfondie" style="--editor-height: 700px">
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
        <p>Informations utilisateur:</p>
        <p>Nom: {{user.name}}</p>
        <p>Âge: {{user.age}}</p>
        <p>Loisirs: {{user.hobbies.join(', ')}}</p>
      </div>
      <div>
        <button on:click="updateName">Modifier le nom</button>
        <button on:click="updateAge">Modifier l’âge</button>
        <button on:click="addHobby">Ajouter un loisir</button>
        <button on:click="updateHobby">Modifier un loisir</button>
      </div>
      <div class="info" :html="log"></div>
      <script>
        export default async () => {
          return {
            data: {
              user: {
                name: "Zhang San",
                age: 25,
                hobbies: ["basket-ball", "football"],
              },
              log: "",
            },
            watch: {
              user(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // Obtenir l'un d'eux
                console.log("Modification: ",watcher.target);
                if(watcher.type === 'set'){
                  this.log += `Valeur modifiée -> Propriété "${watcher.name}" est passée de "${watcher.oldValue}" à "${watcher.value}" <br>`;
                }else{
                  this.log += `Méthode exécutée ${watcher.type} -> Nom de la fonction "${watcher.name}" arguments "${watcher.args}" <br>`;
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
                this.user.hobbies.push("natation");
              },
              updateHobby() {
                this.user.hobbies[0] = "badminton";
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Écouter plusieurs sources de données

Vous pouvez surveiller les changements de plusieurs données en même temps et exécuter la logique correspondante en fonction des changements des multiples données dans la fonction de rappel.

<o-playground name="watchers - sources multiples" style="--editor-height: 600px">
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
      <p>Largeur : {{rectWidth}}</p>
      <p>Hauteur : {{rectHeight}}</p>
      <p>Surface : {{area}}</p>
      <input sync:value="rectWidth" type="number" placeholder="Largeur" />
      <input sync:value="rectHeight" type="number" placeholder="Hauteur" />
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

## Scénarios d'application réels

### 1. Validation des formulaires

<o-playground name="watchers - validation de formulaire" style="--editor-height: 800px">
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
      <input sync:value="username" placeholder="Nom d'utilisateur (3-10 caractères)" />
      <span class="error">{{usernameError}}</span>
      <input sync:value="email" placeholder="E-mail" />
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
                  this.usernameError = "Le nom d'utilisateur doit contenir entre 3 et 10 caractères";
                } else {
                  this.usernameError = "";
                }
              },
              email(val) {
                const emailRegex = /^.+@.+\..+$/;
                if (!emailRegex.test(val)) {
                  this.emailError = "Veuillez entrer une adresse e-mail valide";
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

### 2. Définir le thème

<o-playground name="watchers - Définir le thème" style="--editor-height: 800px">
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
      <p>Paramètre: {{settings.theme}}</p>
      <p>État de sauvegarde: {{saveStatus}}</p>
      <button on:click="setLight">Thème clair</button>
      <button on:click="setDark">Thème sombre</button>
      <button on:click="resetSettings">Réinitialiser</button>
      <script>
        export default async () => {
          return {
            data: {
              settings: {
                theme: "light",
              },
              saveStatus: "Sauvegardé",
            },
            watch: {
              settings(){
                  this.saveStatus = "Sauvegarde en cours...";
                  setTimeout(() => {
                    this.saveStatus = "Sauvegardé";
                    console.log("Paramètres sauvegardés:", this.settings);
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

## Remarques

- **Évitez de modifier les données surveillées** : modifier les données surveillées dans le rappel du « watcher » peut entraîner une boucle infinie. Si une modification est nécessaire, assurez-vous d’avoir une condition appropriée.
- **Préférez une propriété calculée** : si vous devez calculer une nouvelle valeur à partir de plusieurs données, il est recommandé d’utiliser une [propriété calculée](./computed-properties.md) plutôt qu’un « watcher ».