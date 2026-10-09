# Liaison de propriété

ofa.js permet de lier des données aux propriétés des objets après l'instanciation des éléments, telles que les attributs value ou checked d'un élément input, etc.

## Liaison de propriété unidirectionnelle

La liaison de propriété unidirectionnelle utilise la syntaxe `:toKey="fromKey"` pour synchroniser les données du composant de manière « unidirectionnelle » vers les attributs de l'élément DOM. Lorsque les données du composant changent, l'attribut de l'élément est mis à jour immédiatement ; mais les modifications de l'élément lui-même (comme la saisie de l'utilisateur) ne sont pas répercutées en sens inverse vers le composant, maintenant ainsi le flux de données unique et contrôlable.

<o-playground name="Liaison de propriété unidirectionnelle" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Valeur actuelle: {{val}}</p>
      <input type="text" :value="val" placeholder="Ceci est une zone de saisie à liaison unidirectionnelle">
      <p>Remarque : modifier le contenu directement dans la zone de saisie ne changera pas la valeur affichée ci-dessus.</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Liaison bidirectionnel des propriétés

La liaison de propriété bidirectionnelle utilise la syntaxe `sync:xxx`, réalisant une synchronisation bidirectionnelle entre les données du composant et les éléments DOM. Lorsque les données du composant changent, les attributs des éléments DOM sont mis à jour ; lorsque les attributs des éléments DOM changent (par exemple, lors de la saisie de l'utilisateur), les données du composant sont également mises à jour en synchronisation.

<o-playground name="Liaison bidirectionnelle des propriétés" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Valeur actuelle : {{val}}</p>
      <input type="text" sync:value="val" placeholder="Ceci est une zone de saisie à liaison bidirectionnelle">
      <p>Astuce : modifier le contenu dans la zone de saisie mettra à jour en temps réel la valeur affichée ci-dessus</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Caractéristiques de la liaison bidirectionnelle

- Flux de données : composant ↔ élément DOM (bidirectionnel)
- Changement des données du composant → mise à jour de l'élément DOM
- Changement de l'élément DOM → mise à jour des données du composant
- Convient aux scénarios nécessitant une saisie utilisateur et une synchronisation des données

### Liaison bidirectionnelle de l'objet

Pour la liaison de données de type objet, **il n'est pas nécessaire d'utiliser la syntaxe `sync`**, il suffit d'utiliser `:` pour une transmission unidirectionnelle. Cela est dû au fait que les objets en JavaScript sont partagés par référence : lorsque le composant parent transmet un objet au composant enfant, ce dernier obtient une référence au même objet, et toute modification de l'objet se reflète directement sur les données d'origine.

ofa.js conserve cette caractéristique de JavaScript, de sorte que la transmission unidirectionnelle d'un objet équivaut en réalité à une transmission bidirectionnelle. Par exemple :

```html
<template page>
  <child-comp :userData="userInfo"></child-comp>
  <script>
    export default async () => {
      return {
        data: { userInfo: { name: "Jean", age: 25 } }
      };
    };
  </script>
</template>
```

Dans le composant `child-comp`, si vous modifiez directement `userData.name`, le `userInfo.name` dans le composant parent sera également mis à jour, car ils pointent vers la même référence d'objet.

### Scènes courantes de liaison bidirectionnelle

<o-playground name="Exemple de liaison bidirectionnelle de formulaire" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin: 10px 0;
        }
        input, textarea, select {
          padding: 8px;
          margin: 5px 0;
          box-sizing: border-box;
        }
        .preview {
          margin-top: 15px;
          padding: 10px;
          background-color: #7b7b7bff;
          border-radius: 4px;
        }
      </style>
      <h3>Exemple de liaison bidirectionnelle de formulaire</h3>
      <div class="form-group">
        <label>Champ de texte :</label>
        <input type="text" sync:value="textInput" placeholder="Saisir du texte">
      </div>
      <div class="form-group">
        <label>Champ numérique :</label>
        <input type="number" sync:value="numberInput" placeholder="Saisir un nombre">
      </div>
      <div class="form-group">
        <label>Texte multilignes :</label>
        <textarea sync:value="textareaInput" rows="3" placeholder="Saisir du texte multilignes"></textarea>
      </div>
      <div class="form-group">
        <label>Liste déroulante :</label>
        <select sync:value="selectedOption">
          <option value="">Veuillez choisir...</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <div class="form-group">
        <label>Case à cocher :</label>
        <label style="display:flex;">
          <input type="checkbox" sync:checked="isChecked" /> J'accepte les conditions
        </label>
      </div>
      <div class="preview">
        <h4>Aperçu en temps réel :</h4>
        <p>Texte : {{textInput}}</p>
        <p>Nombre : {{numberInput}}</p>
        <p>Texte multilignes : {{textareaInput}}</p>
        <p>Sélection : {{selectedOption}}</p>
        <p>État de la case à cocher : {{isChecked ? 'coché' : 'non coché'}}</p>
      </div>
      <script>
        export default async () => {
          return {
            data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Points d'attention

1. **Considérations de performance** : la liaison bidirectionnelle crée des écouteurs de données ; un usage massif peut impacter les performances  
2. **Cohérence des données** : la liaison bidirectionnelle garantit la cohérence entre données et vue, mais il faut éviter les mises à jour en boucle infinie  
3. **Valeur initiale** : assurez-vous que les données liées possèdent une valeur initiale appropriée pour éviter l’affichage de undefined  
4. **Conflits d’événements** : évitez d’utiliser simultanément la liaison bidirectionnelle et la gestion manuelle d’événements sur le même élément afin de prévenir tout conflit