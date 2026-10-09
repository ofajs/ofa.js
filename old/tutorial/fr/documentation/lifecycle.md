# Cycle de vie

Les composants ofa.js disposent de fonctions de hook de cycle de vie complètes, vous permettant d’exécuter une logique spécifique à différentes étapes du composant. Ces fonctions de hook vous permettent d’intervenir aux moments clés tels que la création, le montage, la mise à jour et la destruction du composant, et d’y effectuer les opérations correspondantes.

## Fonctions de crochet du cycle de vie

ofa.js fournit les principales fonctions de cycle de vie suivantes, classées par ordre d'utilisation courante :

### attached



`attached` hook est appelé lorsque le composant est inséré dans le document, indiquant que le composant a été monté dans la page. C'est le hook de cycle de vie le plus couramment utilisé, généralement pour effectuer des opérations d'initialisation qui nécessitent que le composant soit réellement affiché sur la page, afin d'éviter des calculs inutiles lorsque le composant n'est pas visible. Ce hook est également très adapté aux opérations qui dépendent du rendu du composant sur la page, comme la mesure de la taille des éléments, le démarrage d'animations, etc.

- **Moment d'appel** : Le composant est ajouté à l'arbre DOM
- **Utilisation principale** : Démarrer un minuteur, ajouter des écouteurs d'événements, exécuter des opérations nécessitant une visibilité

### detached



Le hook `detached` est appelé lorsque le composant est retiré du document, indiquant qu’il est sur le point d’être démonté. Ce hook convient pour nettoyer les ressources, comme supprimer les minuteries ou retirer les écouteurs d’événements.

- **Moment d'appel** : le composant est retiré de l'arbre DOM
- **Utilisation principale** : nettoyage des ressources, désabonnement, suppression des écouteurs d'événements

### ready



`ready` hook est appelé lorsque le composant est prêt, c'est-à-dire que son template a été rendu, les éléments DOM ont été créés, mais ils peuvent ne pas encore être insérés dans le document. Ce hook est adapté pour effectuer des manipulations DOM ou initialiser des bibliothèques tierces.

- **Moment d'appel**: le rendu du modèle de composant est terminé，DOM a été créé
- **Usage principal**: exécuter les opérations d'initialisation dépendant du DOM

### loaded



`loaded` hook se déclenche après que le composant, tous ses sous-composants et les ressources asynchrones soient entièrement chargés. À ce moment, il est possible de supprimer en toute sécurité l'état de chargement ou d'exécuter des opérations ultérieures dépendant de l'arbre complet des composants. S'il n'y a pas de dépendance, il est appelé après le hook `ready`.

- **Moment d'appel** : Le composant et ses sous-composants sont complètement chargés
- **Utilisation principale** : Exécuter des opérations dépendant de l'arborescence complète des composants

## Ordre d'exécution du cycle de vie

Les hooks du cycle de vie du composant s'exécutent dans l'ordre suivant :

2. `ready` - le composant est prêt (le DOM est créé)
3. `attached` - le composant est monté dans le DOM
4. `loaded` - le chargement du composant est totalement terminé

Lorsque le composant est retiré du DOM, le hook `detached` est appelé.

## Exemple d'utilisation

L'exemple suivant montre comment utiliser les fonctions de hook du cycle de vie dans un composant :

<o-playground name="Exemple de cycle de vie" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .counter {
          margin: 10px 0;
        }
        button {
          margin-right: 10px;
          padding: 5px 10px;
        }
      </style>
      <h3>Démonstration du cycle de vie</h3>
      <div class="counter">Compteur: {{count}}</div>
      <button on:click="count += 10">Augmenter de 10</button>
      <button on:click="removeSelf">Supprimer le composant</button>
      <div class="log">
        <h4>Journal du cycle de vie :</h4>
        <ul>
          <o-fill :value="logs">
            <li>{{$data}}</li>
          </o-fill>
        </ul>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              logs: [],
            },
            proto: {
              removeSelf() {
                this.remove(); // Supprime du DOM pour déclencher le crochet detached
              },
              addLog(message) {
                this.logs = [...this.logs, `${new Date().toLocaleTimeString()} - ${message}`];
              }
            },
            ready() {
              this.addLog("ready : le composant est prêt, le DOM a été créé");
              console.log("Composant prêt");
            },
            attached() {
              this.addLog("attached : le composant a été attaché au DOM");
              this._timer = setInterval(() => {
                this.count++;
              }, 1000);
              console.log("Composant attaché");
            },
            detached() {
              this.addLog("detached : le composant a été retiré du DOM");
              // Nettoie le minuteur pour éviter les fuites de mémoire
              clearInterval(this._timer); 
              console.log("Composant détaché");
            },
            loaded() {
              this.addLog("loaded : le composant est complètement chargé");
              console.log("Composant entièrement chargé");
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, vous pouvez observer l'ordre d'exécution et le timing des différents hooks de cycle de vie. Lorsque vous cliquez sur le bouton "Supprimer le composant", vous pouvez voir que le hook `detached` est déclenché.

## Scénarios d'application réels

### Opération d'initialisation

Initialiser les données dans le hook `ready` :

```javascript
export default async () => {
  return {
    data: {
      items: []
    },
    ready() {
      // Opérations DOM
      this.initDomElements();
    }
  };
};
```

### Gestion des ressources

Démarrez la minuterie dans le hook `attached`, nettoyez les ressources dans le hook `detached` :

```javascript
export default async () => {
  return {
    data: {
      timer: null
    },
    attached() {
      // Démarrer le minuteur
      this.timer = setInterval(() => {
        console.log('Exécution de la tâche planifiée');
      }, 1000);
    },
    detached() {
      // Nettoyer le minuteur
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };
};
```

Les fonctions de hook de cycle de vie sont un concept important dans le développement de composants ofa.js. Les utiliser correctement peut vous aider à mieux gérer l'état des composants et les ressources, et à améliorer les performances de l'application.

