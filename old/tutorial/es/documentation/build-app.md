# Producción e implementación

Los proyectos desarrollados con ofa.js se pueden implementar directamente en un servidor estático para su uso.

## Entorno de desarrollo

Puedes usar el [ofa Studio](https://core.noneos.com/?redirect=studio) oficial para el desarrollo, ya que proporciona una creación y vista previa de proyectos con un solo clic.

También puedes construir tu propio servidor estático:

* Usar un servidor estático como Nginx o Apache
* Usar el módulo [http-server](https://www.npmjs.com/package/http-server) de Node.js
* Usar directamente el plugin de servidor estático del editor para previsualizar

## Entorno de producción

### Exportar proyecto

Si estás utilizando un proyecto construido con [ofa Studio](https://core.noneos.com/?redirect=studio), simplemente usa la función de exportación incorporada en la herramienta.

Si es un proyecto construido manualmente, puedes implementar directamente la carpeta del proyecto en un servidor estático, manteniendo el modo del entorno de desarrollo consistente.

### Compresión y ofuscación

El entorno de producción generalmente requiere herramientas de compresión y ofuscación para reducir el tamaño de los archivos y mejorar la velocidad de carga. Puedes usar [Terser CLI](https://terser.org/docs/cli-usage/) para la compresión y ofuscación.

Si no deseas usar herramientas de línea de comandos, puedes usar [ofa build](https://builder.ofajs.com/) para comprimir y ofuscar archivos en línea. Esta herramienta actualmente está en versión beta y más tarde se integrará en ofa Studio.

