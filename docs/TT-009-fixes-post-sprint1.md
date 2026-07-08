# TT-009: Fixes y mejoras post-Sprint 1 (Yandri Alcivar)

## Fecha
07/07/2026

## Descripción
Correcciones aplicadas a cambios propuestos por Kelvin Moran en el backend. Se refactorizaron problemas de tipado (`any`), separación de responsabilidades (SRP), y se agregó funcionalidad faltante siguiendo la arquitectura hexagonal del proyecto.

## Archivos modificados

### 1. `UserRepository.ts`
**Cambio:** Se anidó `_count.propiedades` dentro del `include` de asesor.

```typescript
// Antes
include: { asesor: true }

// Después
include: { asesor: { include: { _count: { select: { propiedades: true } } } } }
```

**Afecta a:** `findByEmail` y `findById`.
**Motivo:** El frontend necesita `user.asesor._count.propiedades` en la respuesta de `checkAuth()`.

---

### 2. `PropiedadRepository.ts`
**Cambios:**

- **`findAll`:** Cuando NO se especifica `asesorId` (vista pública), se filtra por `estado: 'activa'` por defecto. Cuando hay `asesorId` (panel admin), se muestran todos los estados.

```typescript
if (asesorId) {
  where.asesorId = asesorId;
} else {
  where.estado = estado || 'activa';
}
```

- **`create`:** Se agregó `imagenes` a la desestructuración, con tipado `CreateImagenData[]` y uso de `{ create: imagenes }`.

- **`update`:** Se agregó `imagenes` a la desestructuración, con `{ deleteMany: {}, create: imagenes }` para reemplazar imágenes al editar.

**Importante:** Se importó `CreateImagenData` desde `domain/entities/Imagen` para mantener el tipado fuerte en lugar de usar `any`.

---

### 3. `PropiedadService.ts` (Refactor)
**Cambios:**

- **Nueva dependencia:** Ahora recibe `ImagenService` en el constructor (DI por constructor, alineado con hexagonal).
- **`eliminar`:** Antes de borrar la propiedad, llama a `this.imagenService.eliminarPorPropiedadId(id)` para eliminar las imágenes de Cloudinary y la BD.
- **Eliminado:** Se quitó el import directo de `cloudinary` (Kelvin lo había agregado en el servicio, rompiendo la arquitectura hexagonal).

**Motivo:** La eliminación de imágenes de Cloudinary es responsabilidad de `ImagenService`, no de `PropiedadService` (principio SRP).

---

### 4. `ImagenService.ts`
**Cambios:**

- **Reutilización:** Se reemplazó el método privado `subirACloudinary` por la función compartida `uploadToCloudinary` del nuevo archivo `infrastructure/cloudinary/upload.ts`.
- **Nuevo método `eliminarPorPropiedadId`:**

```typescript
async eliminarPorPropiedadId(propiedadId: string) {
  const imagenes = await this.repository.findAllByPropiedadId(propiedadId);
  if (imagenes.length === 0) return;

  const { default: cloudinary } = await import('../../infrastructure/cloudinary/config');
  await Promise.all(imagenes.map(img => cloudinary.uploader.destroy(img.publicId)));
  await Promise.all(imagenes.map(img => this.repository.delete(img.id)));
}
```

---

### 5. `PropiedadController.ts`
**Cambio:** Se agregó `console.error('Error al eliminar propiedad:', error)` en el catch del método `eliminar` para logging del error real.

---

### 6. `propiedad.routes.ts`
**Cambio:** Se agregó la inyección de `ImagenRepository` e `ImagenService` para pasarlos al `PropiedadService`.

---

### 7. `AsesorService.ts`
**Nuevo método `subirFoto`:**

```typescript
async subirFoto(id: string, file: Express.Multer.File) {
  const exists = await this.repository.findById(id);
  if (!exists) throw { status: 404, message: 'Asesor no encontrado' };

  const result = await uploadToCloudinary(file, 'alpha-inmobiliaria/asesores');
  return this.repository.update(id, { foto: result.secure_url });
}
```

**Endpoint:** `POST /api/asesores/:id/foto`
**Middleware:** `upload.single('foto')` (Multer memoryStorage)

---

### 8. `AsesorController.ts`
**Nuevo método `subirFoto`:** Recibe el archivo `req.file`, lo valida, y llama al servicio.

---

### 9. `asesor.routes.ts`
**Nueva ruta:**

```typescript
router.post('/asesores/:id/foto', upload.single('foto'), controller.subirFoto);
```

---

## Archivos creados

### 10. `infrastructure/cloudinary/upload.ts`
**Utilidad compartida** para subir archivos a Cloudinary. Extraída del método privado `subirACloudinary` de `ImagenService` para ser reutilizada por `AsesorService` y cualquier otro servicio futuro.

```typescript
import cloudinary from './config';

export function uploadToCloudinary(file: Express.Multer.File, folder = 'alpha-inmobiliaria') {
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result as { secure_url: string; public_id: string });
      },
    );
    stream.end(file.buffer);
  });
}
```

---

## Resumen de cambios vs propuesta de Kelvin

| Cambio | Kelvin (original) | Yandri (refactor) |
|--------|-------------------|-------------------|
| `UserRepository._count` | ✅ Correcto | ✅ Igual |
| `PropiedadRepository.estado` | ✅ Correcto | ✅ Igual |
| `PropiedadRepository.create/update imagenes` | Usaba `create: imagenes` crudo | Tipado con `CreateImagenData[]` |
| `PropiedadService.eliminar` | `import cloudinary` directo + `(exists as any).imagenes` | Inyecta `ImagenService`, tipado fuerte |
| `PropiedadService.eliminar` Cloudinary | Lógica inline en el servicio | Delegado a `ImagenService.eliminarPorPropiedadId` |
| `PropiedadController.console.error` | ✅ Correcto | ✅ Igual |
| `subirFoto` asesor | ✅ Correcto | ✅ Igual, pero reusa `uploadToCloudinary` |
| `uploadToCloudinary` | No existía (duplicado) | Utilidad compartida |

---

## Endpoints actualizados

| Método | Ruta | Cambio |
|--------|------|--------|
| `GET /api/propiedades` | Sin `asesorId` | Filtra por `estado: 'activa'` |
| `GET /api/propiedades` | Con `asesorId` | Muestra todos los estados |
| `POST /api/propiedades` | Con `imagenes[]` | Crea imágenes anidadas |
| `PUT /api/propiedades/:id` | Con `imagenes[]` | Reemplaza imágenes |
| `DELETE /api/propiedades/:id` | — | Elimina imágenes de Cloudinary + BD |
| `POST /api/asesores/:id/foto` | **NUEVO** | Sube foto de perfil a Cloudinary |
| `GET /api/auth/me` | — | Incluye `_count.propiedades` |
| `POST /api/auth/login` | — | Incluye `_count.propiedades` |
