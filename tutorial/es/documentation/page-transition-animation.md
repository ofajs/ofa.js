# Animación de cambio de página

El elemento de configuración `pageAnime` se utiliza para controlar los efectos de animación de transición al cambiar de página, mejorando la experiencia del usuario.

## Configuración básica

En `app-config.js`, configure la animación de cambio de página:

```javascript
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
```

## Estado de animación

La animación de cambio de página incluye tres estados:

| Estado | Descripción | Momento de activación |
|------|------|----------|
| `current` | Estilo después de la animación de la página actual | Cuando se completa el cambio de página |
| `next` | Estilo inicial al entrar la nueva página | Cuando comienza a entrar la nueva página |
| `previous` | Estilo objetivo al salir la página anterior | Cuando comienza a salir la página anterior |### Explicación detallada del estado

**current (estado actual)**- El estilo final después de completar la transición de página
- Generalmente, el estado de visualización normal de la página
- Por ejemplo: `opacity: 1, transform: "translate(0, 0)"`

**next (estado de la página siguiente)**- Estilo inicial al entrar en una nueva página
- Se utiliza para definir desde dónde comienza a entrar una nueva página
- Por ejemplo: `opacity: 0, transform: "translate(30px, 0)"` significa entrar desde el lado derecho

**anterior (estado de la página anterior)**- Estilo de destino cuando la página antigua sale
- Se usa para definir hacia dónde va la página antigua
- Por ejemplo: `opacity: 0, transform: "translate(-30px, 0)"` significa salir hacia la izquierda

## Efectos de animación integrados

### Deslizar hacia la izquierda o derecha (predeterminado)

```javascript
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
```

Descripción de efectos:- La nueva página se desliza desde la derecha (posición inicial: 30px a la derecha, opacidad 0)
- La página anterior se desliza hacia la izquierda (posición final: -30px a la izquierda, opacidad 0)
- Finalmente, ambas páginas vuelven a su posición normal (opacidad 1, posición 0)

### Fundido de Entrada y Salida

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
  },
  next: {
    opacity: 0,
  },
  previous: {
    opacity: 0,
  },
};
```

Descripción de efectos:- La página nueva pasa de transparente a visible
- La página vieja pasa de visible a transparente
- Adecuado para un estilo de aplicación sencillo y elegante

### Deslizar hacia arriba y abajo

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(0, 30px)",
  },
  previous: {
    opacity: 0,
    transform: "translate(0, -30px)",
  },
};
```

Descripción de efectos:- La nueva página se desliza desde abajo
- La página anterior se desliza hacia arriba
- Ideal para aplicaciones con estilo de desplazamiento vertical

### Efecto de zoom

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "scale(1)",
  },
  next: {
    opacity: 0,
    transform: "scale(0.8)",
  },
  previous: {
    opacity: 0,
    transform: "scale(1.2)",
  },
};
```

Descripción de efectos:- La nueva página se amplía de pequeña a tamaño normal
- La página anterior se amplía desde el tamaño normal hasta desaparecer
- Adecuado para aplicaciones con estilo de tarjeta o ventana modal

### Efecto de volteo

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "rotateY(0deg)",
  },
  next: {
    opacity: 0,
    transform: "rotateY(-90deg)",
  },
  previous: {
    opacity: 0,
    transform: "rotateY(90deg)",
  },
};
```

Descripción de efectos:- La nueva página entra volteando desde la izquierda
- La página anterior sale volteando hacia la derecha
- Adecuado para aplicaciones que requieren efectos 3D

## Animación personalizada

### Combinar múltiples atributos

Se pueden combinar múltiples propiedades CSS para crear animaciones complejas:

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0) scale(1)",
  },
  next: {
    opacity: 0,
    transform: "translate(50px, 50px) scale(0.9)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-50px, -50px) scale(1.1)",
  },
};
```

### Usar diferentes funciones de suavizado

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
```

## Propiedades CSS compatibles

`pageAnime` soporta todas las propiedades CSS animables：

### Atributos comunes

- `opacity` - opacidad (0-1)
- `transform` - transformación
  - `translate(x, y)` - traslación
  - `scale(n)` - escala
  - `rotate(deg)` - rotación
  - `rotateX/Y(deg)` - rotación 3D
- `width` / `height` - ancho / alto
- `margin` / `padding` - margen / relleno
- `background-color` - color de fondo
- `border-radius` - radio de borde

### Precauciones

1. **Optimización de rendimiento**: Prioriza el uso de `transform` y `opacity`, que ofrecen el mejor rendimiento
2. **Evita el desplazamiento de diseño**: Evita usar propiedades que desencadenan un reflujo de diseño (como `width`, `height`, `margin`)
3. **Tiempo de transición**: ofa.js añadirá automáticamente efectos de transición, por defecto 300ms

## Ejemplo completo

<o-playground name="Ejemplo de animación de transición de página" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Dirección de la página de inicio de la aplicación
    export const home = "./home.html";
    // Configuración de la animación de transición de página
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

## Mejores prácticas

### 1. Mantener la animación simple

Evite animaciones demasiado complejas, las animaciones simples son mejores:

```javascript
// ✅ Recomendado: simple y eficaz
export const pageAnime = {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};

// ❌ No recomendado: demasiado complejo
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0) rotate(0deg) scale(1)",
    borderRadius: "0",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 30px) rotate(45deg) scale(0.5)",
    borderRadius: "50%",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, -30px) rotate(-45deg) scale(1.5)",
    borderRadius: "100%",
  },
};
```

### 2. Considerar la experiencia de usuario

- El tiempo de animación no debe ser demasiado largo (se recomienda 200-400ms)
- Evite usar animaciones que provoquen mareos al usuario
- Asegúrese de que la animación sea fluida y sin interrupciones

### 3. Adaptarse a diferentes dispositivos

En dispositivos de gama baja, se puede considerar desactivar o simplificar las animaciones:

```javascript
// Detectar el rendimiento del dispositivo
const isLowEndDevice = navigator.hardwareConcurrency < 4;

export const pageAnime = isLowEndDevice ? {
  current: { opacity: 1 },
  next: { opacity: 0 },
  previous: { opacity: 0 },
} : {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};
```