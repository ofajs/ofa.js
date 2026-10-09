# Propriétés calculées

Les propriétés calculées constituent un moyen de dériver de nouvelles données à partir de données réactives ; elles se mettent automatiquement à jour lorsque les données dont elles dépendent changent. Dans ofa.js, les propriétés calculées sont des méthodes spéciales définies dans l’objet `proto`, en utilisant les mots-clés `get` ou `set` de JavaScript.

## Caractéristiques et avantages

- **Mise en cache** : Le résultat des propriétés calculées est mis en cache, et n'est recalculé que lorsque les données dont elles dépendent changent.
- **Réactivité** : Les propriétés calculées se mettent automatiquement à jour lorsque les données dépendantes sont mises à jour.
- **Déclaratif** : Déclarer les dépendances de manière déclarative rend le code plus clair et plus facile à comprendre.

## get propriété calculée

get propriété calculée sert à dériver une nouvelle valeur à partir de données réactives ; elle n’accepte aucun paramètre et ne retourne qu’une valeur calculée à partir d’autres données.

<o-playground name="exemple de propriété calculée get" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Cliquez-moi - {{count}} - {{countDouble}}</button>
      <p>La valeur de la propriété calculée countDouble est : {{countDouble}}</p>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                console.log('countDouble est accédé');
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

### Exemple de scénario d'application pratique

Les propriétés calculées sont souvent utilisées pour gérer des logiques complexes de transformation de données, comme filtrer un tableau, formater le texte affiché, etc. :

<o-playground name="Exemple de propriété calculée" style="--editor-height: 500px">
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
      <input type="text" sync:value="filterText" placeholder="Filtrer les noms...">
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
              names: ['Sophie 3', 'Lucas 4', 'Emma 54']
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

## set propriété calculée

La propriété calculée set vous permet de modifier l'état des données sous-jacentes par une opération d'affectation. Elle accepte un paramètre, généralement utilisé pour mettre à jour en sens inverse les données originales dont elle dépend.

<o-playground name="Exemple de propriété calculée set" style="--editor-height: 700px">
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
        <p>Valeur de base : {{count}}</p>
        <p>Valeur doublée : {{countDouble}}</p>
        <button on:click="resetCount">Réinitialiser le compteur</button>
        <button on:click="setCountDouble">Définir la valeur doublée à 10</button>
        <button on:click="incrementCount">Augmenter la valeur de base</button>
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
                this.count = Math.max(0, val / 2); // s'assure que count n'est pas négatif
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

## Propriétés calculées vs méthodes

Bien que les méthodes puissent également réaliser des fonctions similaires, les propriétés calculées possèdent une caractéristique de mise en cache : elles ne sont réévaluées que lorsque les données dont elles dépendent changent, ce qui offre de meilleures performances.

```javascript
// Utiliser une propriété calculée (recommandé) - avec cache
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// Utiliser une méthode - exécutée à chaque appel
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## Points d'attention

1. **Éviter les opérations asynchrones** : Les propriétés calculées doivent rester synchrones et sans effet secondaire. Il est interdit d'y effectuer des appels asynchrones ou de modifier directement l'état du composant.  
2. **Suivi des dépendances** : Veillez à ne dépendre que de données réactives, sinon les mises à jour seront imprévisibles.  
3. **Protection contre les erreurs** : Si une propriété calculée présente une dépendance cyclique ou une affectation anormale, cela peut entraîner un échec du rendu, voire une boucle infinie. Assurez-vous donc de définir à l'avance des conditions limites et de gérer correctement les exceptions.

## Exemples d'applications pratiques

Voici un exemple simple de validation de formulaire qui montre l'utilité des propriétés calculées :

<o-playground name="Exemple de validation de formulaire" style="--editor-height: 600px">
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
      <h3>Exemple de validation simple</h3>
      <input type="text" sync:value="username" placeholder="Saisir le nom d'utilisateur (au moins 3 caractères)">
      <p class="status" class:valid="isValid" class:invalid="!isValid">
        Statut : {{statusMessage}}
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
                return this.isValid ? 'Nom d\'utilisateur valide' : 'Longueur du nom d\'utilisateur insuffisante';
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

