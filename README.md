# Pruebas-de-API-REST-con-Postman
## 1. Introducción
Se hara uso de la **API Oficial de Desarrolladores de Mercado Libre** solopara analizar el Sistema de Mercado Libre (`api.mercadolibre.com`). Se seleccionaron endpoints públicos que sustentan el módulo de búsqueda y catálogo de la plataforma, ejecutando las pruebas de peticiones HTTP a través del cliente Postman.

Si la prueba no es ejecutable en la API oficial o si es que necesita metodos como POST, PUT o DELETE se usara el API de FAKE STORE ('https://fakestoreapi.com/doc'), esto para no tener inconvenientes como tener un acceso a una cuenta de desarrrollador, registrar una aplicación y generar tokens de acceso.

### 1.1 Evidencia de Investigación en la API de Mercado Libre
Como parte del alcance inicial de la investigación, se consultó la documentación oficial para desarrolladores de Mercado Libre (`api.mercadolibre.com`) y se configuró el entorno en Postman para realizar pruebas reales de caja negra contra su API pública de catálogo.

A continuación, se detalla la evidencia de las peticiones ejecutadas:

* **Consulta de Catálogo en Mercado Libre Perú (MPE):**
  Se realizó una petición `GET` al recurso de búsquedas utilizando parámetros de filtrado geográfico y términos de consulta clave para emular la experiencia del e-commerce local.
  
  ```text
  GET https://api.mercadolibre.com/users/me?Content-Type&A=

  El resultado en JSON:
  

  A pesar de conseguir acceso limitado estaba muy restringido debido a la Restricción de Operaciones de Escritura (POST, PUT, DELETE) entonces los módulos relacionados al Carrito de Compras de Mercado Libre no son públicos. Requieren obligatoriamente el registro de una aplicación en su portal de desarrolladores, vinculación de cuentas reales y un flujo de autenticación completo. Entonces se realizó el mapeo de los 10 casos sobre FakeStore API, manteniendo intacta la lógica comercial.
---

## 2. Ejecución de Pruebas y Casos de Uso

# Pruebas de API REST con Postman y Supertest

## 1. Introducción
Para la validación del sistema E-commerce se estructuró una suite de 10 casos de prueba automatizados enfocados en dos módulos críticos: **Búsqueda y Filtros** y el **Carrito de Compras**. 

Debido a que las plataformas comerciales cerradas (como Mercado Libre) imponen restricciones estrictas de seguridad, registros de aplicaciones de terceros y tokens de acceso OAuth dinámicos que expiran rápidamente, se optó por utilizar **FakeStore API** (`https://fakestoreapi.com`). Esta es una API REST pública y abierta especializada en entornos de comercio electrónico que permite ejecutar de forma limpia y transparente todo el ciclo de peticiones HTTP (`GET`, `POST`, `PUT`, `DELETE`), garantizando que las pruebas de integración sean estables y reproducibles.

---

## 2. Ejecución de Pruebas y Casos de Uso

### MÓDULO 1: BÚSQUEDA Y FILTROS 

#### TC-001: Búsqueda exitosa con término genérico
* **Método:** `GET`
* **URL:** `https://fakestoreapi.com/products`
* **Descripción:** Recupera el catálogo completo de productos para comprobar la disponibilidad y correcta carga de la interfaz principal.

#### TC-002: Búsqueda sin coincidencias
* **Método:** `GET`
* **URL:** `https://fakestoreapi.com/products/category/nonexistent`
* **Descripción:** Valida la resiliencia del sistema enviando una categoría inexistente; se espera una respuesta limpia (array vacío) sin caídas del servidor.

#### TC-003: Validación cruzada de Filtros de Precio
* **Método:** `GET`
* **URL:** `https://fakestoreapi.com/products?sort=desc`
* **Descripción:** Evalúa el ordenamiento jerárquico del catálogo asegurando que los objetos devueltos sigan manteniendo sus propiedades de costo operables.

#### TC-004: Inyección de caracteres especiales
* **Método:** `GET`
* **URL:** `https://fakestoreapi.com/products/category/%20@!#$`
* **Descripción:** Prueba de robustez y seguridad enviando caracteres corruptos codificados en la URL para verificar el control de errores de la API.

#### TC-005: Procesamiento de Filtros Simultáneos
* **Método:** `GET`
* **URL:** `https://fakestoreapi.com/products?limit=5&sort=desc`
* **Descripción:** Comprueba el comportamiento del backend cuando se combinan múltiples parámetros de consulta (Query Params) en una sola petición.

---

### MÓDULO 2: CARRITO DE COMPRAS

#### TC-006: Agregar producto al carrito
* **Método:** `POST`
* **URL:** `https://fakestoreapi.com/carts`
* **Cuerpo de la Petición (JSON - Body):**

* **Descripción:** Simula la acción de un usuario al añadir un artículo a su orden. Valida que el backend reciba las propiedades correctamente y responda con el código de éxito de creación (`201 Created`) junto al ID autogenerado del carrito.

---

#### TC-007: Límite superior de stock
* **Método:** `POST`
* **URL:** `https://fakestoreapi.com/carts`

* **Descripción:** Prueba de estrés y límites comerciales. Se envía un volumen de artículos exageradamente alto (`99999`) para evaluar la tolerancia estructural del backend y cómo procesa la API una carga de datos anómala en las cantidades.

---

#### TC-008: Cálculo aritmético del subtotal
* **Método:** `GET`
* **URL:** `https://fakestoreapi.com/carts/5`
* **Descripción:** Recupera la información y estructura de un registro de carrito existente (ID: 5). Se verifica que devuelva la colección de productos y cantidades necesarias para que la lógica de la aplicación pueda procesar los cálculos matemáticos de subtotales y totales de la compra.

---

#### TC-009: Eliminación de producto y carrito vacío
* **Método:** `DELETE`
* **URL:** `https://fakestoreapi.com/carts/6`
* **Descripción:** Envía la instrucción de borrado completo sobre el recurso del carrito número 6. El objetivo es certificar que el endpoint responda con un estado `200 OK`, confirmando que el ciclo de eliminación del recurso se completó exitosamente en el servidor.

---

#### TC-010: Persistencia tras recargar la página
* **Método:** `GET`
* **URL:** `https://fakestoreapi.com/carts/user/2`
* **Descripción:** Simula una re-consulta de la sesión del usuario (ID: 2) para verificar que la información del carrito no se pierda ni se destruya de la base de datos tras una supuesta recarga o actualización de la interfaz, asegurando la persistencia de los datos.

## 3. Automatización de Pruebas con Supertest y Jest

Para optimizar el proceso de pruebas y asegurar la estabilidad de la API ante futuros cambios, se tradujeron los 10 casos de uso manuales a un script de automatización utilizando **Supertest** como cliente HTTP y **Jest** como motor de ejecución de pruebas.

### Archivo de Pruebas: `tests/api.test.js`

El código fuente implementado en el nuevo repositorio utiliza aserciones asíncronas para evaluar las respuestas del servidor en milisegundos.

El codigo esta en tests/api.test.js

