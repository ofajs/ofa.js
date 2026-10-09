# Aplicación de una sola página

Una aplicación de una sola página vincula el componente `o-app` con la barra de direcciones del navegador, manteniendo sincronizada la URL de la página con la ruta de las páginas dentro de la aplicación. Tras habilitar la aplicación de una sola página:

- Refrescar la página web puede mantener el estado actual de la ruta
- Copiar la URL de la barra de direcciones y abrirla en otro navegador o pestaña también puede restaurar el estado de la aplicación
- Los botones de avanzar/retroceder del navegador funcionan con normalidad

## Uso básico

Envuelve el componente `o-app` con el componente oficial `o-router` para lograr una aplicación de página única.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>prueba de router</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

## Atributo fix-body

Después de agregar el atributo `fix-body`, `o-router` restablecerá automáticamente los estilos de `html` y `body`, eliminando el margin y padding predeterminados.

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

Esto es especialmente útil en los siguientes escenarios:- Se requiere que `o-app` llene completamente el viewport
- Cuando la aplicación es el único contenido de la página

## Ejemplo

<o-playground name="Ejemplo de aplicación de una sola página" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
      <o-router fix-body>
        <o-app src="./app-config.js"></o-app>
      </o-router>
    </template>
  </code>
  <code path="app-config.js">
    // dirección de la página de inicio de la aplicación
    export const home = "./home.html";
    // configuración de animación de cambio de página
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
    export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });
  setTimeout(() => (loadingEl[0].style.width = "98%"));
  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      \$.fn.remove.call(loadingEl);
    }, 200);
  };
  return loadingEl;
};
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br>
      <br>
      <button on:click="gotoAbout">Go to About Button</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto:{
                gotoAbout(){
                    this.goto("./about.html");
                }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Principio de funcionamiento

Aplicación de una sola página implementada con el modo Hash del navegador:

1. Cuando se produce un cambio de página dentro de la aplicación, `o-router` actualiza automáticamente el valor hash en la barra de direcciones (por ejemplo, `#/about.html`).
2. Cuando el usuario actualiza la página o accede a través de una URL, `o-router` lee el valor hash y carga la página correspondiente.
3. Los botones de avance/retroceso del navegador activan cambios en el hash, controlando así la navegación de páginas de la aplicación.

## Ejemplo de cambio de URL

Supongamos que la aplicación tiene dos páginas `home.html` y `about.html`:

| Operación del usuario | Cambio en la barra de direcciones |
|---------|-----------|
| Abrir la aplicación | `index.html` → `index.html#/home.html` |
| Saltar a la página Acerca de | `index.html#/home.html` → `index.html#/about.html` |
| Hacer clic en Atrás | `index.html#/about.html` → `index.html#/home.html` |
| Actualizar la página | Mantener el hash actual sin cambios |## Limitaciones de uso

- Una aplicación de una sola página solo puede usarse con **un** componente `o-app`