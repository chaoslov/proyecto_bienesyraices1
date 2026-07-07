# Informe: Cambios necesarios en Backend — Datos del asesor en propiedades

**Para:** Yandri Alcívar (Backend)  
**De:** Johnny Choez (Frontend)  
**Fecha:** Julio 2026  
**Motivo:** El frontend necesita mostrar foto, especialidad y email del asesor asignado a cada propiedad en la página de detalle (`DetallePage.tsx`).

---

## 1. Problema actual

El endpoint `GET /api/propiedades/:id` devuelve el asesor con solo 3 campos:

```json
"asesor": {
  "id": "uuid",
  "nombre": "Carlos López",
  "telefono": "0991234567"
}
```

Faltan: `foto`, `especialidad` y `email`. Estos datos existen en la base de datos pero no se incluyen en la respuesta.

---

## 2. Causa raíz

En `apps/backend/src/infrastructure/repositories/PropiedadRepository.ts`, el método `findById` hace un `include` del asesor con un `select` limitado:

```typescript
// Línea 72 — estado actual
asesor: { select: { id: true, nombre: true, telefono: true } }
```

Además, el método `findAll` (línea 60) y los métodos `create`/`update` (líneas 101, 113) tienen el mismo `select` limitado.

El email está en la tabla `User`, no en `Asesor`. La relación es: `Asesor.userId → User.id`. Por eso hay que incluir también el `user` anidado.

---

## 3. Cambios requeridos

### 3.1. Repositorio — `PropiedadRepository.ts`

**Archivo:** `apps/backend/src/infrastructure/repositories/PropiedadRepository.ts`

**Cambiar el `select` del asesor** en los siguientes métodos:

#### `findById` (línea 72)
De:
```typescript
asesor: { select: { id: true, nombre: true, telefono: true } }
```
A:
```typescript
asesor: {
  select: {
    id: true,
    nombre: true,
    telefono: true,
    foto: true,
    especialidad: true,
    user: { select: { email: true } }
  }
}
```

#### `findAll` (línea 60) — mismo cambio
#### `create` (línea 101) — mismo cambio
#### `update` (línea 113) — mismo cambio

### 3.2. DTO de respuesta — `PropiedadResponse.ts`

**Archivo:** `apps/backend/src/application/dtos/responses/PropiedadResponse.ts`

Actualmente en la línea 15:
```typescript
asesor: { id: string; nombre: string; telefono: string }
```

Cambiar a:
```typescript
asesor: {
  id: string;
  nombre: string;
  telefono: string;
  foto: string | null;
  especialidad: string | null;
  user?: { email: string }
}
```

> **Nota:** El DTO actual no se usa en la cadena de respuesta (el controller devuelve el objeto crudo de Prisma), pero es buena práctica mantenerlo actualizado.

---

## 4. Respuesta esperada después del cambio

```json
{
  "id": "uuid-de-la-propiedad",
  "titulo": "Casa en Urdesa",
  "descripcion": "Hermosa casa de 3 habitaciones...",
  "precio": 150000,
  "tipoPropiedad": "casa",
  "tipoTransaccion": "venta",
  "habitaciones": 3,
  "banios": 2,
  "parqueos": 1,
  "estado": "activa",
  "asesor": {
    "id": "uuid-del-asesor",
    "nombre": "Carlos López",
    "telefono": "0991234567",
    "foto": "https://res.cloudinary.com/.../foto.jpg",
    "especialidad": "Ventas residenciales",
    "user": {
      "email": "carlos.lopez@inmobiliaria.com"
    }
  },
  "ubicacion": {
    "id": "uuid",
    "direccion": "Av. Principal 123",
    "sector": "Urdesa",
    "ciudad": "Guayaquil",
    "provincia": "Guayas",
    "latitud": -2.189,
    "longitud": -79.889
  },
  "imagenes": [
    { "id": "uuid", "url": "https://...", "orden": 0 }
  ],
  "createdAt": "2026-07-07T..."
}
```

> **Campos nuevos resaltados:** `asesor.foto`, `asesor.especialidad`, `asesor.user.email`

---

## 5. Notas adicionales

### 5.1. El frontend se adapta solo
Actualmente el frontend hace una llamada extra a `GET /api/asesores/:id` para obtener estos datos. Cuando implementes los cambios, mi código seguirá funcionando igual. Después puedo optimizarlo para leer los datos directamente de `propiedad.asesor`.

### 5.2. No rompe compatibilidad hacia atrás
Agregar campos nuevos a la respuesta no afecta a clientes existentes. El frontend ignora campos que no necesita.

### 5.3. Datos opcionales (nullable)
- `foto` puede ser `null` si el asesor no subió foto
- `especialidad` puede ser `null`
- El `email` viene de la tabla `User`, que siempre tiene email (campo `UNIQUE NOT NULL`)

### 5.4. Consideración de seguridad
El método `findById` actualmente incluye `mensajes: true` en el `include`. Esto devuelve todos los mensajes asociados a la propiedad, incluyendo datos internos como `leido`, `archivado`, `asesorId`. Para un endpoint público, considera excluir `mensajes` de la respuesta o limitar los campos expuestos.

---

## 6. Archivos a modificar (resumen)

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `apps/backend/src/infrastructure/repositories/PropiedadRepository.ts` | Ampliar `select` de asesor en `findById`, `findAll`, `create`, `update` |
| 2 | `apps/backend/src/application/dtos/responses/PropiedadResponse.ts` | Actualizar tipo del campo `asesor` |

Tiempo estimado: **15-30 minutos**

---

¿Dudas? Pregunta sin problema.
