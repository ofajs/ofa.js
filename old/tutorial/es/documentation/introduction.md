# Introducción

## ¿Qué es ofa.js?

ofa.js es un marco frontend web fácil de usar, diseñado específicamente para construir aplicaciones web, con el objetivo de mejorar la eficiencia del desarrollo y reducir la barrera de entrada.

> Si ya estás **básicamente familiarizado** con HTML, CSS y JavaScript, entonces ofa.js es una excelente opción.

## Por qué desarrollé ofa.js

El objetivo original de ofa.js es simple: resolver el problema de **ingeniería** del desarrollo web sin depender de herramientas de compilación.

> La ingenierización se refiere a la integración sistemática de normas, procesos, herramientas y métodos en el desarrollo de software, con el fin de mejorar la eficiencia del desarrollo, la calidad del código y la mantenibilidad.

En la última década, el desarrollo front-end web ha experimentado una evolución desde el crecimiento desordenado inicial hasta una ingeniería gradual. Este proceso ha tomado prestada la experiencia del desarrollo de aplicaciones tradicionales, introduciendo Node.js y flujos de compilación para resolver los desafíos de ingeniería en proyectos de gran escala.

Sin embargo, cuando el proyecto se vuelve más grande, los inconvenientes de este modelo se exponen gradualmente, apareciendo el problema de la **aplicación monolítica** que se enfrenta en el desarrollo tradicional, lo que dificulta el mantenimiento del proyecto y la iteración de las necesidades de interacción.

> Aplicación monolítica (Monolithic Application) se refiere a una aplicación única, grande y estrechamente acoplada, donde todos los módulos funcionales se concentran en un único repositorio de código; un pequeño cambio afecta al conjunto, dificultando el desarrollo y despliegue independientes.

En este momento, es necesario descomponer el proyecto para lograr la microfrontendización, al igual que los **microservicios**. Sin embargo, debido al procesamiento de compilación, el microfrontend se vuelve difícil y engorroso; la implementación independiente de los módulos frontend requiere compilar cada módulo pequeño, lo cual es muy complicado, lo que provoca que el desarrollo de la tecnología frontend web esté casi estancado.

> Los microservicios (Microservices) son un estilo de arquitectura de software que divide aplicaciones grandes y complejas en múltiples servicios pequeños, de grano fino, implementados y ejecutados de forma independiente.

En ese momento, comencé a reflexionar: los lenguajes de programación tradicionales necesitan manejar diferentes hardware y sistemas operativos, por lo que deben compilarse para lograr una diferenciación multiplataforma. Pero el desarrollo web es diferente, se basa en navegadores, originalmente no requiere compilación, puede ejecutarse y desplegarse de forma independiente, y es inherentemente un modelo de microfrontend. Entonces me di cuenta de que el proceso de compilación, en realidad, complica las cosas.

Es decir, siempre que se resuelvan los problemas de ingeniería y se elimine el paso necesario de compilación, el desarrollo front-end será muy adecuado para desarrollar aplicaciones a gran escala, esto es el patrón de microfrontend natural. Así nació ofa.js.

## Ventajas clave

### Sin barreras, listo para usar

No es necesario configurar un entorno de desarrollo, instalar dependencias o configurar un andamio. Simplemente abra el programa de construcción oficial a través del navegador, seleccione un directorio local y comience a desarrollar. Todas las operaciones de cálculo, datos y almacenamiento se ejecutan localmente, sin depender de servicios en la nube.

### Amigable con la IA, fácil de verificar

No hay caja negra de compilación, el código producido por IA se puede desplegar y autoverificar rápidamente; reducir las capas intermedias, evitar el proceso de compilación, hacer que el código sea más fácil de localizar problemas y reparar.

### Soporte nativo para micro-frontends

ofa.js permite que el desarrollo frontend web se divida en múltiples módulos independientes, al igual que los microservicios, donde cada módulo puede desarrollarse e implementarse de forma independiente. Cuando se rompen los límites del frontend web tradicional, la tecnología frontend superará gradualmente las limitaciones de la tecnología del servidor.

## Empezar

- Si tienes cierta base de desarrollo, puedes comenzar desde [Introducción de Scripts](./script-reference.md).
- Si eres principiante, se recomienda comenzar desde [Crear la primera aplicación](./create-first-app.md).