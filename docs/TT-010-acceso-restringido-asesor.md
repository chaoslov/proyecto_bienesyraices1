# TT-010: Acceso restringido por asesorId (US-020)

## Fecha
08/07/2026

## Responsable
Yandri Alcivar

## Descripción
Implementación de control de acceso basado en el asesor autenticado mediante JWT. Un asesor solo puede ver, crear, editar y eliminar sus propias propiedades y mensajes. Los administradores tienen acceso total.

## Cambios realizados

### 1. `AuthService.ts` — `asesorId` en JWT payload
Se agregó `asesorId` al payload del token JWT al iniciar sesión:

```typescript
const token = jwt.sign(
  { id: user.id, email: user.email, rol: user.rol, asesorId: user.asesor?.id || null },
  JWT_SECRET,
  { expiresIn: '7d' },
)
```

**Requisito:** `UserRepository.findByEmail` debe incluir `user.asesor.id` (✅ ya implementado en TT-009).

### 2. `authMiddleware.ts` — Nuevo helper `getAsesorId`
- Se agregó `asesorId: string | null` a la interfaz `TokenPayload`
- Nueva función `getAsesorId(req)`: extrae el `asesorId` del token JWT. Lanza error 403 si el usuario no es asesor.

```typescript
export function getAsesorId(req: Request): string {
  const user = (req as any).user as TokenPayload
  if (!user?.asesorId) {
    throw { status: 403, message: 'Acción solo para asesores' }
  }
  return user.asesorId
}
```

### 3. `PropiedadController.ts` — Inyección de asesorId desde JWT
| Método | Cambio |
|--------|--------|
| `crear` | `asesorId` se inyecta desde JWT, ignorando el body del cliente |
| `actualizar` | Recibe `user` del JWT para verificar ownership |
| `eliminar` | Recibe `user` del JWT para verificar ownership |
| `cambiarEstado` | Recibe `user` del JWT para verificar ownership |
| **`listarMias`** (NUEVO) | Llama a `service.listarMias(getAsesorId(req))` |

### 4. `PropiedadService.ts` — Ownership + nuevo método
**Nuevo método `listarMias`:**
```typescript
async listarMias(asesorId: string) {
  return this.repository.findAll({ asesorId })
}
```

**Nuevo método privado `verificarOwnership`:**
```typescript
private verificarOwnership(propiedad: any, user?: TokenPayload) {
  if (!user) return
  if (user.rol === 'admin') return
  if (propiedad.asesorId !== user.asesorId) {
    throw { status: 403, message: 'No tienes permisos sobre esta propiedad' }
  }
}
```

Se aplica en: `actualizar`, `eliminar`, `cambiarEstado`.

### 5. `propiedad.routes.ts` — Protección con `requireAuth`
```typescript
router.get('/propiedades/mias', requireAuth, controller.listarMias)  // NUEVA
router.post('/propiedades', requireAuth, controller.crear)
router.put('/propiedades/:id', requireAuth, controller.actualizar)
router.delete('/propiedades/:id', requireAuth, controller.eliminar)
router.patch('/propiedades/:id/estado', requireAuth, controller.cambiarEstado)
```

Las rutas públicas se mantienen sin cambios: `GET /propiedades`, `GET /propiedades/destacadas`, `GET /propiedades/:id`.

### 6. `MensajeController.ts` — JWT en vez de URL param
| Método | Cambio |
|--------|--------|
| ~~`listarPorAsesor`~~ | Eliminado (usaba `req.params.asesorId`) |
| **`listarMios`** (NUEVO) | Usa `getAsesorId(req)` del JWT |
| `marcarLeido` | Recibe `user` del JWT |
| `archivar` | Recibe `user` del JWT |
| `eliminar` | Recibe `user` del JWT |

### 7. `MensajeService.ts` — Ownership
Misma lógica de `verificarOwnership` que en PropiedadService, aplicada en `marcarLeido`, `archivar`, `eliminar`.

### 8. `mensaje.routes.ts` — Rutas protegidas
```typescript
// ANTES (público)
router.get('/mensajes/asesor/:asesorId', controller.listarPorAsesor)
router.patch('/mensajes/:id/leer', controller.marcarLeido)
router.patch('/mensajes/:id/archivar', controller.archivar)
router.delete('/mensajes/:id', controller.eliminar)

// DESPUÉS (protegido)
router.get('/mensajes', requireAuth, controller.listarMios)
router.patch('/mensajes/:id/leer', requireAuth, controller.marcarLeido)
router.patch('/mensajes/:id/archivar', requireAuth, controller.archivar)
router.delete('/mensajes/:id', requireAuth, controller.eliminar)
```

`POST /mensajes` se mantiene público para que los clientes puedan contactar sin autenticación.

## Endpoints finales

### Públicos (sin auth)
| Método | Ruta |
|--------|------|
| `GET` | `/api/propiedades` |
| `GET` | `/api/propiedades/destacadas` |
| `GET` | `/api/propiedades/:id` |
| `POST` | `/api/mensajes` |

### Protegidos (requieren JWT de asesor)
| Método | Ruta | Qué hace |
|--------|------|----------|
| `GET` | `/api/propiedades/mias` | Lista propiedades del asesor (todos los estados) |
| `POST` | `/api/propiedades` | Crea propiedad (asesorId del JWT) |
| `PUT` | `/api/propiedades/:id` | Edita solo si es su propiedad |
| `DELETE` | `/api/propiedades/:id` | Elimina solo si es su propiedad |
| `PATCH` | `/api/propiedades/:id/estado` | Cambia estado solo si es su propiedad |
| `GET` | `/api/mensajes` | Lista mensajes del asesor |
| `PATCH` | `/api/mensajes/:id/leer` | Marca leído solo si es su mensaje |
| `PATCH` | `/api/mensajes/:id/archivar` | Archiva solo si es su mensaje |
| `DELETE` | `/api/mensajes/:id` | Elimina solo si es su mensaje |

## Reglas de ownership
| Rol | ¿Puede ver todo? | ¿Puede modificar? |
|-----|:----------------:|:-----------------:|
| `admin` | ✅ Sí | ✅ Sí (todo) |
| `asesor` | ❌ Solo lo suyo | ❌ Solo lo suyo |
| Sin auth | ❌ Solo catálogo público | ❌ No |

## Archivos modificados (7)
- `src/application/services/AuthService.ts`
- `src/infrastructure/middlewares/authMiddleware.ts`
- `src/infrastructure/controllers/PropiedadController.ts`
- `src/application/services/PropiedadService.ts`
- `src/infrastructure/routes/propiedad.routes.ts`
- `src/infrastructure/controllers/MensajeController.ts`
- `src/application/services/MensajeService.ts`
- `src/infrastructure/routes/mensaje.routes.ts`

## Archivos afectados sin cambios
- `UserRepository.ts` — ya incluye `asesor.id` (✅ TT-009)
- `PropiedadRepository.ts` — ya filtra por `asesorId` (✅ TT-009)
- `MensajeRepository.ts` — ya filtra por `asesorId` (✅ desde TT-006)
