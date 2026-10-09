# Requête de style

`match-var` est un composant fonctionnel d'ofa.js utilisé pour la correspondance de styles en fonction des variables CSS. Grâce à `match-var`, il est possible de faire correspondre et d'appliquer dynamiquement différents styles en fonction des valeurs des variables CSS du composant actuel. Cette fonctionnalité est spécialement conçue pour le transfert d'état contextuel lié au style, sans nécessiter l'utilisation de JavaScript, ce qui la rend plus pratique à utiliser, notamment pour le transfert de styles comme les couleurs de thème.

## Concepts clés

- **match-var**: Composant de correspondance de styles, décide si les styles internes doivent être appliqués en fonction de la valeur d'une variable CSS
- **Correspondance d'attributs**: Définit les variables CSS et les valeurs attendues via les attributs du composant
- **Application des styles**: En cas de correspondance réussie, les styles de la balise `<style>` interne sont appliqués au composant

## Utilisation de base

Le composant `match-var` définit les variables CSS à matcher et la valeur attendue via des attributs. Lorsque la valeur de la variable CSS du composant correspond à la valeur spécifiée dans l’attribut, le style défini en son sein est appliqué.

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

### Propriétés

Le composant `match-var` utilise des attributs arbitraires pour définir les règles de correspondance des variables CSS. Le nom de l'attribut correspond au nom de la variable CSS (sans le préfixe `--`), et la valeur de l'attribut est la valeur attendue pour la correspondance.

### Principe de fonctionnement

1. **Prise en charge des navigateurs** : si le navigateur prend en charge la requête `@container style()`, il utilise directement les capacités CSS natives.
2. **Traitement de dégradation** : si ce n'est pas pris en charge, la détection des changements de valeurs des variables CSS se fait par interrogation périodique, et les styles sont injectés dynamiquement après correspondance.
3. **Actualisation manuelle** : il est possible de déclencher manuellement la détection de style via la méthode `$.checkMatch()`.

## Exemple de base

<o-playground name="Exemple de base" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
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
      <button on:click="changeTheme">Changer de thème</button> - Theme:{{currentTheme}}
      <div class="container">
        <theme-box>
          Afficher différents styles selon la variable CSS
        </theme-box>
      </div>
        <theme-box style="--theme: light;">
          Afficher le thème clair
        </theme-box>
        <theme-box style="--theme: dark;">
          Afficher le thème sombre
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
  </code>
  <code path="theme-box.html" active>
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
  </code>
</o-playground>

## Correspondance à conditions multiples

On peut utiliser plusieurs attributs simultanément pour définir des conditions de correspondance plus complexes ; le style ne sera appliqué que si toutes les variables CSS correspondent.

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

## Exemple de correspondance multi-condition

<o-playground name="Exemple de correspondance d'attributs" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
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
      <div>Thème : {{theme}} <button on:click="changeTheme">Changer le thème</button></div>
      <div>Taille : {{size}} <button on:click="changeSize">Changer la taille</button></div>
      <div class="content">
        <test-card>
          <div>Exemple de correspondance de style multi-conditions</div>
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
  </code>
  <code path="test-card.html" active>
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
  </code>
</o-playground>

## checkMatch actualisation manuelle

Dans certains cas, les changements de variables CSS peuvent ne pas être détectés automatiquement, et il est alors possible d'appeler manuellement la méthode `$.checkMatch()` pour déclencher la détection de style.

> Actuellement, Firefox ne supporte pas encore la requête `@container style()`, donc il faut appeler manuellement `$.checkMatch()` ; lorsque le navigateur prendra en charge nativement cette fonctionnalité à l'avenir, le système détectera automatiquement les changements de variables, sans avoir besoin de déclenchement manuel.

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // Déclencher manuellement la détection de style.
    $.checkMatch();
  }
}
```

## Meilleures pratiques

1. **Privilégier les capacités natives du CSS** : `match-var` utilisera en priorité la requête native `@container style()` du navigateur, offrant de meilleures performances dans les navigateurs modernes  
2. **Organiser les styles de manière cohérente** : regrouper les styles de correspondance associés facilite la maintenance et la compréhension  
3. **Utiliser la liaison data()** : combiner avec la directive `data()` permet de basculer les styles de façon réactive