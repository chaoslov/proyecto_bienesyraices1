# TT-004: CRUD de Propiedades

**Responsable:** Yandri Alcivar
**Sprint:** 1 — Primera Impresión y Navegación
**Estimación:** 5 puntos
**Estado:** ✅ Completado

---

## Objetivo

Implementar el CRUD completo (Crear, Leer, Actualizar, Eliminar) de la entidad Propiedad, siguiendo la arquitectura hexagonal con DTOs, validaciones, puertos, repositorios, servicios, controladores y rutas.

---

## Archivos creados

| Archivo | Capa | Propósito |
|---|---|---|
| `application/dtos/requests/CreatePropiedadRequest.ts` | DTO | Interface para crear propiedad |
| `application/dtos/requests/UpdatePropiedadRequest.ts` | DTO | Interface para actualizar propiedad |
| `application/dtos/requests/FiltrosPropiedadRequest.ts` | DTO | Interface para filtros de búsqueda |
| `application/dtos/responses/PropiedadResponse.ts` | DTO | Interface de respuesta |
| `application/validations/propiedad.validation.ts` | Validación | Schemas Zod con reglas de negocio |
| `application/services/PropiedadService.ts` | Servicio | Casos de uso con validación y lógica |
| `domain/ports/IPropiedadRepository.ts` | Puerto | Interface del repositorio |
| `infrastructure/repositories/PropiedadRepository.ts` | Adaptador | Implementación Prisma con filtros |
| `infrastructure/controllers/PropiedadController.ts` | Controlador | Handlers Express |
| `infrastructure/routes/propiedad.routes.ts` | Rutas | Definición de endpoints |
| `infrastructure/middlewares/validateId.ts` | Middleware | Helper para `req.params.id` |

---

## Endpoints implementados

| Método | Ruta | Controlador | Descripción |
|---|---|---|---|
| `GET` | `/api/propiedades` | `listar` | Listar con filtros (precio, tipo, transacción, búsqueda, paginación) |
| `GET` | `/api/propiedades/destacadas` | `listarDestacadas` | Propuestas destacadas para el home |
| `GET` | `/api/propiedades/:id` | `obtenerPorId` | Detalle completo con ubicación, imágenes y asesor |
| `POST` | `/api/propiedades` | `crear` | Crear propiedad + ubicación |
| `PUT` | `/api/propiedades/:id` | `actualizar` | Actualizar propiedad + ubicación |
| `DELETE` | `/api/propiedades/:id` | `eliminar` | Eliminar propiedad |
| `PATCH` | `/api/propiedades/:id/estado` | `cambiarEstado` | Cambiar estado (activa/pausada/vendida/alquilada) |

---

## Validaciones (Zod)

### createPropiedadSchema

| Campo | Regla |
|---|---|
| `titulo` | String, min 1, max 200 |
| `descripcion` | String, min 1 |
| `precio` | Número positivo |
| `tipoPropiedad` | Enum: casa, departamento, terreno, local, oficina |
| `tipoTransaccion` | Enum: venta, alquiler |
| `habitaciones` | Entero no negativo (opcional) |
| `banios` | Entero no negativo (opcional) |
| `parqueos` | Entero no negativo (opcional) |
| `metrajeTotal` | Número positivo (opcional) |
| `metrajeConstruido` | Número positivo (opcional) |
| `destacada` | Boolean (opcional) |
| `asesorId` | String UUID |
| `ubicacion.direccion` | String, min 1 |
| `ubicacion.latitud` | Número entre -90 y 90 |
| `ubicacion.longitud` | Número entre -180 y 180 |

---

## Flujo de una petición (POST /api/propiedades)

```
Cliente
  │ POST /api/propiedades { titulo, precio, ... }
  ▼
PropiedadController.crear(req, res)
  │
  ▼
PropiedadService.crear(data)
  │ validar con Zod (createPropiedadSchema.parse)
  │
  ▼
PropiedadRepository.create(data)
  │ Prisma: propiedad.create({ data: { ...propiedad, ubicacion: { create: ... } } })
  │ include: imagenes, ubicacion, asesor
  ▼
Respuesta JSON con PropiedadResponse
```

---

## Filtros disponibles en GET /api/propiedades

| Query param | Tipo | Ejemplo |
|---|---|---|
| `precioMin` | number | `?precioMin=50000` |
| `precioMax` | number | `?precioMax=200000` |
| `tipoPropiedad` | string | `?tipoPropiedad=casa` |
| `tipoTransaccion` | string | `?tipoTransaccion=venta` |
| `habitaciones` | number | `?habitaciones=3` |
| `asesorId` | string (UUID) | `?asesorId=uuid` |
| `estado` | string | `?estado=activa` |
| `destacada` | boolean | `?destacada=true` |
| `busqueda` | string | `?busqueda=Urdesa` |
| `page` | number (default 1) | `?page=2` |
| `limit` | number (default 20, max 100) | `?limit=10` |

---

## Comandos ejecutados

```powershell
# 1. Instalar Zod
cd apps/backend
npm install zod

# 2. Crear archivos (DTOs, validaciones, puerto, repositorio, servicio, controlador, rutas, middleware)

# 3. Probar
npm run dev
# GET http://localhost:3000/api/propiedades → {"data":[],"total":0,"page":1,"limit":20}

# 4. Subir a GitHub
git checkout -b feature/yandri-tt-004-crud-propiedades
git add .
git commit -m "TT-004: CRUD de Propiedades"
git push origin feature/yandri-tt-004-crud-propiedades
# PR → merge → git checkout main → git pull origin main
```

---

## Problemas encontrados

### TypeScript: `req.params.id` inferido como `string | string[]`
**Solución:** Crear middleware `validateId.ts` con función `getId(req)` que usa `String(req.params.id)` para garantizar el tipo `string`.

### ZodError: propiedad `errors` no existe
**Solución:** Usar `error.issues` en lugar de `error.errors` — Zod usa `issues` para reportar errores de validación.

---

## Próximos pasos

- **TT-005:** CRUD de Asesores (mismo patrón que TT-004)
- **TT-006:** API de Mensajes + Cloudinary
