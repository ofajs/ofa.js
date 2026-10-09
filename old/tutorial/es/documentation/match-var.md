# Consulta de estilos

`match-var` es un componente funcional en ofa.js que se utiliza para la coincidencia de estilos según variables CSS. A través de `match-var`, se pueden coincidir y aplicar dinámicamente diferentes estilos según el valor de las variables CSS del componente actual. Esta característica está diseñada específicamente para la transmisión de estados relacionados con estilos en el contexto, sin necesidad de usar JavaScript, lo que la hace más conveniente, adecuada para necesidades de transmisión de estilos como colores temáticos.

## Conceptos centrales

- **match-var**: Componente de coincidencia de estilos, que decide si aplicar estilos internos según el valor de la variable CSS
- **Atributo de coincidencia**: Define las variables CSS y valores esperados a través de los atributos del componente
- **Aplicación de estilos**: Cuando la coincidencia es exitosa, los estilos de la etiqueta `<style>` interna se aplican al componente

## Uso básico

`match-var` componente define, mediante atributos, las variables CSS que deben coincidir y los valores esperados. Cuando el valor de la variable CSS del componente coincide con el valor del atributo especificado, se aplican los estilos definidos internamente.

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

### Propiedades

El componente `match-var` utiliza atributos arbitrarios para definir reglas de coincidencia de variables CSS. El nombre del atributo corresponde al nombre de la variable CSS (sin el prefijo `--`), y el valor del atributo es el valor que se espera que coincida.

### Cómo funciona

1. **Compatibilidad del navegador**: Si el navegador admite la consulta `@container style()`, se utilizará directamente la capacidad nativa de CSS.
2. **Manejo de degradación**: Si no es compatible, se detectarán los cambios en los valores de las variables CSS mediante sondeo y se inyectarán estilos dinámicamente cuando coincidan.
3. **Actualización manual**: Se puede activar manualmente la detección de estilos mediante el método `$.checkMatch()`.

## Ejemplos básicos

<o-playground name="Ejemplo básico" style="--editor-height: 500px">
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
      <button on:click="changeTheme">Cambiar tema</button> - Theme:{{currentTheme}}
      <div class="container">
        <theme-box>
          Muestra diferentes estilos según las variables CSS
        </theme-box>
      </div>
        <theme-box style="--theme: light;">
          Muestra tema claro
        </theme-box>
        <theme-box style="--theme: dark;">
          Muestra tema oscuro
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

## Coincidencia de múltiples condiciones

Se pueden usar múltiples atributos para definir condiciones de coincidencia más complejas, y el estilo solo se aplicará cuando todas las variables CSS coincidan.

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

## Ejemplo de coincidencia de múltiples condiciones

<o-playground name="Ejemplo de coincidencia de atributos" style="--editor-height: 500px">
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
      <div>Tema: {{theme}} <button on:click="changeTheme">Cambiar tema</button></div>
      <div>Tamaño: {{size}} <button on:click="changeSize">Cambiar tamaño</button></div>
      <div class="content">
        <test-card>
          <div>Ejemplo de coincidencia de estilos con múltiples condiciones</div>
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

## checkMatch actualización manual

En algunos casos, los cambios en las variables CSS pueden no ser detectados automáticamente, en cuyo caso se puede llamar manualmente al método `$.checkMatch()` para activar la detección de estilos.

> Actualmente, Firefox aún no admite las consultas `@container style()`, por lo que es necesario invocar manualmente `$.checkMatch()`; cuando el navegador lo soporte de forma nativa en el futuro, el sistema detectará automáticamente los cambios en las variables y no será necesario activarlo manualmente.

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // Activar manualmente la detección de estilos
    $.checkMatch();
  }
}
```

## Mejores prácticas

1. **Priorizar el uso de capacidades nativas de CSS**: `match-var` priorizará el uso de la consulta nativa `@container style()` del navegador, con mejor rendimiento en navegadores modernos.
2. **Organizar los estilos de manera lógica**: agrupar los estilos de coincidencia relacionados para facilitar el mantenimiento y la comprensión.
3. **Usar el enlace `data()`**: combinado con la directiva `data()` se puede lograr un cambio de estilo reactivo.