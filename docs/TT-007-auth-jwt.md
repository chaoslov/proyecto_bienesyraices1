# TT-007: Autenticación JWT

## Descripción
Implementación del sistema de autenticación usando JSON Web Tokens (JWT) con login y middleware de protección de rutas. Sigue la arquitectura hexagonal con inyección de dependencias.

---

## Endpoints

### 1. POST /api/auth/login — Iniciar sesión

**Request:**
```json
{
  "email": "login@test.com",
  "password": "12345678"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "7ff47d36-008d-490d-b277-c4f94ce70f2b",
    "email": "login@test.com",
    "rol": "asesor",
    "activo": true,
    "createdAt": "2026-06-29T06:56:30.762Z",
    "updatedAt": "2026-06-29T06:56:30.762Z",
    "asesor": {
      "id": "846eabd1-...",
      "nombre": "Login Test",
      "telefono": "809-000-0000",
      "foto": null,
      "especialidad": null,
      "descripcion": null,
      "añosExperiencia": null
    }
  }
}
```

### 2. GET /api/auth/me — Obtener usuario actual

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):** Datos del usuario (sin password)

---

## Flujo de Autenticación

```
POST /api/auth/login { email, password }
  → AuthController.login(req.body)
    → AuthService.login(email, password)
      → loginSchema.parse(data)                    ← Zod validation
      → UserRepository.findByEmail(email)           ← User + Asesor
      → bcrypt.compare(password, user.password)     ← verifica hash
      → jwt.sign({ id, email, rol }, JWT_SECRET)    ← genera token (7 días)
    ← { token, user }
```

## Middleware de Protección

### requireAuth
Verifica que el request tenga un header `Authorization: Bearer <token>` válido. Si no, devuelve 401.

```typescript
// Uso en rutas protegidas:
router.post('/propiedades', requireAuth, controller.crear)
router.delete('/propiedades/:id', requireAuth, controller.eliminar)
```

### requireRol
Middleware que verifica que el usuario tenga un rol específico. Útil para rutas de administración.

```typescript
// Solo admin puede acceder:
router.get('/admin/dashboard', requireAuth, requireRol('admin'), dashboardController.obtener)
```

---

## Validaciones (Zod)

| Campo | Regla |
|-------|-------|
| `email` | Email válido |
| `password` | String, mínimo 1 caracter |

---

## Archivos Creados

| Archivo | Propósito |
|---------|-----------|
| `src/domain/ports/IUserRepository.ts` | Puerto para repositorio de usuarios |
| `src/infrastructure/repositories/UserRepository.ts` | Implementación Prisma |
| `src/application/validations/auth.validation.ts` | Schema Zod para login |
| `src/application/services/AuthService.ts` | Lógica de login, JWT, bcrypt |
| `src/infrastructure/controllers/AuthController.ts` | Handlers HTTP (login, me) |
| `src/infrastructure/routes/auth.routes.ts` | Rutas con wiring DI |
| `src/infrastructure/middlewares/authMiddleware.ts` | `requireAuth`, `requireRol` |

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/server.ts` | Agregado `authRouter` |
| `apps/backend/.env` | Agregada variable `JWT_SECRET` |

## Dependencias Nuevas

| Paquete | Versión |
|---------|---------|
| `jsonwebtoken` | ^9.x |
| `@types/jsonwebtoken` | ^9.x (dev) |

---

## Pruebas Realizadas

| Endpoint | Método | Status | Resultado |
|----------|--------|:------:|-----------|
| `/api/auth/login` (credenciales correctas) | POST | ✅ 200 | Token + usuario con asesor |
| `/api/auth/login` (credenciales incorrectas) | POST | ✅ 401 | "Credenciales inválidas" |
| `/api/auth/me` (token válido) | GET | ✅ 200 | Datos del usuario sin password |
| `/api/auth/me` (sin token) | GET | ✅ 401 | "Token no proporcionado" |
| `/api/auth/me` (token inválido) | GET | ✅ 401 | "Token inválido o expirado" |

---

## Estado

| Campo | Valor |
|-------|-------|
| Sprint | 1 |
| Fecha | 29/06/2026 |
| Responsable | Yandri |
| Verificado | ✅ |
