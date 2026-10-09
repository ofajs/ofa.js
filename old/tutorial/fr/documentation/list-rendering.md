# Rendu de liste

Dans ofa.js, le composant `o-fill` offre de puissantes fonctionnalités de rendu de liste, permettant de rendre efficacement les données d'un tableau en plusieurs éléments similaires. Il prend en charge deux modes d'utilisation principaux : le rendu direct et le rendu par modèle.

## Présentation du composant o-fill

`o-fill` est le composant central d'ofa.js pour le rendu des listes ; il reçoit une propriété `value` de type tableau et génère, pour chaque élément de ce tableau, l’élément DOM correspondant. Lors du rendu, ofa.js suit automatiquement les modifications du tableau et met à jour le DOM de manière efficace.

### Caractéristiques principales :

- **Mise à jour efficace** : suit les modifications du tableau via une clé et ne met à jour que les parties modifiées
- **Accès à l'index** : utilise `$index` pour accéder à l'index de l'élément courant
- **Accès aux données** : utilise `$data` pour accéder aux données de l'élément courant
- **Accès à l'hôte** : utilise `$host` pour accéder à l'instance du composant courant, permettant d'appeler des méthodes ou d'accéder aux données du composant
- **Accès au parent** : dans un `o-fill` imbriqué, utilise `$parent` pour accéder aux données de l'élément parent
- **Réutilisation de template** : prend en charge les templates nommés pour le rendu de listes complexes

## Rendu direct

Le rendu direct est la méthode d'utilisation la plus simple : le contenu du modèle est écrit directement à l'intérieur de la balise `o-fill`. Lorsque le tableau change, `o-fill` crée automatiquement un élément correspondant pour chaque donnée.

<o-playground name="o-fill - Rendu direct" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px; margin: 5px 0; background: #7e7e7e; border-radius: 4px; }
      </style>
      <h3>Liste des fruits</h3>
      <button on:click="addItem">Ajouter un fruit</button>
      <button on:click="removeItem">Supprimer le dernier</button>
      <ul>
        <o-fill :value="fruits">
          <li> {{$index + 1}}. {{$data.name}} - Prix: ¥{{$data.price}} <button on:click="$host.removeItem($index)">Supprimer</button></li>
        </o-fill>
      </ul>
      <script>
        export default async () => ({
          data: { 
            fruits: [
              { name: "🍎 Pomme", price: 5 },
              { name: "🍊 Orange", price: 6 },
              { name: "🍌 Banane", price: 3 }
            ],
            fruitIndex: 0,
          },
          proto: {
            addItem() {
              const fruitNames = ["🍇 Raisin", "🍓 Fraise", "🥝 Kiwi", "🍑 Pêche", "🥭 Mangue"];
              const name = fruitNames[this.fruitIndex % fruitNames.length];
              this.fruits.push({ 
                name: name, 
                price: Math.floor(Math.random() * 10) + 1 
              });
              this.fruitIndex++;
            },
            removeItem(index) {
              if (index >= 0 && index < this.fruits.length) {
                this.fruits.splice(index, 1);
                return;
              }
              this.fruits.length && this.fruits.pop();
            }
          }
        });
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous pouvons voir :- `$index` représente l'indice de l'élément actuel (commence à 0)
- `$data` représente l'objet de données de l'élément actuel
- `$host` représente l'instance du composant actuel, peut être utilisé pour appeler des méthodes du composant ou accéder aux données du composant
- Lorsque le tableau change, la liste se met automatiquement à jour

## Rendu de modèle

Pour les structures d'éléments de liste plus complexes, vous pouvez utiliser la méthode des modèles nommés. Définissez le modèle dans la balise `template`, puis référencez-le dans `o-fill` via l'attribut `name`.

