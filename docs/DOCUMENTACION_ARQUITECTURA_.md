# Documentación de archivos — Frontend y Backend
  
---
  
## FRONTEND — `apps/frontend-public/src/`
  
### `application/hooks/`
  
| Archivo | Qué hace |
|---|---|
| **useDebounce.ts** | Hook genérico que retrasa la actualización de un valor hasta que el usuario deja de escribir (por defecto 500ms). Útil para inputs de búsqueda que llaman a la API. |
| **useFiltros.ts** | Hook que conecta el store de propiedades con la lógica de filtros. Expone `propiedades`, `filtros`, `setFiltros`, `aplicarFiltros` y `limpiarFiltros` para ser usados en componentes de catálogo. |
  
### `application/store/`
  
| Archivo | Qué hace |
|---|---|
| **asesorStore.ts** | Store Zustand que maneja la lista de asesores, el asesor seleccionado, loading y error. Tiene `fetchAsesores()` que llama a la API (`AsesorApi.listar()`). |
| **propiedadStore.ts** | Store Zustand que maneja propiedades, filtros, paginación, loading y error. Expone `fetchPropiedades()`, `fetchDestacadas()`, `fetchPorId()`, filtrado local y limpieza de filtros. |
| **uiStore.ts** | Store Zustand minimalista con dos booleanos: `sidebarAbierto` y `panelAbierto`, más sus toggle/open/close. Controla el sidebar y panel del layout. |
  
### `domain/entities/`
  
| Archivo | Qué hace |
|---|---|
| **Asesor.ts** | Interfaz que define la estructura de un asesor: id, nombre, apellido, email, teléfono, fotografía, especialidad, descripción, experiencia, fechas. |
| **Propiedad.ts** | Interfaz `Ubicacion` (dirección, sector, ciudad, lat/lng) e interfaz `Propiedad` (id, título, descripción, precio, tipo, características, imágenes, ubicación, asesorId, fechas). |
  
### `presentation/components/layout/`
  
| Archivo | Qué hace |
|---|---|
| **Footer.tsx** | Componente de pie de página con branding "Alpha Inmobiliaria", teléfono, email y enlaces a redes sociales. Fondo oscuro `#1A252F`. |
| **LayoutPublico.tsx** | Layout principal de la app pública. Renderiza `Navbar` > `<main>` con `<Outlet/>` (React Router) > `Footer` > `ChatBot` > `AsesorSidebar`. |
| **Navbar.tsx** | Barra de navegación responsiva con enlaces a inicio, catálogo, asesores, vender. Incluye botón de login, menú hamburguesa para móvil, y avatar de usuario cuando está autenticado. |
  
### `shared/`
  
| Archivo | Qué hace |
|---|---|
| **constants/ecuador.ts** | Exporta `PROVINCIAS_ECUADOR` — un array constante de tipo `readonly string[]` con las 24 provincias del Ecuador. Usado en formularios y filtros. |
| **utils/whatsapp.ts** | Exporta `buildWhatsAppLink(phone, message)` que genera un enlace `wa.me` con el código de país de Ecuador (+593) y el mensaje URL-encodado. |
  
### `presentation/components/ui/`
  
| Archivo | Qué hace |
|---|---|
| **Botones.tsx** | Componente `Button` reutilizable con variantes (`primary`, `outline`, `danger`, `ghost`), tamaños (`pq`, `md`, `grd`) y estado `loading` que muestra un spinner. |
| **Entrada.tsx** | Componente `Input` con `forwardRef` que envuelve un `<input>` nativo. Acepta `label` y `error` para renderizar etiqueta y mensaje de error. |
| **Modal.tsx** | Componente `Modal` con `isOpen`, `onClose`, `title` opcional y `children`. Bloquea el scroll del body cuando está abierto y renderiza un backdrop. |
  
### `presentation/pages/`
  
| Archivo | Qué hace |
|---|---|
| **public/PrincipalPage.tsx** | Página de inicio con hero banner, barra de búsqueda, mapa de propiedades destacadas y grid de tarjetas de propiedades. |
| **public/CatalogoPage.tsx** | Página de catálogo completo con filtros laterales, grid paginado de propiedades, paginación y mapa opcional. Lee/escribe parámetros URL para filtros compartibles. |
| **public/DetallePage.tsx** | Página de detalle de propiedad (`/propiedad/:id`). Muestra galería de imágenes, información completa, contacto del asesor (WhatsApp) y formulario de mensaje. |
| **public/AsesoresPage.tsx** | Página que lista todos los asesores en un grid de tarjetas, con buscador por nombre. |
| **public/PerfilAsesorPage.tsx** | Perfil individual de un asesor (`/asesor/:id`). Muestra foto, datos, especialidad, experiencia y lista de propiedades que gestiona. |
| **public/ServicioVentaPage.tsx** | Página "Vende tu propiedad" con formulario de contacto (nombre, email, teléfono, ciudad, tipo de propiedad, etc.). Al enviar usa `MensajeApi.enviarMensajeServicio()`. |
| **shared/ErrorPage.tsx** | Página 404 con "Ups! Página no encontrada" y botón para volver al inicio. |
  
---
  
## BACKEND — `apps/backend/src/`
  
### Arquitectura general de la API
  
```
Route → Controller → Service → Repository (Prisma) → PostgreSQL
```
  
### Controllers (manejan HTTP requests)
  
