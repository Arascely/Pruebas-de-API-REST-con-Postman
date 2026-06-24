# Pruebas-de-API-REST-con-Postman

* **Nombre:** Grissel Arascely Rodríguez Quispe
* **Codigo:** 2722215
* **Link de la monografia** https://docs.google.com/document/d/1oBJJjVKl9jgEQtTqhEwPXznulUP9iIgKjuc1snXUmGI/edit?usp=sharing
* **Herramientas:**
  
    Jest, Supertest, Postman, Node.js
## 1. Introducción
Como parte del alcance inicial de la investigación, se consultó la documentación oficial para desarrolladores de Mercado Libre (`api.mercadolibre.com`) y se configuró el entorno en Postman para realizar pruebas reales de caja negra contra su API pública de catálogo.

### 1.1 Evidencia de Investigación en la API de Mercado Libre
Se ejecutaron consultas iniciales apuntando al catálogo de Mercado Libre Perú (MPE):

* **Consulta de Catálogo en Mercado Libre Perú (MPE):**
  <img width="533" height="270" alt="Resultado" src="https://github.com/user-attachments/assets/0fb49ab1-04c0-4298-965f-9af0b7627e9b" />

A pesar de conseguir acceso de lectura, el entorno estaba muy restringido debido a la Restricción de Operaciones de Escritura (`POST`, `PUT`, `DELETE`). Dichos módulos no son públicos en Mercado Libre; exigen obligatoriamente el registro formal de una aplicación, vinculación de cuentas de producción y un flujo de autenticación basado en tokens de solo 6 horas que imposibilitaban pruebas automatizadas estables. 

Por lo tanto, se determinó migrar el laboratorio hacia **Platzi Fake Store API** (`https://api.escuelajs.co`), una API REST pública y abierta especializada en e-commerce que simula de manera robusta los flujos comerciales y permite la inyección de tokens JWT (Bearer Token), garantizando que el diseño de los 10 escenarios de prueba sea reproducible y de nivel profesional.

---

### 1.1 Evidencia de Investigación en la API de Mercado Libre
Como parte del alcance inicial de la investigación, se consultó la documentación oficial para desarrolladores de Mercado Libre (`api.mercadolibre.com`) y se configuró el entorno en Postman para realizar pruebas reales de caja negra contra su API pública de catálogo.

A continuación, se detalla la evidencia de las peticiones ejecutadas:

* **Consulta de Catálogo en Mercado Libre Perú (MPE):**

  El resultado en JSON:

  <img width="533" height="270" alt="Resultado" src="https://github.com/user-attachments/assets/0fb49ab1-04c0-4298-965f-9af0b7627e9b" />


  A pesar de conseguir acceso limitado, estaba muy restringido debido a la Restricción de Operaciones de Escritura (POST, PUT, DELETE) entonces los módulos relacionados no son públicos. Requieren obligatoriamente el registro de una aplicación en su portal de desarrolladores, vinculación de cuentas reales y un flujo de autenticación de solo 6 horas. Entonces se realizó el mapeo de los 10 casos sobre FakeStore API, manteniendo intacta la lógica comercial.
---

## 2. Ejecución de Pruebas y Casos de Uso

### MÓDULO 1: BÚSQUEDA Y FILTROS 

## 2. Ejecución de Pruebas y Casos de Uso

### MÓDULO 1: BÚSQUEDA Y FILTROS 

#### TC-001: Búsqueda exitosa con término genérico
* **Método:** `GET`
* **URL:** `https://api.escuelajs.co/api/v1/products`
* **Descripción:** Recupera el catálogo completo de productos para comprobar la disponibilidad y correcta carga de la interfaz principal en formato JSON.

#### TC-002: Búsqueda sin coincidencias
* **Método:** `GET`
* **URL:** `https://api.escuelajs.co/api/v1/products?title=LaptopInexistente2026`
* **Descripción:** Valida la resiliencia del sistema enviando una cadena de búsqueda inexistente; se espera una respuesta limpia (array vacío `[]`) sin caídas del servidor.

#### TC-003: Validación cruzada de Filtros de Precio
* **Método:** `GET`
* **URL:** `https://api.escuelajs.co/api/v1/products?price_min=900&price_max=1000`
* **Descripción:** Evalúa el ordenamiento y segmentación por rango de precios, asegurando que el backend devuelva únicamente los objetos que cumplan el presupuesto asignado.

