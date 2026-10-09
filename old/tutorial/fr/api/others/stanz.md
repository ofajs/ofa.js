# Caractéristiques des données d'exemple

Les objets d’instance obtenus ou créés via `$` possèdent l’intégralité des caractéristiques de données de stanz, car l’instance `$` hérite de stanz. Cela signifie que vous pouvez utiliser les méthodes et propriétés de manipulation de données fournies par `stanz` pour manipuler et écouter les données de l’objet instance.

> L'exemple suivant utilise des éléments standards, car les composants personnalisés ont généralement leurs propres données enregistrées, tandis que les éléments standards ne contiennent souvent que des informations de balisage, ce qui les rend plus adaptés à la démonstration.

## watch



Les instances peuvent surveiller les changements de valeur via la méthode `watch` ; même si la valeur d'un sous-objet d'un objet est modifiée, le changement peut être détecté dans la méthode `watch` de l'objet.

Voici un exemple qui montre comment utiliser l'instance `$` et la méthode `watch` :

<o-playground name="stanz - montre" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target.aaa = "Je suis aaa";
        }, 600);
        setTimeout(() => {
          target.bbb = {
            child: {
              val: "Je suis bbb enfant val",
            },
          };
        }, 1200);
        setTimeout(() => {
          target.bbb.child.val = "changer bbb enfant val";
        }, 1800);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous créons d'abord un objet d'instance `$` appelé `target`, puis utilisons la méthode `watch` pour surveiller ses changements. Même si nous modifions la valeur d'un sous-objet de l'objet, par exemple la valeur de `target.bbb.child.val`, la méthode `watch` peut détecter ces changements et mettre à jour le contenu de l'élément `logger`. Cela illustre la puissance de l'objet d'instance `$`, vous permettant de surveiller facilement les changements d'un objet.

## watchTick



`watchTick` et `watch` ont des fonctionnalités similaires, mais `watchTick` intègre une opération de throttling en interne, qui s'exécute une seule fois dans un seul thread. Ainsi, dans certains scénarios nécessitant des performances élevées, il permet de surveiller plus efficacement les changements de données.

Voici un exemple montrant comment utiliser la méthode `watchTick` de l’instance `$` :

<o-playground name="stanz - watchTick" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        let count1 = 0;
        target.watch(() => {
          count1++;
          \$("#logger1").text = 'Nombre d\'exécutions de watch : ' + count1;
        });
        let count2 = 0;
        target.watchTick(()=>{
          count2++;
          \$("#logger2").text = 'Nombre d\'exécutions de watchTick : ' + count2;
        });
        setTimeout(() => {
          target.aaa = "Je suis aaa";
          target.bbb = "Je suis bbb";
          target.ccc = "Je suis ccc";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous créons d’abord une instance `$` nommée `target`. Ensuite, nous utilisons les méthodes `watch` et `watchTick` pour écouter les changements de l’objet. La méthode `watch` s’exécute immédiatement lors d’une modification des données, tandis que la méthode `watchTick` ne s’exécute qu’une seule fois dans un thread donné, limitant ainsi la fréquence de l’écoute. Vous pouvez choisir d’utiliser `watch` ou `watchTick` selon vos besoins pour surveiller les changements de données.

## unwatch



`unwatch` La méthode est utilisée pour annuler la surveillance des données, elle peut révoquer les surveillances précédemment enregistrées via `watch` ou `watchTick`.

Voici un exemple montrant comment utiliser la méthode `unwatch` de l'instance `$` :

<o-playground name="stanz - unwatch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        const tid1 = target.watch(() => {
          \$("#logger1").text = JSON.stringify(target);
        });
        const tid2 = target.watchTick(()=>{
          \$("#logger2").text = JSON.stringify(target);
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.unwatch(tid1);
          target.unwatch(tid2);
        }, 500);
        setTimeout(() => {
          target.bbb = "I am aaa";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous créons d'abord un objet instance `$` nommé `target`, puis nous enregistrons deux écouteurs à l'aide des méthodes `watch` et `watchTick` respectivement. Ensuite, nous utilisons la méthode `unwatch` en passant les valeurs de retour des écouteurs précédemment sauvegardées `tid1` et `tid2` pour annuler ces deux écouteurs. Cela signifie que la modification de propriété dans le premier `setTimeout` ne déclenchera aucun écouteur, car les écouteurs ont été annulés.

## Valeurs non surveillées

Dans l'instance `$`, l'utilisation de noms de propriétés commençant par un trait de soulignement `_` indique que ces valeurs ne seront pas surveillées par les méthodes `watch` ou `watchTick`. Cela est très utile pour certaines propriétés temporaires ou privées, vous pouvez les modifier librement sans déclencher la surveillance.

Dans le modèle, ceci est appelé [données non réactives](../../documentation/state-management.md).

Voici un exemple montrant comment utiliser les valeurs d'attribut commençant par un tiret bas pour éviter d'être écouté :

<o-playground name="stanz - données non réactives" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target._aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target._aaa = "change aaa";
        }, 1200);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous créons une instance `$` appelée `target`, puis nous utilisons la méthode `watch` pour écouter les changements de valeur des propriétés. Dans `setTimeout`, nous tentons de modifier la valeur de la propriété `_aaa`, mais ce changement ne déclenche pas l’écoute. Cela est très utile lorsqu’il est nécessaire de mettre à jour une valeur de propriété sans déclencher l’écoute.

## Caractéristiques de base

Les données d'objet définies sur l'instance seront converties en instance Stanz, cette instance Stanz permettant l'écoute.

```javascript
const obj = {
  val: "I am obj"
};

$("#target").obj = obj;
console.log($("#target").obj.val === obj.val);
console.log($("#target").obj === obj);
```

Nous pouvons également utiliser `$.stanz` pour créer des données Stanz qui ne sont pas liées à une instance.

```javascript
const data = $.stanz({
  val: "I am val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "change val";
```

Ces exemples illustrent les caractéristiques de base de la configuration des données d'objet en tant qu'instances Stanz pour l'écoute.

Veuillez consulter [stanz](https://github.com/ofajs/stanz) pour plus de fonctionnalités complètes.