| Archivo | Qué hace |
|---|---|
| **infrastructure/controllers/PropiedadController.ts** | CRUD de propiedades + propiedades destacadas + propiedades del asesor + cambio de estado. |
| **infrastructure/controllers/MensajeController.ts** | CRUD de mensajes + listar admin/asesor + marcar leído/archivar/asignar/aceptar/rechazar. |
| **infrastructure/controllers/AsesorController.ts** | CRUD de asesores + listar público/admin + subir foto. |
| **infrastructure/controllers/AuthController.ts** | Login (POST) y validación de token (GET /me). |
| **infrastructure/controllers/ImagenController.ts** | Subir imágenes (single/múltiples) y eliminar imágenes de propiedades. |
  
### Services (lógica de negocio)
  
| Archivo | Qué hace |
|---|---|
| **application/services/PropiedadService.ts** | Lógica de propiedades: listar con filtros, buscar destacadas, CRUD con verificación de propietario, borrado en cascada de imágenes. |
| **application/services/MensajeService.ts** | Lógica de mensajes: crear (público), listar por asesor/admin, marcar leído, archivar, asignar, aceptar/rechazar asignación. |
| **application/services/AsesorService.ts** | Lógica de asesores: listar público/admin, crear con hash de password, actualizar, eliminar (en cascada), subir foto a Cloudinary. |
| **application/services/AuthService.ts** | Autenticación: login (validar credenciales, generar JWT), obtener usuario actual. |
| **application/services/ImagenService.ts** | Subir imágenes a Cloudinary, crear registros en BD, eliminar de Cloudinary + BD, borrado masivo por propiedad. |
| **application/services/AuthorizationService.ts** | Verifica que el usuario autenticado sea dueño del recurso (o admin). |
| **application/services/validate.ts** | Helper que envuelve la validación con Zod y lanza error si falla. |
| **application/services/AppError.ts** | Clase de error personalizada con código HTTP y detalles opcionales. |
  
### Repositories (acceso a BD con Prisma)
  
| Archivo | Qué hace |
|---|---|
| **infrastructure/repositories/PropiedadRepository.ts** | Consultas Prisma a `propiedades`: findAll con filtros dinámicos y paginación, findById, findDestacadas, CRUD completo. |
| **infrastructure/repositories/MensajeRepository.ts** | Consultas Prisma a `mensajes`: CRUD, filtros por asesor/admin, conteo de no leídos. |
| **infrastructure/repositories/AsesorRepository.ts** | Consultas Prisma a `asesores`: CRUD con transacciones (User + Asesor), findAll público (excluye admins). |
| **infrastructure/repositories/UserRepository.ts** | Consultas Prisma a `usuarios`: findByEmail, findById (incluye asesor y admin). |
| **infrastructure/repositories/ImagenRepository.ts** | Consultas Prisma a `imagenes`: CRUD, createMany, delete por propiedad. |
  
### Auth & Middlewares
  
| Archivo | Qué hace |
|---|---|
| **infrastructure/auth/JwtTokenService.ts** | Firma y verifica JWTs con expiración de 7 días. |
| **infrastructure/auth/BcryptPasswordHasher.ts** | Hashea contraseñas con bcryptjs (10 rondas) y las compara. |
| **infrastructure/middlewares/authMiddleware.ts** | `requireAuth` (valida token Bearer), `requireRol` (restringe por rol), `getAsesorId` (extrae ID del request). |
| **infrastructure/middlewares/errorHandler.ts** | Manejador global de errores Express: formatea errores Zod, AppError y errores inesperados. |
| **infrastructure/middlewares/upload.ts** | Configuración Multer para subida de archivos (imágenes en memoria). |
| **infrastructure/middlewares/validateId.ts** | Helper `getId()` que extrae y valida el ID de los parámetros de ruta. |
  
### Infraestructura adicional
  
| Archivo | Qué hace |
|---|---|
| **infrastructure/cloudinary/config.ts** | Configura el SDK de Cloudinary con credenciales de entorno. |
| **infrastructure/cloudinary/CloudinaryUploadService.ts** | Sube archivos a Cloudinary via stream y elimina por public ID. |
| **infrastructure/database/prisma.ts** | Cliente Prisma singleton para toda la app. |
| **infrastructure/routes/propiedad.routes.ts** | Wirea endpoints `/api/propiedades*` > PropiedadController. |
| **infrastructure/routes/mensaje.routes.ts** | Wirea endpoints `/api/mensajes*` > MensajeController. |
| **infrastructure/routes/asesor.routes.ts** | Wirea endpoints `/api/asesores*` > AsesorController. |
| **infrastructure/routes/auth.routes.ts** | Wirea endpoints `/api/auth/*` > AuthController. |
| **infrastructure/routes/imagen.routes.ts** | Wirea endpoints `/api/propiedades/:id/imagenes*` + `/api/imagenes/:id` > ImagenController. |
| **server.ts** | Punto de entrada: monta CORS, JSON parser, las 5 rutas bajo `/api`, health-check y error handler. Puerto 3000. |
  
### Mapeo frontend → backend (qué usa cada página)
  
| Página frontend | Endpoints backend que consume |
|---|---|
| `PrincipalPage` | `GET /api/propiedades/destacadas` |
| `CatalogoPage` | `GET /api/propiedades?filtros...` |
| `DetallePage` | `GET /api/propiedades/:id`, `POST /api/mensajes` |
| `AsesoresPage` | `GET /api/asesores` |
| `PerfilAsesorPage` | `GET /api/asesores/:id`, `GET /api/propiedades?asesorId=...` |
| `ServicioVentaPage` | `POST /api/mensajes`, `GET /api/asesores` |
| `LoginPage` (privado) | `POST /api/auth/login` |
| `authStore.checkAuth` | `GET /api/auth/me` |
  