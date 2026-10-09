# Componentes implícitos

ofa.js incluye internamente dos tipos de componentes no explícitos:

* Componentes de renderizado condicional: `x-if`, `x-else-if`, `x-else`
* Componente de relleno: `x-fill`

Estos dos componentes tienen la misma funcionalidad que los componentes `o-if` y `o-fill`, pero ellos mismos no se renderizan realmente en el DOM, sino que renderizan sus elementos internos directamente en la zona correspondiente.

Por ejemplo:

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- El estilo no es rojo porque el componente o-if está presente en el DOM -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- El estilo es rojo porque el componente x-if no se renderiza en el DOM -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="Componente no explícito" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* Selecciona los elementos .item hijos directos para que sean rojos */
            color:red;
        }
        /* Se necesita seleccionar los elementos .item dentro del componente o-if */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- El estilo no es rojo porque el componente o-if existe en el DOM -->
                <div class="item">no se mostrará en rojo</div>
            </o-if>
            <x-if :value="true">
                <!-- El estilo es rojo porque el componente x-if no se renderiza en el DOM -->
                <div class="item">se muestra en rojo</div>
            </x-if>
        </div>
        <script>
        export default async () => {
            return {
            data: {},
            };
        };
        </script>
    </template>
  </code>
</o-playground>

## Componente de renderizado condicional x-if

`x-if` tiene exactamente la misma funcionalidad que [o-if](./conditional-rendering.md), se utiliza para decidir si se renderiza contenido en función del valor de verdad de una expresión condicional. La diferencia es que `x-if` en sí mismo no existe como elemento DOM, y su contenido interno se renderiza directamente en el contenedor padre.

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>¡Bienvenido de nuevo, usuario!</p>
    </x-if>
</div>
```

`x-if` también se puede usar con `x-else-if` y `x-else`:

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>Panel de administración</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>Centro de usuario</p>
    </x-else-if>
    <x-else>
        <p>Inicie sesión</p>
    </x-else>
</div>
```

## x-fill Componente de relleno

`x-fill` tiene exactamente la misma funcionalidad que [o-fill](./list-rendering.md), se utiliza para renderizar datos de un array como múltiples elementos DOM. Al igual que `x-if`, `x-fill` no se renderiza en el DOM, sino que su plantilla interna se renderiza directamente en el contenedor padre.

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

Ejemplo de uso de plantillas con nombre:

```html
<ul>
    <x-fill name="li" :value="items"></x-fill>
</ul>

<template name="li">
    <li class:active="$data.active">
        <a attr:href="$data.href">{{$data.name}}</a>
    </li>
</template>
```

## Notas de rendimiento

Además de las diferencias funcionales, el rendimiento de renderizado de los componentes no explícitos es **mucho peor** que el de los componentes explícitos (`o-if`, `o-fill`). Esto se debe a que los componentes no explícitos no se renderizan realmente en el DOM, y requieren lógica de renderizado simulada adicional para manejar la posición y actualización de los elementos internos.

Además, los componentes no explícitos pueden provocar algunos errores difíciles de detectar: debido a que no ingresan realmente al DOM, las operaciones que dependen de la estructura del DOM (como la vinculación de eventos, el cálculo de estilos o las consultas de bibliotecas de terceros) pueden fallar o comportarse de manera anómala.

Por lo tanto, se recomienda **utilizar primero los componentes explícitos** (`o-if`, `o-else-if`, `o-else`, `o-fill`) y emplear los componentes no explícitos solo en escenarios específicos.

## Escenarios de uso

Aunque los componentes no explícitos tienen un rendimiento deficiente, pueden ser utilizados en los siguientes escenarios:

1. **Evita niveles adicionales del DOM**: cuando no quieres que los elementos `o-if` o `o-fill` formen parte de la estructura del DOM
2. **Herencia de estilos**: cuando necesitas que los elementos internos hereden directamente los estilos del contenedor padre, sin verse afectados por elementos de componentes intermedios
3. **Limitaciones de selectores CSS**: cuando necesitas utilizar selectores de hijo directo del padre (como `.container > .item`) para controlar con precisión los estilos, pero no deseas tener elementos de envoltura adicionales