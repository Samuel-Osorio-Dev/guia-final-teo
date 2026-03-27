# 🎮 API REST — Sistema de Videojuegos

## 📌 Descripción del proyecto
Este proyecto consiste en el desarrollo de una API REST utilizando Node.js, Express y SQLite. Permite gestionar usuarios, videojuegos, compras, detalles de compra y reseñas.

El sistema implementa operaciones CRUD completas, validaciones de datos, relaciones entre tablas mediante claves foráneas y un sistema de autenticación mediante middleware.

## 🌐 URL en producción

```
https://api-videojuegos-pk7v.onrender.com
```

## 🔐 Autenticación
Todos los endpoints requieren el siguiente header:

```
password: 1234
```

## 🗄️ Modelo de datos (Diagrama ER)

### 🧩 Tablas del sistema
- **usuarios** — id, nombre, email (UNIQUE)
- **juegos** — id, nombre, genero, precio (CHECK > 0)
- **compras** — id, usuario_id (FK), fecha
- **detalle_compras** — id, compra_id (FK), juego_id (FK)
- **resenias** — id, usuario_id (FK), juego_id (FK), comentario, calificacion (CHECK 1-5)

### 🔗 Relaciones
- Un usuario puede realizar muchas compras
- Una compra pertenece a un usuario
- Una compra puede tener varios juegos (detalle_compras)
- Un usuario puede hacer reseñas
- Un juego puede tener múltiples reseñas

## 🚀 Endpoints

### 👤 Usuarios
```
GET    /usuarios
GET    /usuarios/:id
POST   /usuarios
PUT    /usuarios/:id
DELETE /usuarios/:id
```

### 🎮 Juegos
```
GET    /juegos
GET    /juegos/:id
POST   /juegos
PUT    /juegos/:id
DELETE /juegos/:id
```

### 🧾 Compras
```
GET    /compras
GET    /compras/:id
POST   /compras
PUT    /compras/:id
DELETE /compras/:id
```

### 🔗 Detalle Compras
```
GET    /detalle
GET    /detalle/:id
POST   /detalle
PUT    /detalle/:id
DELETE /detalle/:id
```

### ⭐ Reseñas
```
GET    /resenias
GET    /resenias/:id
POST   /resenias
PUT    /resenias/:id
DELETE /resenias/:id
```

## 🔎 Filtros dinámicos
Todos los endpoints GET de lista soportan filtros por cualquier campo vía query params:

```
GET /usuarios?nombre=Juan
GET /juegos?genero=RPG
GET /compras?usuario_id=1
GET /detalle?compra_id=2
GET /resenias?calificacion=5
```

## 🧪 Ejemplo de uso

### Crear un usuario
```
POST /usuarios
```
Body:
```json
{
  "nombre": "Juan",
  "email": "juan@email.com"
}
```

### Crear un juego
```
POST /juegos
```
Body:
```json
{
  "nombre": "The Witcher 3",
  "genero": "RPG",
  "precio": 59.99
}
```

### Crear una reseña
```
POST /resenias
```
Body:
```json
{
  "usuario_id": 1,
  "juego_id": 1,
  "comentario": "Excelente juego",
  "calificacion": 5
}
```

## ⚙️ Tecnologías utilizadas
- Node.js
- Express
- SQLite3
- dotenv
- Nodemon

## 🧠 Validaciones implementadas
- Campos obligatorios (NOT NULL)
- Validación de tipos de datos
- Validación de unicidad (email)
- Validación de claves foráneas antes de INSERT/UPDATE
- Restricciones CHECK en base de datos (precio > 0, calificación 1-5)

## 🔐 Seguridad
- Middleware de autenticación global
- Uso de variables de entorno (.env)
- Exclusión de datos sensibles con .gitignore

## 💻 Instrucciones para ejecutar el proyecto localmente

### 1. Clonar repositorio
```
git clone https://github.com/Samuel-Osorio-Dev/guia-final-teo.git
```

### 2. Instalar dependencias
```
npm install
```

### 3. Crear archivo .env
```
PORT=3000
API_PASSWORD=1234
```

### 4. Ejecutar en desarrollo
```
npm run dev
```

## 📊 Respuestas de la API
La API responde en formato JSON con códigos HTTP adecuados:
- `200 OK`
- `201 Created`
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `500 Internal Server Error`