<o-playground name="o-fill - rendu de modèle" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        .product-card { border: 1px solid #747474; border-radius: 8px; padding: 12px; margin: 10px 0; }
        .product-name { font-weight: bold; font-size: 1.1em; }
        .product-price { color: #832c22; font-weight: bold; }
        .product-desc { color: #929292; font-size: 0.9em; margin-top: 5px; }
      </style>
      <h3>Liste des produits</h3>
      <button on:click="addProduct">Ajouter un produit</button>
      <div class="products-container">
        <o-fill :value="products" name="product-template"></o-fill>
      </div>
      <template name="product-template">
        <div class="product-card">
          <div class="product-name">{{$data.name}}</div>
          <div class="product-price">¥{{$data.price}}</div>
          <div class="product-desc">{{$data.description}}</div>
          <small>Index : {{$index + 1}}</small>
        </div>
      </template>
      <script>
        export default async () => ({
          data: {
            products: [
              { name: "MacBook Pro", price: 12999, description: "Ordinateur portable haute performance, adapté au travail professionnel" },
              { name: "iPhone 15", price: 5999, description: "Dernier smartphone, excellent rendu photo" },
              { name: "AirPods Pro", price: 1999, description: "Écouteurs sans fil à réduction de bruit, excellente qualité sonore" }
            ],
            productIndex: 0,
          },
          proto: {
            addProduct() {
              const productNames = ["iPad Air", "Apple Watch", "Magic Mouse", "Pro Display"];
              const productDescs = ["Tablette légère et portable", "Montre intelligente, suivi de la santé", "Souris conçue selon l'ergonomie", "Moniteur professionnel"];
              const name = productNames[this.productIndex % productNames.length];
              const desc = productDescs[this.productIndex % productDescs.length];
              this.products.push({
                name: name,
                price: Math.floor(Math.random() * 5000) + 1000,
                description: desc
              });
              this.productIndex++;
            }
          }
        });
      </script>
    </template>
  </code>
</o-playground>

## Rendu de liste imbriquée

`o-fill` prend en charge l'utilisation imbriquée et peut traiter des structures de données hiérarchiques complexes, telles que des menus arborescents, des listes de catégories, etc.

<o-playground name="o-fill - Rendu de liste imbriquée" style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .category {
          border-left: 3px solid #3498db;
          padding-left: 15px;
          margin: 10px 0;
        }
        .subcategory {
          border-left: 2px solid #9b59b6;
          padding-left: 15px;
          margin: 8px 0;
        }
        .item {
          padding: 5px 0;
          margin: 5px 0;
          color: #2c3e50;
        }
        h4 {
          margin: 10px 0 5px 0;
          color: #34495e;
        }
      </style>
      <h3>Navigation des catégories de produits</h3>
      <div class="navigation">
        <o-fill :value="categories" name="category-template"></o-fill>
      </div>
      <template name="category-template">
        <div class="category">
          <h4> {{$data.name}} </h4>
          <o-fill :value="$data.subcategories" name="subcategory-template"></o-fill>
        </div>
      </template>
      <template name="subcategory-template">
        <div class="subcategory">
          <strong>{{$data.name}}</strong>
          <o-fill :value="$data.items">
            <div class="item"> • {{$data}} </div>
          </o-fill>
        </div>
      </template>
      <script>
        export default async () => {
          return {
            data: {
              categories: [
                {
                  name: "Produits électroniques",
                  subcategories: [
                    {
                      name: "Téléphones",
                      items: ["iPhone", "Téléphones Android", "Téléphones basiques"]
                    },
                    {
                      name: "Ordinateurs",
                      items: ["Ordinateur portable", "Ordinateur de bureau", "Tablette"]
                    }
                  ]
                },
                {
                  name: "Articles pour la maison",
                  subcategories: [
                    {
                      name: "Ustensiles de cuisine",
                      items: ["Casseroles", "Vaisselle", "Petits électroménagers"]
                    },
                    {
                      name: "Literie",
                      items: ["Linge de lit", "Armoire", "Décoration"]
                    }
                  ]
                },
                {
                  name: "Vêtements et accessoires",
                  subcategories: [
                    {
                      name: "Vêtements pour hommes",
                      items: ["T-shirt", "Chemise", "Manteau"]
                    },
                    {
                      name: "Vêtements pour femmes",
                      items: ["Robe", "Pantalon", "Accessoires"]
                    }
                  ]
                }
              ]
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

L'exemple ci-dessus montre le rendu de liste imbriquée de base. Si vous devez accéder aux données de l'élément parent dans un `o-fill` imbriqué, vous pouvez utiliser `$parent`.

### Utiliser $parent pour accéder aux données du parent

> **Version requise** : La fonction `$parent` nécessite ofa.js v4.7.0 ou une version ultérieure.

Dans un `o-fill` imbriqué, vous pouvez utiliser `$parent` pour accéder aux données de l'élément parent. Pour activer `$parent`, ajoutez l'attribut `:_$parent="$data"` sur le `o-fill` imbriqué.

**Règles importantes :**- La première couche `o-fill` n'a pas besoin de `_$parent`, utilisez `$host` pour accéder aux données du composant
- Les `o-fill` imbriqués (à partir de la deuxième couche) utilisent `:_$parent="$data"` pour transmettre les données parentes
- `_$parent` n'accepte que `$data`, garantissant une clarté dans le flux des données

### Exemple d’utilisation de $parent

L'exemple ci-dessous montre comment utiliser `$parent` dans un `o-fill` imbriqué pour accéder aux données de l'élément parent :

<o-playground name="o-fill - $parent utilisation exemple" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 20px; }
        .category { background: #e3f2fd; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .item { background: #fff; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #2196f3; }
      </style>
      <h3>Liste des catégories</h3>
      <o-fill :value="categories">
        <div class="category">
          <h4>Catégorie: {{$data.name}}</h4>
          <o-fill :value="$data.items" :_$parent="$data">
            <div class="item">
              <div>Produit: {{$data}}</div>
              <div>Catégorie associée: {{$parent.name}}</div>
            </div>
          </o-fill>
        </div>
      </o-fill>
      <script>
        export default async () => {
          return {
            data: {
              categories: [
                {
                  name: "Fruits",
                  items: ["Pomme", "Banane", "Orange"]
                },
                {
                  name: "Légumes",
                  items: ["Tomate", "Concombre", "Aubergine"]
                }
              ]
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple simple :- **Premier niveau o-fill** : parcourir le tableau de catégories, `$data.name` est le nom de la catégorie
- **o-fill imbriqué** : utiliser `:_$parent="$data"` pour transmettre les données de la catégorie parente
- **Accès via $parent** : dans le niveau imbriqué, accéder au nom de la catégorie parente via `$parent.name`

## Optimisation des performances et gestion des clés-valeurs

Pour les listes nécessitant des mises à jour fréquentes, vous pouvez spécifier un identifiant unique via l'attribut `fill-key` afin d'améliorer les performances de rendu.

```html
<!-- Utiliser une clé personnalisée pour améliorer les performances -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

Dans l'exemple ci-dessus, `fill-key="id"` indique à ofa.js d'utiliser la propriété `id` de chaque élément de données comme identifiant unique, de sorte que même si l'ordre du tableau change, il peut correctement identifier et mettre à jour les éléments correspondants.

## Meilleures pratiques de rendu de liste

1. **Gestion des événements** : lors de l'utilisation d'événements dans un élément de liste, notez que `$host` fait référence à l'instance du composant actuel, et `$data` aux données de l'élément actuel.
2. **Choisir la méthode de rendu appropriée** : pour les listes simples, utilisez le rendu direct ; pour les structures complexes, utilisez le rendu par template.
3. **Considérations de performance** : pour les grandes listes ou les listes fréquemment mises à jour, utilisez `fill-key` pour spécifier la clé.
4. **Structure des données** : assurez-vous que chaque élément du tableau est un objet de données valide.
5. **Éviter les imbrications profondes** : bien que l'imbrication soit prise en charge, évitez les niveaux d'imbrication trop profonds.
6. **Utiliser correctement `$parent`** :
   - N'utilisez `$parent` que dans un `o-fill` imbriqué.
   - Vous devez utiliser `:_$parent="$data"` pour activer `$parent`.
   - Dans le premier niveau de `o-fill`, utilisez `$host` pour accéder aux données du composant, n'utilisez pas `$parent`.
   - `_$parent` n'accepte que `$data`, ne passez pas d'autres valeurs.

## Résumé de l'utilisation des variables

Dans `o-fill`, différentes variables ont des usages et des scénarios d'utilisation distincts :

| Variable | Utilisation | Scénario d'utilisation | Exemple |
|------|------|----------|------|
| `$host` | Accéder aux données et méthodes de l'instance du composant | Premier niveau `o-fill` | `{{$host.totalAmount}}` |
| `$data` | Données de l'élément courant d'itération | Tous les niveaux de `o-fill` | `{{$data.name}}` |
| `$index` | Index de l'élément courant | Tous les niveaux de `o-fill` | `{{$index + 1}}` |
| `$parent` | Données de l'élément parent | `o-fill` imbriqué (à partir du deuxième niveau) | `{{$parent.orderName}}` |### Exemple de couche d'accès aux données



```
Composant data (totalAmount, orders)
  │
  └─ Premier niveau o-fill: :value="orders"
      │  Utiliser $host pour accéder aux données du composant: {{$host.totalAmount}}
      │  Utiliser $data pour accéder à la commande actuelle: {{$data.orderName}}
      │
      └─ Deuxième niveau o-fill: :value="$data.items" :_$parent="$data"
          │  $parent pointe vers les données de commande du premier niveau
          │  $data est chaque élément de items
          │  Accessible: {{$parent.orderName}}, {{$data.name}}
```

En utilisant correctement ces variables, vous pouvez facilement gérer des scénarios complexes de rendu de listes imbriquées.