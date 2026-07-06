# TT-006: API de Mensajes y Subida de Imágenes a Cloudinary

## Descripción
Implementación del CRUD de Mensajes y del sistema de subida de imágenes a Cloudinary, siguiendo la arquitectura hexagonal con inyección de dependencias.

---

## Parte 1: CRUD de Mensajes

### Endpoints

#### 1. POST /api/mensajes — Enviar mensaje (público)

**Request:**
```json
{
  "nombre": "Carlos Test",
  "email": "carlos@test.com",
  "telefono": "809-111-2233",
  "mensaje": "Hola, me interesa una propiedad en venta",
  "tipo": "contacto",
  "asesorId": "22efd242-f89b-4b22-99b1-434924a9ae1a"
}
```

**Response (201 Created):**
```json
{
  "id": "7db83e2a-6213-4434-b2de-0427d089fdf6",
  "nombre": "Carlos Test",
  "email": "carlos@test.com",
  "telefono": "809-111-2233",
  "mensaje": "Hola, me interesa una propiedad en venta",
  "tipo": "contacto",
  "leido": false,
  "archivado": false,
  "propiedadId": null,
  "asesorId": "22efd242-...",
  "createdAt": "2026-06-29T05:33:49.200Z",
  "updatedAt": "2026-06-29T05:33:49.200Z"
}
```

#### 2. GET /api/mensajes/asesor/:asesorId — Listar por asesor

**Request:** Sin body. Query params opcionales: `?leido=true&archivado=false`

**Response (200 OK):** Array de mensajes del asesor, ordenados por createdAt descendente.

#### 3. PATCH /api/mensajes/:id/leer — Marcar como leído

**Request:** Sin body

**Response (200 OK):** Mensaje actualizado con `leido: true`

#### 4. PATCH /api/mensajes/:id/archivar — Archivar mensaje

**Request:** Sin body

**Response (200 OK):** Mensaje actualizado con `archivado: true`

#### 5. DELETE /api/mensajes/:id — Eliminar mensaje

**Request:** Sin body

**Response:** `204 No Content`

### Validaciones (Zod)

| Campo | Regla |
|-------|-------|
| `nombre` | String, mínimo 1 caracter |
| `email` | Email válido |
| `telefono` | Opcional |
| `mensaje` | String, mínimo 10 caracteres |
| `tipo` | Enum: `contacto` o `venta` |
| `propiedadId` | Opcional, UUID |
| `asesorId` | UUID obligatorio |

---

## Parte 2: Subida de Imágenes a Cloudinary

### Configuración

**Cuenta Cloudinary:**
- Cloud Name: `dwgni4zdl`
- API Key: `153528717162138`
- API Secret: en variable de entorno `CLOUDINARY_API_SECRET` (`.env`)

**Archivo de configuración:** `src/infrastructure/cloudinary/config.ts`

**Middleware Multer:** `src/infrastructure/middlewares/upload.ts`
- Almacenamiento: `memoryStorage` (buffer, no escribe en disco)
- Límite: 5MB por archivo
- Formatos: JPEG, PNG, WebP

### Endpoints

#### 1. POST /api/propiedades/:id/imagenes — Subir 1 imagen

**Request:** `multipart/form-data` con campo `imagen` (file)

**Response (201 Created):**
```json
{
  "id": "cf05b8a0-65b5-4830-ba31-93fe59245eb9",
  "url": "https://res.cloudinary.com/dwgni4zdl/image/upload/...",
  "publicId": "alpha-inmobiliaria/...",
  "orden": 0,
  "propiedadId": "7b6977e8-..."
}
```

#### 2. POST /api/propiedades/:id/imagenes/multiples — Subir múltiples

**Request:** `multipart/form-data` con campo `imagenes[]` (files, máx 10)

**Response (201 Created):** Array de imágenes subidas

#### 3. DELETE /api/imagenes/:id — Eliminar imagen

**Request:** Sin body

**Acción:** Elimina de Cloudinary (uploader.destroy) + elimina registro en DB

**Response:** `204 No Content`

---

## Pruebas Realizadas

| Endpoint | Método | Status | Resultado |
|----------|--------|:------:|-----------|
| `/api/mensajes` | POST | ✅ 201 | Mensaje creado correctamente |
| `/api/mensajes/asesor/:id` | GET | ✅ 200 | Lista mensajes del asesor |
| `/api/mensajes/:id/leer` | PATCH | ✅ 200 | `leido: true` |
| `/api/mensajes/:id/archivar` | PATCH | ✅ 200 | `archivado: true` |
| `/api/mensajes/:id` | DELETE | ✅ 204 | Eliminado |
| `/api/propiedades/:id/imagenes` | POST | ✅ 201 | Imagen subida a Cloudinary |
| `/api/imagenes/:id` | DELETE | ✅ 204 | Pendiente de probar |

---

## Archivos Creados

| Archivo | Propósito |
|---------|-----------|
| `src/domain/ports/IMensajeRepository.ts` | Puerto para repositorio de mensajes |
| `src/domain/ports/IImagenRepository.ts` | Puerto para repositorio de imágenes |
| `src/application/validations/mensaje.validation.ts` | Esquema Zod para creación de mensajes |
| `src/application/services/MensajeService.ts` | Lógica de negocio de mensajes |
| `src/application/services/ImagenService.ts` | Lógica de subida a Cloudinary + DB |
| `src/infrastructure/repositories/MensajeRepository.ts` | Implementación Prisma de mensajes |
| `src/infrastructure/repositories/ImagenRepository.ts` | Implementación Prisma de imágenes |
| `src/infrastructure/controllers/MensajeController.ts` | Handlers HTTP de mensajes |
| `src/infrastructure/controllers/ImagenController.ts` | Handlers HTTP de imágenes |
| `src/infrastructure/routes/mensaje.routes.ts` | Rutas de mensajes con wiring DI |
| `src/infrastructure/routes/imagen.routes.ts` | Rutas de imágenes con wiring DI |
| `src/infrastructure/cloudinary/config.ts` | Configuración del SDK de Cloudinary |
| `src/infrastructure/middlewares/upload.ts` | Middleware Multer para subida de archivos |

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/server.ts` | Agregados `mensajeRouter` e `imagenRouter` |
| `apps/backend/.env` | Agregada variable `CLOUDINARY_API_SECRET` |

---

## Estado

| Campo | Valor |
|-------|-------|
| Sprint | 1 |
| Fecha | 29/06/2026 |
| Responsable | Yandri |
| Verificado | ✅ |
