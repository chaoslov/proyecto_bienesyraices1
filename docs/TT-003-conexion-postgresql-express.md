# TT-003: Conexión PostgreSQL y Servidor Express Base

**Responsable:** Yandri Alcivar
**Sprint:** 1 — Primera Impresión y Navegación
**Estimación:** 3 puntos
**Estado:** ✅ Completado

---

## Objetivo

Conectar el servidor Express con la base de datos PostgreSQL en Supabase usando Prisma ORM con driver adapter, verificar que la conexión funcione correctamente mediante un endpoint de salud.

---

## Tecnologías instaladas

| Paquete | Versión | Tipo | Propósito |
|---|---|---|---|
| `@prisma/client` | ^7.8.0 | Producción | Cliente ORM |
| `@prisma/adapter-pg` | ^7.8.0 | Producción | Driver adapter para PostgreSQL |
| `pg` | ^8.13 | Producción | Cliente nativo de PostgreSQL |
| `@types/pg` | ^8.11 | Desarrollo | Tipados de pg |

---

## Archivos creados/modificados

### `src/infrastructure/database/prisma.ts` (nuevo)

```typescript
import 'dotenv/config'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export default prisma
```

### `.env` — Variables de entorno

```
DATABASE_URL="postgresql://postgres.gvoglwotbfmcporpbiim:Crispin2302%40@db.gvoglwotbfmcporpbiim.supabase.co:5432/postgres"
DB_HOST=aws-1-us-east-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.gvoglwotbfmcporpbiim
DB_PASSWORD=Crispin2302@
```

**Nota:** Se usó el pooler de Supabase con el puerto 5432 después de activar el IPv4 add-on. La contraseña se pasa directamente (no URL-encodada) para evitar problemas de parsing con el carácter `@`.

### `src/server.ts` — Actualizado con health check a DB

```typescript
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import express, { Request, Response } from 'express'
import cors from 'cors'
import prisma from './infrastructure/database/prisma'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: 'conectado', message: 'API Alpha Inmobiliaria funcionando' })
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'desconectado', message: 'Error de conexión a BD' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

export default app
```

### `prisma/schema.prisma` — Configuración de migración

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

---

## Comandos ejecutados

```powershell
# 1. Instalar dependencias de adapter
cd apps/backend
npm install @prisma/adapter-pg pg
npm install -D @types/pg

# 2. Crear migración inicial (tablas en Supabase)
npx prisma migrate dev --name init

# 3. Regenerar cliente Prisma (después de cambios en schema)
npx prisma generate

# 4. Ejecutar servidor
npm run dev
```

---

## Problemas encontrados y soluciones

### Problema 1: Prisma 7 exige driver adapter
**Error:** `PrismaClient` necesita construirse con opciones no vacías.
**Solución:** Usar `@prisma/adapter-pg` con un pool de `pg`.

### Problema 2: Contraseña con `@` no se parsea en URL
**Error:** `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`
**Solución:** Pasar los parámetros de conexión por separado (host, port, database, user, password) en vez de usar `connectionString` con URL encoding.

### Problema 3: Variables de entorno no cargadas al importar prisma.ts
**Error:** Conexión fallaba porque `process.env` estaba vacío al crearse el pool.
**Solución:** 
- Agregar `import 'dotenv/config'` en `prisma.ts` para que las variables se carguen al importar el módulo
- Configurar `dotenv.config()` con `path.resolve()` en `server.ts`

### Problema 4: Host directo de Supabase no alcanzable
**Error:** `Can't reach database server at db.gvoglwotbfmcporpbiim.supabase.co`
**Solución:** Usar el host del pooler (`aws-1-us-east-1.pooler.supabase.com`) con puerto `5432` después de activar **IPv4 add-on** en Supabase.

---

## Verificación

Endpoint: `GET /api/health`

```
http://localhost:3000/api/health
```

Respuesta exitosa:
```json
{
  "status": "ok",
  "db": "conectado",
  "message": "API Alpha Inmobiliaria funcionando"
}
```

---

## Resumen del Sprint 1 completado

| TT | Estado | Descripción |
|---|---|---|
| TT-001 | ✅ | Configuración del monorepo |
| TT-002 | ✅ | Esquema Prisma y modelo de datos (7 entidades) |
| TT-003 | ✅ | Conexión PostgreSQL y servidor Express base |

### Próximos TTs

| TT | Descripción |
|---|---|
| TT-004 | CRUD de Propiedades |
| TT-005 | CRUD de Asesores |
| TT-006 | API de Mensajes + Cloudinary |
