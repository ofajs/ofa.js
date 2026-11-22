# emit



En utilisant la méthode `emit`, vous pouvez déclencher activement des événements, et les événements déclenchés ont un mécanisme de propagation par bulles. Le mécanisme de propagation par bulles signifie que l'événement se propage des éléments internes vers les éléments externes, déclenchant les événements de manière hiérarchique de l'intérieur vers l'extérieur.

Voici un exemple montrant comment utiliser la méthode `emit` pour déclencher un événement personnalisé et utiliser le mécanisme de propagation pour transmettre l'événement aux éléments externes :

<o-playground name="emit - Déclencher un événement" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$('ul').on('custom-event',()=>{
          count++;
          \$("#logger1").text = 'ul is triggered ' + count;
        });
        \$('#target').on('custom-event',()=>{
          count++;
          \$("#logger2").text = 'target is triggered ' + count;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous avons enregistré le même gestionnaire d’événement personnalisé `custom-event` pour l’élément `<ul>` et l’élément `<li>`. Lorsque nous déclenchons l’événement avec la méthode `emit`, celui-ci remonte de l’élément `<li>` à l’élément `<ul>`, déclenchant ainsi les deux gestionnaires d’événement.

## Données personnalisées

En passant le paramètre `data`, vous pouvez transmettre des données personnalisées au gestionnaire d'événements :

<o-playground name="emit - données personnalisées" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          Je suis la cible
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',(event)=>{
          \$("#logger1").text = 'ul est déclenché;  =>  ' + event.data;
        });
        \$('#target').on('custom-event',(event)=>{
          \$("#logger2").text = 'la cible est déclenchée;  =>  ' + event.data;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{ 
            data:"Je suis les données"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous passons des données personnalisées au gestionnaire d'événements via le paramètre `data`. Le gestionnaire d'événements peut récupérer les données transmises via `event.data`.

## Déclencher un événement sans bouillonnement

Si vous ne souhaitez pas que l'événement se propage, vous pouvez ajouter le paramètre `bubbles: false` lors du déclenchement de l'événement :

<o-playground name="emit - pas de remontée" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',()=>{
          \$("#logger1").text = 'ul is triggered';
        });
        \$('#target').on('custom-event',()=>{
          \$("#logger2").text = 'target is triggered';
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            bubbles: false
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous déclenchons un événement personnalisé avec le paramètre `bubbles: false`. Cet événement ne remonte pas aux éléments parents, seul le gestionnaire d’événements de l’élément `<li>` est donc déclenché.

## Percer le nœud racine

Par défaut, les événements ne traversent pas le Shadow DOM des composants personnalisés. Mais vous pouvez définir `composed: true` pour permettre aux événements personnalisés de traverser le nœud racine et de déclencher des éléments en dehors du nœud racine.

<o-playground name="emit - pénétrer le nœud racine" style="--editor-height: 560px">
  <code path="demo.html" preview>
    <template>
      <div id="outer-logger"></div>
      <l-m src="./composed-test.html"></l-m>
      <composed-test></composed-test>
    </template>
  </code>
  <code path="composed-test.html" active>
    <template component>
      <style>
        :host{
          display:block;
          border:red solid 1px;
        }
      </style>
      <div id="logger">{{loggerText}}</div>
      <div id="target"></div>
      <script>
        export default {
          tag: "composed-test",
          data:{
            loggerText: ""
          },
          ready(){
            this.on("custom-event",(event)=>{
              this.loggerText = 'custom event is triggered;  =>  ' + event.data;
            });
            setTimeout(()=>{
              this.shadow.$("#target").emit("custom-event",{
                composed: true,
                data:"I am composed event"
              });
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous créons un composant personnalisé `composed-test`, qui contient un élément dans le shadow DOM et un bouton déclenchant un événement. Par défaut, l’événement ne traverse pas le shadow DOM vers le nœud racine. Cependant, en utilisant le paramètre `composed: true` lors du déclenchement de l’événement, nous permettons à celui-ci de traverser jusqu’au nœud racine et de déclencher un élément extérieur au nœud racine.