ShipNow API

API backend para la gestión de órdenes y entregas logísticas, desarrollada como proyecto final de Backend 3.

ShipNow permite gestionar usuarios, órdenes, entregas y seguimiento de envíos, incorporando autenticación mediante JWT, autorización por roles, persistencia en MongoDB, carga de archivos, documentación con Swagger, mocks y testing automatizado.

Tecnologías

Node.js 24

Express 5

MongoDB

Mongoose

JWT

bcrypt

Multer

Swagger / OpenAPI

Mocha

Chai

Supertest

Docker

Docker Compose

Winston

Arquitectura

El proyecto utiliza una arquitectura por capas:

Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Model
  ↓
MongoDB

Capas principales

Routes: definición de endpoints y middlewares.

Controllers: reciben las solicitudes HTTP y devuelven las respuestas.

Services: contienen la lógica de negocio.

Repositories: encapsulan el acceso a MongoDB.

Models: definen los esquemas de Mongoose.

Middlewares: autenticación, autorización, logging, manejo de errores y validaciones.

Config: configuración de entorno, base de datos y Swagger.

Mocks: generación de datos de prueba.

Estructura del proyecto

shipnow/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── middlewares/
│   ├── mocks/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── test/
├── uploads/
├── logs/
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md

.env, .env.test, node_modules, logs, uploads locales y coverage no forman parte del repositorio.

Instalación

Requisitos

Node.js 24 o superior

MongoDB

npm

Clonar el proyecto e instalar las dependencias:

npm install

Crear un archivo .env en la raíz del proyecto.

Ejemplo:

PORT=8080
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/shipnow
JWT_SECRET=your_jwt_secret_here

No subir el archivo .env al repositorio.

También se incluye .env.example con las variables necesarias para configurar el proyecto.

Ejecución local

Para iniciar el servidor:

npm start

La API estará disponible en:

http://localhost:8080

Health check

GET /health

Respuesta esperada:

{
  "status": "ok",
  "environment": "development"
}

Docker

El proyecto incluye un Dockerfile multi-stage y un archivo docker-compose.yml.

Para construir y levantar la API junto con MongoDB:

docker-compose up --build

También puede utilizarse la sintaxis moderna equivalente:

docker compose up --build

Una vez construidas las imágenes, para levantar los servicios normalmente:

docker-compose up

Los servicios utilizados son:

API: localhost:8080

MongoDB: localhost:27017

Para comprobar el estado de los contenedores:

docker-compose ps

Para detener los servicios:

docker-compose down

La configuración de Docker utiliza un volumen persistente para MongoDB, por lo que los datos no se pierden al detener los contenedores.

Swagger

La documentación interactiva de la API está disponible en:

http://localhost:8080/api/docs

Swagger documenta los endpoints disponibles, parámetros, respuestas, autenticación y esquemas utilizados por la API.

Autenticación

ShipNow utiliza JSON Web Tokens (JWT) para autenticar usuarios.

Para iniciar sesión:

POST /api/users/login

Ejemplo:

{
  "email": "usuario@example.com",
  "password": "123456"
}

El endpoint devuelve un token JWT.

Para acceder a endpoints protegidos se debe enviar:

Authorization: Bearer <TOKEN>

Roles

La API utiliza autorización basada en roles.

Roles disponibles:

admin

customer

driver

store

Los permisos se controlan mediante middleware según el endpoint solicitado.

Endpoints principales

Users

Método

Endpoint

Descripción

GET

/api/users

Obtener usuarios

POST

/api/users

Registrar usuario

POST

/api/users/login

Iniciar sesión

GET

/api/users/:id

Obtener usuario

PUT

/api/users/:id

Actualizar usuario

DELETE

/api/users/:id

Eliminar usuario

Orders

Método

Endpoint

Descripción

GET

/api/orders

Obtener órdenes

GET

/api/orders/:id

Obtener una orden

POST

/api/orders

Crear una orden

PUT

/api/orders/:id

Actualizar una orden

DELETE

/api/orders/:id

Eliminar una orden

El total de una orden se calcula automáticamente a partir de sus productos:

total = Σ (cantidad × precio)

Deliveries

Método

Endpoint

Descripción

GET

/api/deliveries

Obtener entregas

GET

/api/deliveries/:id

Obtener una entrega

POST

/api/deliveries

Crear entrega

PUT

/api/deliveries/:id

Actualizar entrega

PATCH

/api/deliveries/:id/status

Actualizar estado

POST

/api/deliveries/:id/proof

Cargar comprobante

DELETE

/api/deliveries/:id

Eliminar entrega

Mocks

GET /api/mocks/users/:quantity

Permite generar usuarios de prueba para testing y desarrollo.

Para consultar todos los endpoints, permisos, parámetros y respuestas disponibles, se puede utilizar la documentación de Swagger.

Estados de seguimiento

Las entregas utilizan los siguientes estados:

En preparación

Despachado

Enviado

Recibido

Cada cambio de estado se registra en un historial con su fecha y hora.

Manejo de archivos

Las entregas permiten cargar comprobantes mediante Multer.

Formatos permitidos:

JPEG

PNG

PDF

Tamaño máximo:

5 MB

Los archivos cargados se almacenan localmente en el directorio:

uploads/

La carpeta uploads/ está excluida del repositorio mediante .gitignore. Los archivos generados durante pruebas locales no deben subirse al repositorio.

Manejo de errores

La API utiliza un middleware global para manejar errores y devolver respuestas JSON consistentes.

Ejemplo:

{
  "status": "error",
  "message": "Order not found"
}

También se manejan errores específicos como:

IDs inválidos

Recursos inexistentes

Datos inválidos

Errores de validación de Mongoose

Valores duplicados

Errores de autenticación

Errores de autorización

Archivos inválidos

Archivos que superan el límite permitido

Rutas inexistentes

Logging

La aplicación utiliza Winston para registrar eventos y errores.

Los logs se almacenan en el directorio:

logs/

El directorio está excluido del repositorio mediante .gitignore. Los logs generados localmente no deben subirse a GitHub.

Testing

El proyecto utiliza:

Mocha

Chai

Supertest

Los tests utilizan una base de datos independiente:

shipnow_test

Variables de entorno utilizadas para testing:

NODE_ENV=test
MONGO_URI=mongodb://127.0.0.1:27017/shipnow_test
JWT_SECRET=test_secret

Para ejecutar todos los tests:

npm test

Actualmente se cubren funcionalidades relacionadas con:

Registro de usuarios

Login y JWT

Autorización por roles

Creación de órdenes

Cálculo automático de totales

Restricciones de usuarios sobre órdenes

Creación y actualización de entregas

Historial de tracking

Carga de archivos

Validación de archivos

Límite de tamaño de archivos

IDs inválidos

Rutas inexistentes

Manejo global de errores

Variables de entorno

Variable

Descripción

PORT

Puerto utilizado por la API

NODE_ENV

Entorno de ejecución

MONGO_URI

URI de conexión a MongoDB

JWT_SECRET

Clave utilizada para firmar los JWT

Se incluye .env.example como referencia para configurar el entorno.

Estado del proyecto

ShipNow cuenta con:

API REST

Arquitectura Controller → Service → Repository

MongoDB con Mongoose

Autenticación JWT

Autorización por roles

Hash de contraseñas con bcrypt

Tracking de entregas

Historial de estados

Upload de comprobantes

Middleware global de errores

Logging con Winston

Mocks

Swagger

Tests automatizados

Docker

Docker Compose

Health check de MongoDB

Autor

Tomás Rodriguez Pena

Proyecto final correspondiente a Backend 3.