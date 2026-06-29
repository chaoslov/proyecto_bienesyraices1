# TT-005: CRUD de Asesores

## Descripción
Implementación del CRUD completo de la entidad Asesor con arquitectura hexagonal (Controller → Service → Repository → Prisma). Incluye validación Zod, relación 1:1 con User (transacción), y cifrado de contraseñas con bcrypt.

## Endpoints

### 1. POST /api/asesores — Crear asesor

**Request:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "12345678",
  "telefono": "809-555-0101"
}
```

**Response (201 Created):**
```json
{
  "id": "3e4856b4-ae0a-419f-ab32-ded06dd11d0c",
  "userId": "483b0039-9683-457b-89b6-178a41ab5dff",
  "nombre": "Juan Pérez",
  "telefono": "809-555-0101",
  "foto": null,
  "especialidad": null,
  "descripcion": null,
  "añosExperiencia": null,
  "createdAt": "2026-06-28T18:16:44.892Z",
  "updatedAt": "2026-06-28T18:16:44.892Z",
  "user": {
    "email": "juan@example.com",
    "rol": "asesor"
  }
}
```

### 2. GET /api/asesores — Listar todos

**Request:** Sin body

**Response (200 OK):**
```json
[
  {
    "id": "3e4856b4-ae0a-419f-ab32-ded06dd11d0c",
    "userId": "483b0039-9683-457b-89b6-178a41ab5dff",
    "nombre": "Juan Pérez",
    "telefono": "809-555-0101",
    "foto": null,
    "especialidad": null,
    "descripcion": null,
    "añosExperiencia": null,
    "createdAt": "2026-06-28T18:16:44.892Z",
    "updatedAt": "2026-06-28T18:16:44.892Z",
    "user": { "email": "juan@example.com", "rol": "asesor", "activo": true },
    "_count": { "propiedades": 0, "mensajes": 0 }
  }
]
```

### 3. GET /api/asesores/:id — Obtener por ID

**Request:** Sin body

**Response (200 OK):**
```json
{
  "id": "3e4856b4-ae0a-419f-ab32-ded06dd11d0c",
  "userId": "483b0039-9683-457b-89b6-178a41ab5dff",
  "nombre": "Juan Pérez",
  "telefono": "809-555-0101",
  "foto": null,
  "especialidad": null,
  "descripcion": null,
  "añosExperiencia": null,
  "createdAt": "2026-06-28T18:16:44.892Z",
  "updatedAt": "2026-06-28T18:16:44.892Z",
  "user": { "email": "juan@example.com", "rol": "asesor", "activo": true },
  "_count": { "propiedades": 0, "mensajes": 0 }
}
```

### 4. PUT /api/asesores/:id — Actualizar asesor

**Request:**
```json
{
  "nombre": "Juan Pérez Actualizado",
  "telefono": "809-555-0202",
  "especialidad": "Casas de lujo"
}
```

**Response (200 OK):**
```json
{
  "id": "22efd242-f89b-4b22-99b1-434924a9ae1a",
  "userId": "98976d9a-1be2-42e7-a2f1-2ae665d679d4",
  "nombre": "Actualizado",
  "telefono": "809-000-0000",
  "foto": null,
  "especialidad": "Oficinas",
  "descripcion": null,
  "añosExperiencia": null,
  "createdAt": "2026-06-28T18:36:53.104Z",
  "updatedAt": "2026-06-28T18:39:31.536Z",
  "user": { "email": "puttest@example.com", "rol": "asesor" }
}
```

### 5. DELETE /api/asesores/:id — Eliminar asesor

**Request:** Sin body

**Response:** `204 No Content` (sin cuerpo)

---

## Flujo de arquitectura

```
Thunder Client
     ↓
  AsesorController.crear(req.body)     ← maneja status codes y errores Zod
     ↓
  AsesorService.crear(data)             ← valida con Zod, verifica duplicado, hashea password
     ↓
  AsesorRepository.create(data)         ← Transacción Prisma: crea User + Asesor
     ↓
  Prisma (PostgreSQL / Supabase)
```

## Consideraciones importantes

- **User + Asesor separados**: La creación usa `prisma.$transaction` — si falla algún paso, se revierte todo (evita usuarios huérfanos).
- **DELETE**: Elimina en orden: mensajes → propiedades → asesor → user (por las FK).
- **Password**: Se hashea con `bcryptjs` (10 salt rounds) antes de guardarse.
- **Validación Zod**: `password` mínimo 8 caracteres, `email` con formato válido. En `update` todos los campos son opcionales.
- **Campos solo de Asesor**: `update` solo modifica datos del perfil (nombre, teléfono, especialidad, etc.). Email/password se manejan en autenticación (Sprint 2).

## Archivos creados

| Archivo | Propósito |
|---------|-----------|
| `src/application/validations/asesor.validation.ts` | Esquemas Zod para create/update |
| `src/application/services/AsesorService.ts` | Lógica de negocio |
| `src/infrastructure/repositories/AsesorRepository.ts` | Implementación Prisma |
| `src/infrastructure/controllers/AsesorController.ts` | Handlers HTTP |
| `src/infrastructure/routes/asesor.routes.ts` | Definición de rutas |
| `src/infrastructure/middlewares/validateId.ts` | Helper `getId()` |

## Estado
- Sprint: 1
- Fecha: 28/06/2026
- Responsable: Yandri
- Verificado: ✅
