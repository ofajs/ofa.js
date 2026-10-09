# extend



`extend` est une méthode d'ordre supérieur servant à étendre les propriétés ou les méthodes d'une instance.

> En règle générale, il n'est pas recommandé aux utilisateurs d'étendre les propriétés ou méthodes des instances, car cela augmente le coût d'apprentissage. Sauf si l'équipe a besoin de personnaliser le comportement des instances dans un scénario particulier, il n'est pas recommandé de le faire.

<o-playground name="extend - exemple d'extension" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        const target = $("#target");
        target.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          const target = $("#target");
          \$("#logger").html = `
          good : ${target.good} <br>
          say() : ${target.say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Étendre le $ sous-jacent

Similaire à jQuery, vous pouvez également étendre les propriétés ou méthodes de l'instance sous-jacente via fn.extend ; les propriétés ou méthodes étendues à partir de fn s'appliquent à toutes les instances.

<o-playground name="extend - étendre la couche inférieure" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        \$.fn.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          \$("#logger").html = `
          target good : ${$("#target").good} <br>
          logger say() : ${$("#logger").say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Syntaxe de modèle étendue

En étendant les attributs ou fonctions via `extend`, on peut enrichir la syntaxe des modèles, voire offrir à un composant sa propre « syntaxe sucrée ». Il faut toutefois veiller à **ne pas utiliser** de syntaxes non officielles : elles imposent un coût d’apprentissage et, en grand nombre, dégradent l’expérience de développement.

### Attributs étendus

Vous pouvez utiliser les attributs d’extension et les définir dans le modèle avec `:`. Ci-dessous, nous étendons l’attribut `red` : lorsque `red` vaut `true`, la couleur de la police devient rouge :

```javascript
$.fn.extend({
  set red(bool){
    if(bool){
      this.css.color = "rouge";
    }else{
      this.css.color = '';
    }
  }
});
```

<o-playground name="extend - propriétés étendues" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-one.html"></l-m>
      <temp-one></temp-one>
      <script>
        \$.fn.extend({
          set red(bool){
            if(bool){
              this.css.color = "red";
            }else{
              this.css.color = '';
            }
          }
        });
      </script>
    </template>
  </code>
  <code path="temp-one.html">
    <template component>
      <button on:click="addCount">Add Count</button>
      <div :red="count % 3">{{count}}</div>
      <script>
        export default {
          tag: "temp-one",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous avons ajouté un attribut `red` à la syntaxe du modèle. Lorsque `count % 3` n'est pas égal à 0, la couleur de la police devient rouge.

### Méthodes d'extension

Vous pouvez également utiliser la méthode d'extension `extend` pour la rendre disponible dans la syntaxe des modèles. Le nom de la méthode est la partie précédant les deux-points. Ici, nous avons étendu une syntaxe de modèle `color`, et les paramètres qui suivent seront passés à la méthode d'extension définie.

Ici, l'attribut `always` est défini sur `true`, ce qui signifie que cette méthode définie sera appelée à chaque fois que le composant a besoin de rafraîchir l'interface. Si `always` n'est pas défini, cette fonction de syntaxe de template ne s'exécutera qu'une seule fois.

Parmi ceux-ci, `options` fournit plus de paramètres, ce qui peut vous aider à développer une syntaxe de modèle plus personnalisée :

```javascript
$.fn.extend({
  color(value, func, options){
    const bool = func();
    if(bool){
      this.css.color = value;
    }else{
      this.css.color = '';
    }
  }
});

$.fn.color.always = true;
```

<o-playground name="extend - méthode d'extension" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-two.html"></l-m>
      <temp-two></temp-two>
      <script>
        \$.fn.extend({
          color(color, func, options){
            const bool = func();
            if(bool){
              this.css.color = color;
            }else{
              this.css.color = '';
            }
          }
        });
        \$.fn.color.always = true;
      </script>
    </template>
  </code>
  <code path="temp-two.html">
    <template component>
      <button on:click="addCount" color:blue="count % 3">Add Count</button>
      <div color:red="!(count % 3)">{{count}}</div>
      <script>
        export default {
          tag: "temp-two",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

## Principe de la syntaxe des templates

Jusqu’à présent, vous devriez déjà comprendre que de nombreuses syntaxes de modèle sur ofa.js sont en réalité étendues via `extend` :

- Les méthodes `class`, `attr` s'exécutent à chaque rafraîchissement de la vue
- Les fonctions de liaison comme `on`, `one` ne s'exécutent qu'une seule fois

Vous pouvez consulter l’exemple ci-dessous pour mieux comprendre le principe de rendu des modèles d’ofa.js :

<o-playground name="extend - Principe de la syntaxe des templates" style="--editor-height: 480px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./temp-three.html"></l-m>
      <temp-three></temp-three>
    </template>
  </code>
  <code path="temp-three.html" active>
    <template component>
      <div>classe toujours => {{classalways}}</div>
      <div>attribut toujours => {{attralways}}</div>
      <div>on toujours => {{onalways}}</div>
      <script>
        export default {
          tag: "temp-three",
          data: {
            classalways:"",
            attralways:"",
            onalways:""
          },
          ready(){
            this.classalways = $.fn.class.always;
            this.attralways = $.fn.attr.always;
            this.onalways = !!$.fn.on.always;
          }
        };
      </script>
    </template>
  </code>
</o-playground>

