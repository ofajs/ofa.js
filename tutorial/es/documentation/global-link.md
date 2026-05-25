# componente global-link

`global-link` es un componente de herramienta que permite a todos los componentes compartir estilos.

## Uso básico

Después de referenciar el componente `global-link` en `ofa.js`, puedes hacer que todos los componentes carguen ese archivo de estilo referenciando el archivo de estilo a través de `global-link`.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ejemplo de global-link</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/global-link/dist/global-link.min.mjs" type="module"></script>
</head>
<body>
  <o-global-link href="./global.css"></o-global-link>
</body>
</html>
```

## Escenarios aplicables

⚠️ **Advertencia**: `global-link` contamina el ámbito de estilos global, como una variable global.

**¡Absolutamente no uses este componente en proyectos nuevos!** Si utilizas `global-link` en un proyecto nuevo, significa que el diseño de la arquitectura de tu proyecto tiene problemas, es una señal de un proyecto de mala calidad.

Usar solo en los siguientes escenarios:

- Migración de proyectos antiguos (solución temporal)
- Código espagueti, proyecto basura (apagafuegos temporal)

## Alternativas

Puedes crear un archivo `public.css` y luego importarlo por separado en cada uno de tus módulos de componentes (usando la etiqueta `link`), así lograrás el efecto que deseas y evitarás contaminar los estilos globales.

```html
<!-- En el módulo del componente -->
<link rel="stylesheet" href="./public.css">
```

## Notas importantes

Debe priorizarse el uso de la etiqueta `o-global-link` para la inicialización. Solo después de completar la inicialización, los componentes posteriores aplicarán los estilos globales.