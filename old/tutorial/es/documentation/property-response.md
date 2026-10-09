# Respuesta de atributos

En el [enlace de propiedades](./property-binding.md) anterior, presentamos el mecanismo simple de respuesta de propiedades, es decir, cómo renderizar los valores de propiedades de un componente en la visualización de texto.

ofa.js no solo admite la reactividad de valores de propiedades básicas, sino también la renderización reactiva de valores de propiedades dentro de objetos anidados en múltiples niveles.

<o-playground name="Ejemplo de datos no reactivos" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{obj.count2}}</p>
      <button on:click="handleAddCount">Aumentar</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              obj: {
                count2: 100,
              },
            },
            proto:{
              handleAddCount(){
                this.count++;
                this.obj.count2++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Todos los datos vinculados al objeto de instancia de ofa.js se convertirán automáticamente en datos reactivos. Los datos reactivos solo admiten tipos de datos básicos como cadenas, números, booleanos, arreglos y objetos. Para tipos de datos complejos como funciones e instancias de clase, deben almacenarse como **propiedades no reactivas**, cuyos cambios no activarán el re-renderizado del componente.

## Datos no reactivos

A veces necesitamos almacenar datos que no requieren actualizaciones reactivas, como instancias de Promise, objetos de expresión regular u otros objetos complejos. En estos casos, es necesario utilizar propiedades no reactivas. Los cambios en estas propiedades no desencadenan un nuevo renderizado del componente, y son adecuados para almacenar datos que no necesitan estar sincronizados con la vista.

Los nombres de las propiedades no reactivas generalmente se prefijan con un guion bajo `_` antes del nombre de la propiedad, para distinguirlas de las propiedades reactivas.

<o-playground name="Ejemplo de datos no reactivos" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{_count2}}</p>
      <button on:click="count++">Blue increases</button>
      <button on:click="_count2++">Green increments</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              _count2: 100,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Al hacer clic en el botón `Incrementos verdes`, aunque el valor de `_count2` ya ha aumentado, al ser una propiedad no reactiva, no desencadena una actualización de la vista, por lo que la visualización en la interfaz no cambia. Al hacer clic en el botón `Aumentos azules`, dado que `count` es una propiedad reactiva, desencadena un nuevo renderizado de todo el componente, momento en el que se actualiza sincrónicamente el contenido de la visualización verde.

Los datos de objetos no reactivos tienen un mejor rendimiento que los datos de objetos reactivos, porque los datos no reactivos no desencadenan el re-renderizado de los componentes.


