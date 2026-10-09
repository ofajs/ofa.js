# Introducción de scripts

ofa.js admite su uso mediante la etiqueta script. Solo necesita agregar el siguiente código en la sección `<head>` o `<body>` del archivo HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## Uso básico

Después de importar el script, ofa.js creará una variable `$` en el ámbito global; todas las funciones principales se proporcionan a través de este objeto. Puede acceder a los diversos métodos y propiedades de ofa.js mediante este objeto. Los tutoriales posteriores detallarán su uso específico.

## Modo de depuración

Durante el desarrollo, puede activar el modo de depuración añadiendo el parámetro `#debug` al final de la URL del script:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

El modo de depuración habilita la función de mapas de origen, lo que le permite ver y depurar directamente el código fuente original de los archivos en las herramientas de desarrollo del navegador, mejorando así significativamente la eficiencia del desarrollo.

## ESM módulo

ofa.js también admite la importación mediante módulos ESM. Puede utilizar la sentencia `import` en su proyecto para importar ofa.js:

```javascript
import 'https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs';
```

Al usar módulos ESM, puede utilizar directamente la variable `$` en el código sin necesidad de acceder a través del ámbito global.