#### TC-004: Inyección de caracteres especiales
* **Método:** `GET`
* **URL:** `https://api.escuelajs.co/api/v1/products?title=%20@!#$`
* **Descripción:** Prueba de robustez y seguridad enviando caracteres corruptos codificados en los parámetros para verificar el correcto filtrado de entradas de la API.

#### TC-005: Procesamiento de Filtros Simultáneos
* **Método:** `GET`
* **URL:** `https://api.escuelajs.co/api/v1/products?title=Clothes&limit=5&offset=0`
* **Descripción:** Comprueba el comportamiento del backend cuando se combinan múltiples parámetros de consulta (Query Params) de búsqueda y paginación en una sola petición.

---

### MÓDULO 2: GESTIÓN DE INVENTARIO Y CATÁLOGO

#### TC-006: Agregar un nuevo producto al catálogo
* **Método:** `POST`
* **URL:** `https://api.escuelajs.co/api/v1/products`
* **Cuerpo de la Petición (JSON - Body):**
  ```json
  {
    "title": "Laptop Gamer Pro 2026",
    "price": 1200,
    "description": "Laptop de alta gama para desarrollo de sistemas y videojuegos.",
    "categoryId": 2,
    "images": ["[https://i.imgur.com/QkIa5tT.png](https://i.imgur.com/QkIa5tT.png)"]
  }
  # **TC**-008: Actualización de datos del producto
Método: **PUT**

**URL**: [https://api.escuelajs.co/api/v1/products/{id_dinámico}](https://api.escuelajs.co/api/v1/products/{id_dinámico})

### Cuerpo de la Petición (**JSON** - Body)

## **JSON**
- {
**title**: **Producto Actualizado Postman**,
- **price**: 150
- }
Descripción: Modifica en tiempo real las propiedades de un artículo existente usando su identificador único. Se valida que el backend devuelva un código 200 **OK** y refleje los cambios solicitados de forma inmediata.

**TC**-009: Eliminación física de un producto
Método: **DELETE**

**URL**: [https://api.escuelajs.co/api/v1/products/{id_dinámico}](https://api.escuelajs.co/api/v1/products/{id_dinámico})

Descripción: Envía la instrucción de borrado completo sobre el recurso seleccionado. El objetivo es certificar que el endpoint responda con un estado 200 **OK**, confirmando que el ciclo de baja del elemento concluyó con éxito en el servidor.

**TC**-010: Persistencia tras creación de categorías múltiples
Método: **POST**

**URL**: [https://api.escuelajs.co/api/v1/categories](https://api.escuelajs.co/api/v1/categories)

### Cuerpo de la Petición (**JSON** - Body)

## **JSON**
- {
**name**: **Componentes de Redes**,
```
"image": "[https://i.imgur.com/z8V6w7X.jpg](https://i.imgur.com/z8V6w7X.jpg)"
```
- }
Descripción: Agrega una nueva categoría al catálogo de la tienda para verificar la persistencia de las agrupaciones del e-commerce, esperando un código 201 Created y su respectiva estructura de confirmación.
  
## 3. Automatización de Pruebas con Supertest y Jest

Para optimizar el proceso de pruebas y asegurar la estabilidad de la API ante futuros cambios, se tradujeron los 10 casos de uso manuales a un script de automatización utilizando **Supertest** como cliente HTTP y **Jest** como motor de ejecución de pruebas.

### Archivo de Pruebas: `tests/api.test.js`

El código fuente implementado en el nuevo repositorio donde se evalua las respuestas del servidor en milisegundos.

El codigo esta en tests/api.test.js

### Resultados de npm test con supertest

<img width="500" height="288" alt="Test" src="https://github.com/user-attachments/assets/a68b1e83-430e-44aa-b93b-e8059c008249" />

Al ejecutar los 10 casos a mano en Postman toma varios minutos; con Supertest y Jest, toda la suite se comunicó con el servidor y validó las respuestas en apenas **8.038 segundos** (menos de un segundo por petición).
Con la consola en verde, el sistema genera automáticamente un archivo `test-report.html`. Al abrirlo, muestra un reporte visual y limpio con gráficos de los resultados, ideal para auditorías rápidas.





