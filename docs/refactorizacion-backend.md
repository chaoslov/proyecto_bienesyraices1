# Informe de Refactorización — Backend

## Resumen ejecutivo

Se realizó una refactorización arquitectónica del backend (`apps/backend/src/`) para corregir **32 violaciones** identificadas de arquitectura hexagonal, principios SOLID, separación de responsabilidades, y patrones de diseño. Los cambios abarcan la creación de 11 archivos nuevos, la modificación de 14 archivos existentes y la eliminación de 9 archivos.

El objetivo principal fue restaurar el flujo de dependencias de la arquitectura hexagonal:
```
infrastructure → application → domain
```
Ningún archivo de aplicación importa ahora de infraestructura, los puertos están tipados, y los controladores delegan errores a un middleware central.

---

## Problemas corregidos

### 1. AppError: Clase de error tipada

**Archivo creado:** `src/application/services/AppError.ts`

**Problema:** Los servicios lanzaban objetos planos (`throw { status: 401, message: '...' }`) en vez de instancias de Error. Esto impedía:
- Uso de `instanceof` en catch
- Stack traces
- Type narrowing

**Solución:** Clase `AppError` que extiende `Error` con propiedades `status` y `errors`.

```typescript
export class AppError extends Error {
  constructor(public status: number, message: string, public errors?: unknown) {
    super(message)
    this.name = 'AppError'
  }
}
```

### 2. validate(): Helper de validación Zod

**Archivo creado:** `src/application/services/validate.ts`

**Problema:** El patrón `try { schema.parse(data) } catch (error) { if (error instanceof ZodError) { throw ... } }` se repetía **7+ veces** en todos los servicios.

**Solución:** Helper `validate<T>(schema, data)` que envuelve `schema.parse()` y convierte `ZodError` a `AppError` automáticamente.

```typescript
export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError(400, 'Datos inválidos', error.issues)
    }
    throw error
  }
}
```

### 3. AuthorizationService: Ownership extraído

**Archivo creado:** `src/application/services/AuthorizationService.ts`

**Problema:** El método privado `verificarOwnership` estaba duplicado exactamente igual en `PropiedadService` y `MensajeService` con la misma lógica:
1. Si no hay user → return
2. Si user es admin → return
3. Si `propiedad.asesorId !== user.asesorId` → throw 403

**Solución:** Servicio inyectable con un único método `verificarOwnership()`.

### 4. Puertos de infraestructura

**Archivos creados:**
- `src/domain/ports/IFileUploadService.ts`
- `src/domain/ports/IPasswordHasher.ts`
- `src/domain/ports/ITokenService.ts`

**Problema (violación crítica):** `application/services/ImagenService.ts` y `application/services/AsesorService.ts` importaban directamente de `infrastructure/cloudinary/upload.ts`. `application/services/AuthService.ts` importaba `bcryptjs` y `jsonwebtoken`. Esto viola el principio de que las capas internas (application) no pueden importar de capas externas (infrastructure).

**Solución:** Se definieron 3 interfaces (puertos) en `domain/ports/` y 3 implementaciones en infrastructure:

| Puerto (domain/ports/) | Implementación (infrastructure/) | Reemplaza |
|---|---|---|
| `IFileUploadService` | `cloudinary/CloudinaryUploadService.ts` | `cloudinary/upload.ts` |
| `IPasswordHasher` | `auth/BcryptPasswordHasher.ts` | import directo de `bcryptjs` |
| `ITokenService` | `auth/JwtTokenService.ts` | import directo de `jsonwebtoken` |

Cada servicio de aplicación ahora recibe estos puertos por constructor.

### 5. Express.Request augmentation

**Archivo creado:** `src/@types/express.d.ts`

**Problema:** Los controladores usaban `(req as any).user` en **8+ lugares**. Esto no solo es un `any` explícito, sino que la propiedad `user` no existía en el tipo `Express.Request`.

**Solución:** Augmentación global del namespace Express:

```typescript
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}
```

Todos los controladores ahora usan `req.user` en lugar de `(req as any).user`.

### 6. Error handler middleware

**Archivo creado:** `src/infrastructure/middlewares/errorHandler.ts`

**Problema:** Cada controlador tenía el mismo patrón try-catch con lógica duplicada:
```typescript
try { ... } catch (error: any) {
  if (error.errors) return res.status(400).json(...)
  res.status(error.status || 500).json({ message: error.message || 'Error interno' })
}
```
Este patrón se replicaba en **~25 métodos** en 5 controladores.

