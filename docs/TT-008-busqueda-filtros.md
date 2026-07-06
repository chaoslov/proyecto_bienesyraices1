# TT-008: Búsqueda y Filtros Avanzados

## Descripción
Ampliación del endpoint `GET /api/propiedades` con nuevos filtros (baños, parqueos, sector, ciudad, metraje) y ordenamiento dinámico. Se agregó validación Zod sobre los filtros en el Service.

---

## Filtros Soportados

| Filtro | Tipo | Ejemplo |
|--------|------|---------|
| `precioMin` | number | `?precioMin=50000` |
| `precioMax` | number | `?precioMax=200000` |
| `tipoPropiedad` | string | `?tipoPropiedad=casa` |
| `tipoTransaccion` | enum | `?tipoTransaccion=venta` |
| `habitaciones` | number | `?habitaciones=3` |
| `banios` | number | `?banios=2` |
| `parqueos` | number | `?parqueos=1` |
| `sector` | string | `?sector=Centro` |
| `ciudad` | string | `?ciudad=Guayaquil` |
| `metrajeMin` | number | `?metrajeMin=100` |
| `metrajeMax` | number | `?metrajeMax=500` |
| `busqueda` | string | `?busqueda=casa moderna` |
| `asesorId` | uuid | `?asesorId=22efd242-...` |
| `estado` | string | `?estado=activa` |
| `destacada` | boolean | `?destacada=true` |
| `ordenarPor` | enum | `?ordenarPor=precio` |
| `ordenDireccion` | enum | `?ordenDireccion=asc` |
| `page` | number | `?page=1` (default 1) |
| `limit` | number | `?limit=20` (default 20, max 100) |

### Valores para `ordenarPor`
- `precio`
- `createdAt`
- `metrajeTotal`

### Valores para `ordenDireccion`
- `asc` — ascendente
- `desc` — descendente (default)

---

## Ejemplos de Uso

```bash
# Filtros básicos
GET /api/propiedades?tipoTransaccion=venta&habitaciones=3

# Filtros por precio con ordenamiento
GET /api/propiedades?precioMin=50000&precioMax=200000&ordenarPor=precio&ordenDireccion=asc

# Búsqueda por ubicación y baños
GET /api/propiedades?sector=Centro&banios=2&page=1&limit=10

# Búsqueda por texto
GET /api/propiedades?busqueda=casa&tipoPropiedad=casa

# Ordenamiento por fecha
GET /api/propiedades?ordenarPor=createdAt&ordenDireccion=desc
```

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/application/validations/propiedad.validation.ts` | +8 campos al `filtrosPropiedadSchema` (banios, parqueos, sector, ciudad, metrajeMin, metrajeMax, ordenarPor, ordenDireccion) |
| `src/application/services/PropiedadService.ts` | `listar()` ahora valida con `filtrosPropiedadSchema.parse()` antes de llamar al repositorio |
| `src/infrastructure/repositories/PropiedadRepository.ts` | Filtros expandidos (banios, parqueos, sector, ciudad, metrajeMin, metrajeMax) + `orderBy` dinámico |

---

## Pruebas Realizadas

| Consulta | Status | Resultado |
|----------|:------:|-----------|
| `?tipoTransaccion=venta` | ✅ 200 | 1 propiedad (Casa de Prueba) |
| `?tipoPropiedad=casa&ordenarPor=precio` | ✅ 200 | Ordenado por precio ascendente |
| `?sector=Inexistente&banios=2` | ✅ 200 | `[]` (0 resultados, sin error) |
| `?page=1&limit=5` | ✅ 200 | Paginación correcta |

---

## Estado

| Campo | Valor |
|-------|-------|
| Sprint | 1 |
| Fecha | 29/06/2026 |
| Responsable | Yandri |
| Verificado | ✅ |
