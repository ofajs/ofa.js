# Renderizado condicional

En ofa.js, el renderizado condicional es una función importante que permite decidir si se renderiza o no un elemento o componente según el estado de los datos. ofa.js proporciona una solución de renderizado condicional basada en componentes, implementada mediante los componentes `o-if`, `o-else-if` y `o-else`.

## componente o-if

`o-if` componente se utiliza para decidir si renderizar su contenido según el valor de verdad de una expresión. Cuando el atributo `value` vinculado es verdadero, el contenido dentro del componente se renderiza; de lo contrario, el contenido no aparece en el DOM.

<o-playground name="Ejemplo de cómo funciona o-if" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="isHide = !isHide">Alternar visualización</button>
      <o-if :value="!isHide">
        <p>{{val}}</p>
      </o-if>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hola, código de demostración de ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Cómo funciona o-if

`o-if` solo renderizará el contenido en el DOM cuando la condición sea verdadera; cuando la condición sea falsa, los elementos DOM dentro de `o-if` se eliminarán por completo. Este método de implementación es adecuado para situaciones donde la condición no cambia con frecuencia, ya que implica la creación y destrucción del DOM.

## Componentes o-else-if y o-else

Cuando se necesitan múltiples ramas condicionales, se pueden utilizar los componentes `o-else-if` y `o-else` junto con `o-if` para lograr la renderización condicional de múltiples ramas.

- `o-if`: primer componente de condición obligatorio
- `o-else-if`: componente de condición intermedio opcional, puede haber varios
- `o-else`: componente de condición predeterminado opcional, colocado al final

<o-playground name="Ejemplo de renderizado condicional con múltiples ramas" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="num++">Toggle Display - {{num}}</button>
      <!-- Según el resultado de num módulo 3, cambia la visualización de diferentes contenidos -->
      <o-if :value="num % 3 === 0">
        <p>❤️ 0 / 3</p>
      </o-if>
      <o-else-if :value="num % 3 === 1">
        <p>😊 1 / 3</p>
      </o-else-if>
      <o-else>
        <p>😭 2 / 3</p>
      </o-else>
      <script>
        export default async () => {
          return {
            data: {
              num: 0,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Ejemplos de escenarios de aplicación práctica

### Control de permisos de usuario

<o-playground name="Ejemplo de control de permisos de usuario" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .admin-panel {
          background-color: #813b3bff;
          padding: 10px;
          margin: 10px 0;
        }
        .user-info {
          background-color: #3f6e86ff;
          padding: 10px;
          margin: 10px 0;
        }
      </style>
      <div>
        <button on:click="toggleUserRole">Cambiar rol de usuario</button>
        <p>Rol actual: {{role}}</p>
        <o-if :value="role === 'admin'">
          <div class="admin-panel">
            <h3>Panel de administración</h3>
            <button>Gestionar usuarios</button>
            <button>Configuración del sistema</button>
          </div>
        </o-if>
        <o-else-if :value="role === 'user'">
          <div class="user-info">
            <h3>Información del usuario</h3>
            <p>Bienvenido {{userName}}!</p>
          </div>
        </o-else-if>
        <o-else>
          <p>Inicia sesión para ver el contenido</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              role: 'guest',
              userName: 'Invitado'
            },
            proto: {
              toggleUserRole() {
                if (this.role === 'guest') {
                  this.role = 'user';
                  this.userName = 'Zhang San';
                } else if (this.role === 'user') {
                  this.role = 'admin';
                } else {
                  this.role = 'guest';
                  this.userName = '';
                }
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Visualización del estado de validación del formulario

<o-playground name="Ejemplo de visualización del estado de validación del formulario" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px;
          padding: 5px;
        }
      </style>
      <div>
        <h3>Ejemplo de validación de correo electrónico</h3>
        <input type="email" :value="email" on:input="email = $event.target.value" placeholder="Ingrese la dirección de correo electrónico">
        <o-if :value="email && isValidEmail(email)">
          <p style="color:green;">✓ Formato de correo electrónico correcto</p>
        </o-if>
        <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
          <p style="color:red;">✗ Formato de correo electrónico incorrecto</p>
        </o-else-if>
        <o-else>
          <p style="color:orange;">Por favor, ingrese una dirección de correo electrónico para validar</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              email: ''
            },
            proto: {
              isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Mejores prácticas de renderizado condicional

1. **Escenario de uso**: cuando un elemento cambia raramente entre diferentes condiciones, es más apropiado usar `o-if`, porque puede eliminar completamente los elementos no deseados, ahorrando memoria.

2. **Consideración de rendimiento**: los elementos que cambian con frecuencia son más adecuados para usar enlaces de clase (como `class:hide`) en lugar de renderizado condicional, porque el renderizado condicional implica la creación y destrucción del DOM.

3. **Estructura clara**: el renderizado condicional es especialmente adecuado para alternar contenido con diferentes estructuras, como pestañas, guías paso a paso, etc.