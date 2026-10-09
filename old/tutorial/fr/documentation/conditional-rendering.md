# Rendu conditionnel

Dans ofa.js, le rendu conditionnel est une fonctionnalité importante qui permet de décider de l'affichage d'un élément ou d'un composant en fonction de l'état des données. ofa.js propose un schéma de rendu conditionnel basé sur les composants, implémenté via les composants `o-if`, `o-else-if` et `o-else`.

## Composant o-if

Le composant `o-if` est utilisé pour décider si son contenu doit être rendu ou non selon la valeur de vérité d’une expression. Lorsque l’attribut lié `value` est vrai, le contenu du composant est rendu ; sinon, il n’apparaît pas dans le DOM.

<o-playground name="Exemple de fonctionnement d'o-if" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="isHide = !isHide">Basculer l'affichage</button>
      <o-if :value="!isHide">
        <p>{{val}}</p>
      </o-if>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### principe de fonctionnement de o-if

`o-if` ne rendra le contenu dans le DOM que lorsque la condition est vraie ; lorsque la condition est fausse, les éléments DOM à l'intérieur de `o-if` sont complètement supprimés. Cette approche convient aux cas où la condition change peu fréquemment, car elle implique la création et la destruction du DOM.

## Composants o-else-if et o-else

Lorsque plusieurs branches conditionnelles sont nécessaires, vous pouvez utiliser les composants `o-else-if` et `o-else` avec `o-if` pour réaliser le rendu conditionnel multi-branches.

- `o-if`：le premier composant de condition obligatoire
- `o-else-if`：composant de condition intermédiaire optionnel, peut y en avoir plusieurs
- `o-else`：composant de condition par défaut optionnel, placé en dernier

<o-playground name="Exemple de rendu conditionnel multi-branches" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="num++">Toggle Display - {{num}}</button>
      <!-- En fonction du résultat de num modulo 3, bascule l'affichage de différents contenus -->
      <o-if :value="num % 3 === 0">
        <p>❤️ 0 / 3</p>
      </o-if>
      <o-else-if :value="num % 3 === 1">
        <p>😊 1 / 3</p>
      </o-else-if>
      <o-else>
        <p>😭 2 / 3</p>
      </o-else>
      <script>
        export default async () => {
          return {
            data: {
              num: 0,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Exemple de scénario d'application pratique

### Contrôle des permissions utilisateur

<o-playground name="Exemple de contrôle des permissions utilisateur" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .admin-panel {
          background-color: #813b3bff;
          padding: 10px;
          margin: 10px 0;
        }
        .user-info {
          background-color: #3f6e86ff;
          padding: 10px;
          margin: 10px 0;
        }
      </style>
      <div>
        <button on:click="toggleUserRole">Changer le rôle de l'utilisateur</button>
        <p>Rôle actuel: {{role}}</p>
        <o-if :value="role === 'admin'">
          <div class="admin-panel">
            <h3>Panneau d'administration</h3>
            <button>Gérer les utilisateurs</button>
            <button>Paramètres système</button>
          </div>
        </o-if>
        <o-else-if :value="role === 'user'">
          <div class="user-info">
            <h3>Informations utilisateur</h3>
            <p>Bienvenue {{userName}}!</p>
          </div>
        </o-else-if>
        <o-else>
          <p>Veuillez vous connecter pour voir le contenu</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              role: 'guest',
              userName: 'Invité'
            },
            proto: {
              toggleUserRole() {
                if (this.role === 'guest') {
                  this.role = 'user';
                  this.userName = 'Zhang San';
                } else if (this.role === 'user') {
                  this.role = 'admin';
                } else {
                  this.role = 'guest';
                  this.userName = '';
                }
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Affichage de l'état de validation du formulaire

<o-playground name="Exemple d'affichage de l'état de validation du formulaire" style="--editor-height: 500px">
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
      <div>
        <h3>Exemple de validation d'email</h3>
        <input type="email" :value="email" on:input="email = $event.target.value" placeholder="Entrez l'adresse email">
        <o-if :value="email && isValidEmail(email)">
          <p style="color:green;">✓ Format d'email valide</p>
        </o-if>
        <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
          <p style="color:red;">✗ Format d'email invalide</p>
        </o-else-if>
        <o-else>
          <p style="color:orange;">Veuillez entrer une adresse email pour validation</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              email: ''
            },
            proto: {
              isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Meilleures pratiques de rendu conditionnel

1. **Cas d'utilisation** : Lorsque les éléments basculent rarement dans différentes conditions, il est plus approprié d'utiliser `o-if`, car cela permet de supprimer complètement les éléments inutiles et d'économiser de la mémoire.

2. **Considérations de performance** : Les éléments qui basculent fréquemment sont mieux adaptés à l'utilisation de liaisons de classe (comme `class:hide`) plutôt qu'au rendu conditionnel, car le rendu conditionnel implique la création et la destruction du DOM.

3. **Clarté de la structure** : Le rendu conditionnel est particulièrement adapté au basculement de contenu avec des structures différentes, comme les onglets, les guides d'étapes, etc.