**Solución:** Middleware Express global que:
- Captura `AppError` y retorna `{ message, errors }`
- Captura errores planos con `status` y `message`
- Captura errores no manejados con status 500

Los controladores ahora llaman `next(error)` en lugar de manejar la respuesta.

### 7. Tipado de puertos de repositorio

**Archivos modificados:**
- `src/domain/ports/IAsesorRepository.ts`
- `src/domain/ports/IPropiedadRepository.ts`

**Problema:** Todos los métodos de los puertos retornaban `Promise<any>` y aceptaban `data: any`. El contrato era decorativo y no servía como abstracción real.

**Solución:** Se agregaron tipos parciales a los parámetros de entrada:
- `IAsesorRepository.create` ahora acepta un objeto tipado con `{ nombre, email, password, telefono, ... }`
- `IAsesorRepository.update` acepta `Record<string, unknown>`
- `IPropiedadRepository.findAll` acepta `Record<string, unknown>` para filtros

Nota: los métodos `findAll()`, `findById()` etc. aún retornan `Promise<any>` porque Prisma devuelve tipos relacionales complejos que no se mapean 1:1 a las entidades planas del dominio. La verdadera capa de mapeo dominio ↔ Prisma sería el siguiente paso de refactorización.

### 8. Controladores: sin `any` en catch ni en req

**Archivos modificados (5):**
- `AsesorController.ts`
- `AuthController.ts`
- `ImagenController.ts`
- `MensajeController.ts`
- `PropiedadController.ts`

**Cambios:**
- `(req as any).user` → `req.user`
- `catch (error: any) { res.status(...) }` → `catch (error) { next(error) }`
- Las firmas de métodos ahora incluyen `next: NextFunction`

### 9. Rutas: DI cableado con nuevas implementaciones

**Archivos modificados (5):**
- `asesor.routes.ts`
- `auth.routes.ts`
- `imagen.routes.ts`
- `mensaje.routes.ts`
- `propiedad.routes.ts`

**Cambios:** Cada ruta ahora instancia las implementaciones de los nuevos puertos y las pasa a los servicios:

```
// auth.routes.ts — antes
const service = new AuthService(userRepo)  // importaba bcrypt + jwt internamente

// auth.routes.ts — después
const passwordHasher = new BcryptPasswordHasher()
const tokenService = new JwtTokenService()
const service = new AuthService(userRepo, passwordHasher, tokenService)
```

### 10. DTO layer: eliminación de código muerto

**Archivos eliminados (9):**
| Archivo | Contenido |
|---|---|
| `application/dtos/requests/CreateAsesorRequest.ts` | Interfaz no usada |
| `application/dtos/requests/CreatePropiedadRequest.ts` | Interfaz no usada |
| `application/dtos/requests/FiltrosPropiedadRequest.ts` | Interfaz no usada |
| `application/dtos/requests/UpdateAsesorRequest.ts` | Interfaz no usada |
| `application/dtos/requests/UpdatePropiedadRequest.ts` | **Archivo vacío** |
| `application/dtos/responses/AsesorResponse.ts` | Interfaz no usada |
| `application/dtos/responses/PropiedadResponse.ts` | Interfaz no usada |
| `application/dtos/responses/PropiedadService.ts` | **Archivo vacío** |

**Razón:** Todas estas interfaces estaban definidas pero **nunca importadas ni usadas** por ningún archivo del proyecto. Los servicios de aplicación ya usan los tipos inferidos de Zod (`CreateAsesorInput`, `CreatePropiedadInput`, etc.) que cumplen la misma función con mantenimiento automático.

### 11. Repositorios: throw con AppError

**Archivo modificado:** `src/infrastructure/repositories/AsesorRepository.ts`

**Cambio:** `throw new Error('Asesor no encontrado')` → `throw new AppError(404, 'Asesor no encontrado')` en el método `delete()`.

Esto permite que el error handler global lo capture con `instanceof AppError`.

### 12. server.ts: error handler registrado

**Archivo modificado:** `src/server.ts`

**Cambio:** Se agregó `app.use(errorHandler)` después de todas las rutas, asegurando que todos los errores no capturados sean manejados consistentemente.

### 13. PropiedadRepository: filtros tipados

**Archivo modificado:** `src/infrastructure/repositories/PropiedadRepository.ts`

