# Dependencias del Backend

Lista completa de paquetes utilizados en `apps/backend` con su propósito.

---

## Producción (dependencies) — 12 paquetes

| Paquete | Versión | Categoría | Para qué sirve |
|---------|:-------:|-----------|----------------|
| `express` | ^5.2.1 | Framework HTTP | Creación de rutas, middlewares, controladores y manejo de peticiones/respuestas |
| `@prisma/client` | ^7.8.0 | ORM | Cliente generado por Prisma para consultas tipadas a la base de datos |
| `@prisma/adapter-pg` | ^7.8.0 | ORM | Adaptador que conecta Prisma 7 con PostgreSQL |
| `prisma` | ^7.8.0 | ORM | CLI de Prisma: migraciones, `prisma generate`, `prisma validate` |
| `pg` | ^8.22.0 | Base de Datos | Driver nativo de PostgreSQL para Node.js |
| `zod` | ^4.4.3 | Validación | Esquemas de validación de datos en TypeScript |
| `bcryptjs` | ^3.0.3 | Seguridad | Cifrado de contraseñas mediante hash + salt (10 rondas) |
| `jsonwebtoken` | ^9.0.3 | Autenticación | Generación y verificación de tokens JWT |
| `cloudinary` | ^2.10.0 | Archivos | SDK de Cloudinary para subir y eliminar imágenes en la nube |
| `multer` | ^2.2.0 | Archivos | Middleware Express para procesar formularios multipart (subida de archivos) |
| `cors` | ^2.8.6 | HTTP | Middleware que permite peticiones desde orígenes cruzados (CORS) |
| `dotenv` | ^17.4.2 | Configuración | Carga variables de entorno desde archivo `.env` a `process.env` |

---

## Desarrollo (devDependencies) — 9 paquetes

| Paquete | Versión | Para qué sirve |
|---------|:-------:|----------------|
| `typescript` | ^6.0.3 | Compilador de TypeScript a JavaScript |
| `tsx` | ^4.22.4 | Ejecuta archivos TypeScript directamente sin compilar (watch mode) |
| `@types/node` | ^26.0.1 | Definiciones de tipos para Node.js |
| `@types/express` | ^5.0.6 | Definiciones de tipos para Express |
| `@types/cors` | ^2.8.19 | Definiciones de tipos para cors |
| `@types/bcryptjs` | ^2.4.6 | Definiciones de tipos para bcryptjs |
| `@types/jsonwebtoken` | ^9.0.10 | Definiciones de tipos para jsonwebtoken |
| `@types/multer` | ^2.1.0 | Definiciones de tipos para multer |
| `@types/pg` | ^8.20.0 | Definiciones de tipos para pg (PostgreSQL) |

---

## Total: 21 paquetes

- Producción: 12
- Desarrollo: 9
- Sin dependencias del frontend aún (React + Vite se añadirán en `apps/frontend-public` y `apps/frontend-admin`)

---

## Cómo se instalaron

```bash
# Dependencias de producción
npm install express @prisma/client @prisma/adapter-pg prisma pg zod bcryptjs jsonwebtoken cloudinary multer cors dotenv

# Dependencias de desarrollo
npm install -D typescript tsx @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/multer @types/pg
```
