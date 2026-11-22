# formData



`formData` método se utiliza para generar datos de objeto vinculados a elementos de formulario, lo que facilita y agiliza el manejo de elementos de formulario. Este método genera un objeto que contiene los valores de todos los elementos de formulario dentro del elemento objetivo, y dicho objeto refleja en tiempo real los cambios en los elementos de formulario.

En el siguiente ejemplo, demostramos cómo utilizar el método `formData` para generar datos de objeto vinculados a elementos de formulario:

<o-playground name="formData - Uso básico" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" />
        <div>
          sexo:
          <label>
            hombre
            <input type="radio" name="sex" value="man" />
          </label>
          <label>
            mujer
            <input type="radio" name="sex" value="woman" />
          </label>
        </div>
        <textarea name="message">¡Hola Mundo!</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData();
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, creamos un formulario que contiene un campo de entrada de texto, botones de opción y un área de texto, y utilizamos el método `formData` para crear un objeto `data` que contiene los valores de estos elementos del formulario. También usamos el método `watch` para monitorear los cambios en los datos y mostrar los datos en tiempo real en la página. Cuando el usuario modifica los valores de los elementos del formulario, el objeto `data` se actualiza en consecuencia, lo que hace que el procesamiento de datos sea muy simple y eficiente.

## Enlace de datos inverso

Los datos del objeto generado también tienen la capacidad de vinculación inversa, lo que significa que cuando modificas las propiedades del objeto, los valores de los elementos del formulario relacionados también se actualizan automáticamente. Esto es muy útil al manejar datos de formularios, ya que puedes lograr fácilmente la vinculación bidireccional de datos.

En el siguiente ejemplo, demostramos cómo usar los datos de objeto generados por el método `formData`, así como cómo realizar la vinculación inversa de datos:

<o-playground name="formData - vinculación inversa" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" />
        <div>
          sexo:
          <label>
            man
            <input type="radio" name="sex" value="man" />
          </label>
          <label>
            woman
            <input type="radio" name="sex" value="woman" />
          </label>
        </div>
        <textarea name="message">Hello World!</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData();
        setTimeout(()=>{
          data.username = "Yao";
          data.sex = "man";
          data.message = "ofa.js is good!";
        },1000);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, primero creamos un formulario que contiene un campo de entrada de texto, botones de opción y un área de texto, y luego utilizamos el método `formData` para generar un objeto de datos `data`. Posteriormente, al modificar las propiedades del objeto `data`, logramos un enlace de datos inverso, es decir, que los valores de los elementos del formulario se actualizan automáticamente cuando cambian las propiedades del objeto. Esta función de enlace de datos bidireccional hace que la interacción con los datos del formulario sea más conveniente.

## Escuchar un formulario específico

Por defecto, el método `formData()` escucha todos los elementos `input`, `select` y `textarea` dentro del elemento objetivo. Pero si solo deseas escuchar elementos de formulario específicos, puedes lograrlo pasando un selector CSS.

En el siguiente ejemplo, demostramos cómo escuchar elementos de formulario específicos pasando un selector CSS:

<o-playground name="formData - formulario específico" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" class="use-it" />
        <div>
          sex:
          <label>
            man
            <input type="radio" name="sex" value="man" class="use-it" />
          </label>
          <label>
            woman
            <input type="radio" name="sex" value="woman" class="use-it" />
          </label>
        </div>
        <textarea name="message">Este elemento del formulario no está vinculado</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData(".use-it");
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, solo queremos escuchar los elementos del formulario que tienen `class` igual a "use-it", por lo que pasamos `".use-it"` como argumento al método `formData()`. De esta manera, solo los elementos del formulario con esa clase serán escuchados e incluidos en el objeto de datos generado. Esto es muy útil para escuchar selectivamente elementos del formulario y gestionar con mayor precisión los datos de tu formulario.

## Formulario personalizado

El uso de componentes de formulario personalizados es muy simple, solo necesita agregar un **atributo value** al componente personalizado y establecer la **característica name**.

<o-playground name="formData - formulario personalizado" style="--editor-height: 500px">
  <code path="demo.html" preview active>
    <template>
      <div id="myForm">
        <input type="text" name="username" value="John Doe" />
        <l-m src="./custom-input.html"></l-m>
        <custom-input name="message"></custom-input>
        <div id="logger"></div>
      </div>
      <script>
        const data = $("#myForm").formData("input,custom-input");
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
  <code path="custom-input.html">
    <template component>
      <style>
        :host{
          display: block;
        }
        .editor {
          display: inline-block;
          min-width: 200px;
          line-height: 30px;
          height: 30px;
          border: #aaa solid 1px;
          border-radius: 4px;
          padding: 4px;
          font-size: 14px;
        }
      </style>
      <div
        class="editor"
        contenteditable="plaintext-only"
        :text="value"
        on:input="changeText"
      ></div>
      <script>
        export default {
          tag:"custom-input",
          attrs: {
            name: "",
          },
          data: {
            value: "Default txt",
          },
          proto: {
            changeText(e) {
              this.value = $(e.target).text;
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

Cuando utilices componentes de formulario personalizados, solo necesitas agregarlos a tu formulario y establecer el atributo `name` requerido. En el ejemplo anterior, usamos un componente de formulario personalizado agregando el elemento `<custom-input>` y configurando el atributo `name`. Luego, utilizamos el método `formData()` para escuchar los valores de los elementos de entrada y los componentes personalizados, a fin de obtener y procesar los datos del formulario en tiempo real. Este método te permite ampliar fácilmente tu formulario para incluir componentes personalizados, satisfaciendo así tus necesidades específicas.

## Usar datos de formulario dentro de componentes o páginas

A veces, es posible que necesites utilizar datos de formulario dentro de un componente o página, y tendrás que generar los datos en el ciclo de vida `attached` y enlazarlos al componente.

<o-playground name="formData - uso dentro del componente" style="--editor-height: 600px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./form-data-demo.html"></l-m>
      <form-data-demo></form-data-demo>
    </template>
  </code>
  <code path="form-data-demo.html" active>
    <template component>
      <style>
        :host{
          display: block;
        }
      </style>
      <input type="text" name="username" value="John Doe" />
      <div>{{logtext}}</div>
      <script>
        export default {
          tag:"form-data-demo",
          data: {
            fdata:{},
            logtext: ""
          },
          watch:{
            fdata(data){
              if(data){
                this.logtext = JSON.stringify(data);
              }
            }
          },
          attached(){
            this.fdata = this.shadow.formData();
          }
        };
      </script>
    </template>
  </code>
</o-playground>

A través del ciclo de vida `attached`, después de que el componente esté listo, usamos el método `this.shadow.formData()` para generar el objeto de datos del formulario `fdata`.

`formData()` es más adecuado para escenarios de formularios con lógica de interacción relativamente simple.