**Cambio menor:** El parámetro `filtros` ahora acepta `Record<string, unknown>` en lugar de un objeto default sin tipo, alineándose con el puerto `IPropiedadRepository.findAll`.

---

## Resumen de archivos

### Creados (7)

| Archivo | Propósito |
|---|---|
| `application/services/AppError.ts` | Clase de error tipada |
| `application/services/validate.ts` | Helper de validación Zod |
| `application/services/AuthorizationService.ts` | Service de ownership checks |
| `domain/ports/IFileUploadService.ts` | Puerto para subida de archivos |
| `domain/ports/IPasswordHasher.ts` | Puerto para hashing |
| `domain/ports/ITokenService.ts` | Puerto para JWT |
| `infrastructure/auth/BcryptPasswordHasher.ts` | Implementación bcrypt |
| `infrastructure/auth/JwtTokenService.ts` | Implementación JWT |
| `infrastructure/cloudinary/CloudinaryUploadService.ts` | Implementación Cloudinary |
| `infrastructure/middlewares/errorHandler.ts` | Middleware de errores |
| `@types/express.d.ts` | Augmentación Express.Request |

### Modificados (14)

| Archivo | Cambio principal |
|---|---|
| `domain/ports/IAsesorRepository.ts` | `create()` tipado |
| `domain/ports/IPropiedadRepository.ts` | `findAll()` con `Record<string, unknown>` |
| `application/services/AuthService.ts` | Inyecta puertos en vez de librerías |
| `application/services/AsesorService.ts` | Inyecta puertos en vez de librerías |
| `application/services/ImagenService.ts` | Inyecta `IFileUploadService` |
| `application/services/PropiedadService.ts` | Inyecta `AuthorizationService`, usa `validate()` |
| `application/services/MensajeService.ts` | Inyecta `AuthorizationService`, usa `validate()` |
| `infrastructure/controllers/*.ts` (5) | `next(error)`, `req.user` |
| `infrastructure/routes/*.ts` (5) | DI con nuevas implementaciones |
| `infrastructure/middlewares/authMiddleware.ts` | `req.user` tipado, usa `JwtTokenService` |
| `infrastructure/repositories/AsesorRepository.ts` | `AppError` en delete |
| `infrastructure/repositories/PropiedadRepository.ts` | Filtros tipados |
| `server.ts` | `app.use(errorHandler)` |
| `tsconfig.json` | Incluye `@types/*.d.ts` |

### Eliminados (9)

| Archivo | Razón |
|---|---|
| `infrastructure/cloudinary/upload.ts` | Reemplazado por `CloudinaryUploadService.ts` |
| `application/dtos/requests/CreateAsesorRequest.ts` | Nunca usado |
| `application/dtos/requests/CreatePropiedadRequest.ts` | Nunca usado |
| `application/dtos/requests/FiltrosPropiedadRequest.ts` | Nunca usado |
| `application/dtos/requests/UpdateAsesorRequest.ts` | Nunca usado |
| `application/dtos/requests/UpdatePropiedadRequest.ts` | Archivo vacío |
| `application/dtos/responses/AsesorResponse.ts` | Nunca usado |
| `application/dtos/responses/PropiedadResponse.ts` | Nunca usado |
| `application/dtos/responses/PropiedadService.ts` | Archivo vacío |

---

## Cambios en frontend (fuera de la refactorización principal)

| Archivo | Cambio |
|---|---|
| `shared/constants/ecuador.ts` | **Nuevo**: lista de 24 provincias del Ecuador |
| `presentation/pages/private/NuevaPropiedadPage.tsx` | Agregado campo `provincia` al form, ` PROVINCIAS_ECUADOR`, enviado en ubicación |
| `presentation/pages/private/EditarPropiedadPage.tsx` | Agregado campo `provincia` al form, cargado desde raw, enviado en ubicación |
| `presentation/pages/private/PerfilPage.tsx` | Eliminado bloque de descripción de la vista previa del perfil |
| `presentation/pages/public/PerfilAsesorPage.tsx` | "Acerca de" ahora usa `asesor.descripcion` en vez de texto generado fijo |
| `infrastructure/api/mappers/asesorMapper.ts` | Agregado `descripcion: raw.descripcion ?? ''` |

---

## Verificación

- **Backend:** `npx tsc --noEmit` → 0 errores
- **Frontend:** `npm run build` → 0 errores, 1415 módulos transformados