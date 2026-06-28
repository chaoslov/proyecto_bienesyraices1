# Diagrama de Clases — Alpha Inmobiliaria

**Proyecto:** Alpha Inmobiliaria
**Arquitectura:** Hexagonal (Puertos y Adaptadores)
**ORM:** Prisma 7 + PostgreSQL

---

## Enums

```mermaid
classDiagram
    class Rol {
        asesor
        admin
    }

    class TipoPropiedad {
        casa
        departamento
        terreno
        local
        oficina
    }

    class TipoTransaccion {
        venta
        alquiler
    }

    class EstadoPropiedad {
        activa
        pausada
        vendida
        alquilada
    }

    class TipoMensaje {
        contacto
        venta
    }
```

---

## Entidades del Dominio

```mermaid
classDiagram
    class User {
        +id: String
        +email: String
        +password: String
        +rol: Rol
        +activo: Boolean
        +createdAt: DateTime
        +updatedAt: DateTime
    }

    class Asesor {
        +id: String
        +userId: String
        +nombre: String
        +telefono: String
        +foto: String
        +especialidad: String
        +descripcion: String
        +aniosExperiencia: Integer
        +createdAt: DateTime
        +updatedAt: DateTime
    }

    class Propiedad {
        +id: String
        +titulo: String
        +descripcion: String
        +precio: Float
        +tipoPropiedad: TipoPropiedad
        +tipoTransaccion: TipoTransaccion
        +habitaciones: Integer
        +banios: Integer
        +parqueos: Integer
        +metrajeTotal: Float
        +metrajeConstruido: Float
        +estado: EstadoPropiedad
        +destacada: Boolean
        +asesorId: String
        +ubicacionId: String
        +createdAt: DateTime
        +updatedAt: DateTime
    }

    class Ubicacion {
        +id: String
        +direccion: String
        +sector: String
        +ciudad: String
        +provincia: String
        +latitud: Float
        +longitud: Float
    }

    class Imagen {
        +id: String
        +url: String
        +publicId: String
        +orden: Integer
        +propiedadId: String
    }

    class Mensaje {
        +id: String
        +nombre: String
        +email: String
        +telefono: String
        +mensaje: String
        +tipo: TipoMensaje
        +leido: Boolean
        +archivado: Boolean
        +propiedadId: String
        +asesorId: String
        +createdAt: DateTime
        +updatedAt: DateTime
    }

    User "1" --> "0..1" Asesor : tiene
    Asesor "1" --> "*" Propiedad : gestiona
    Asesor "1" --> "*" Mensaje : recibe
    Propiedad "1" --> "1" Ubicacion : tiene
    Propiedad "1" --> "*" Imagen : contiene
    Propiedad "1" --> "*" Mensaje : recibe
    Mensaje "0..1" --> "1" Propiedad : sobre
```

---

## Repositorios (Puertos)

```mermaid
classDiagram
    class IUserRepository {
        <<interface>>
        + findAll()
        + findById(id)
        + findByEmail(email)
        + create(data)
        + update(id, data)
        + delete(id)
    }

    class IAsesorRepository {
        <<interface>>
        + findAll()
        + findById(id)
        + findByUserId(userId)
        + create(data)
        + update(id, data)
        + delete(id)
    }

    class IPropiedadRepository {
        <<interface>>
        + findAll(filtros)
        + findById(id)
        + findByAsesorId(asesorId)
        + create(data)
        + update(id, data)
        + delete(id)
        + findDestacadas()
        + countByAsesorId(asesorId)
    }

    class IUbicacionRepository {
        <<interface>>
        + findAll()
        + findById(id)
        + create(data)
        + update(id, data)
        + delete(id)
    }

    class IImagenRepository {
        <<interface>>
        + findAllByPropiedadId(propiedadId)
        + findById(id)
        + create(data)
        + createMany(data)
        + update(id, data)
        + delete(id)
        + reorder(propiedadId, orden)
    }

    class IMensajeRepository {
        <<interface>>
        + findAllByAsesorId(asesorId)
        + findById(id)
        + create(data)
        + marcarLeido(id)
        + archivar(id)
        + countNoLeidos(asesorId)
        + delete(id)
    }
```

---

## Servicios (Casos de Uso)

```mermaid
classDiagram
    class AuthService {
        + login(email, password)
        + register(data)
        + verificarToken(token)
        + cambiarPassword(userId, oldPwd, newPwd)
    }

    class PropiedadService {
        + listar(filtros)
        + obtenerPorId(id)
        + obtenerPorAsesor(asesorId)
        + crear(data)
        + actualizar(id, data)
        + eliminar(id)
        + destacar(id)
        + cambiarEstado(id, estado)
    }

    class AsesorService {
        + listar()
        + obtenerPorId(id)
        + crear(data)
        + actualizar(id, data)
        + eliminar(id)
        + actualizarFoto(id, fotoUrl)
    }

    class MensajeService {
        + enviar(data)
        + listarPorAsesor(asesorId)
        + marcarLeido(id)
        + archivar(id)
        + obtenerNoLeidos(asesorId)
        + eliminar(id)
        + enviarEmail(mensaje)
    }

    class ImagenService {
        + subir(propiedadId, archivo)
        + subirMultiples(propiedadId, archivos)
        + eliminar(id)
        + reordenar(propiedadId, orden)
    }

    class UbicacionService {
        + crear(data)
        + actualizar(id, data)
        + buscarPorSector(sector)
        + geocodificar(direccion)
    }
```

---

## DTOs (Data Transfer Objects)

```mermaid
classDiagram
    class CreatePropiedadRequest {
        +titulo: String
        +descripcion: String
        +precio: Number
        +tipoPropiedad: TipoPropiedad
        +tipoTransaccion: TipoTransaccion
        +habitaciones: Number
        +banios: Number
        +parqueos: Number
        +metrajeTotal: Number
        +metrajeConstruido: Number
        +ubicacion: CreateUbicacionDTO
    }

    class UpdatePropiedadRequest {
        +titulo: String
        +descripcion: String
        +precio: Number
        +tipoPropiedad: TipoPropiedad
        +tipoTransaccion: TipoTransaccion
        +habitaciones: Number
        +banios: Number
        +parqueos: Number
        +estado: EstadoPropiedad
        +destacada: Boolean
        +ubicacion: UpdateUbicacionDTO
    }

    class PropiedadResponse {
        +id: String
        +titulo: String
        +descripcion: String
        +precio: Number
        +tipoPropiedad: String
        +tipoTransaccion: String
        +habitaciones: Number
        +banios: Number
        +parqueos: Number
        +estado: String
        +destacada: Boolean
        +asesor: AsesorResumenDTO
        +ubicacion: UbicacionResponse
        +imagenes: ImagenResponse[]
        +createdAt: String
    }

    class CreateAsesorRequest {
        +nombre: String
        +email: String
        +password: String
        +telefono: String
        +foto: String
        +especialidad: String
        +descripcion: String
        +aniosExperiencia: Number
        +rol: Rol
    }

    class AsesorResponse {
        +id: String
        +nombre: String
        +email: String
        +telefono: String
        +foto: String
        +especialidad: String
        +descripcion: String
        +aniosExperiencia: Number
        +rol: String
        +propiedadesCount: Number
        +mensajesNoLeidos: Number
    }

    class LoginRequest {
        +email: String
        +password: String
    }

    class AuthResponse {
        +token: String
        +usuario: AsesorResponse
    }

    class CreateMensajeRequest {
        +nombre: String
        +email: String
        +telefono: String
        +mensaje: String
        +tipo: TipoMensaje
        +propiedadId: String
        +asesorId: String
    }

    class CreateUbicacionDTO {
        +direccion: String
        +sector: String
        +ciudad: String
        +provincia: String
        +latitud: Number
        +longitud: Number
    }
```

---

## Arquitectura Hexagonal (Flujo por Capas)

```mermaid
classDiagram
    class PropiedadController {
        + listar()
        + obtenerPorId()
        + crear()
        + actualizar()
        + eliminar()
    }

    class PropiedadService {
        + listar(filtros)
        + obtenerPorId(id)
        + crear(data)
        + actualizar(id, data)
        + eliminar(id)
    }

    class IPropiedadRepository {
        <<interface>>
        + findAll(filtros)
        + findById(id)
        + create(data)
        + update(id, data)
        + delete(id)
    }

    class PropiedadRepository {
        + findAll(filtros)
        + findById(id)
        + create(data)
        + update(id, data)
        + delete(id)
    }

    class PrismaClient {
        + propiedad
        + ubicacion
        + imagen
        + asesor
        + user
        + mensaje
    }

    PropiedadController --> PropiedadService : usa
    PropiedadService --> IPropiedadRepository : depende (puerto)
    IPropiedadRepository <|.. PropiedadRepository : implementa (adaptador)
    PropiedadRepository --> PrismaClient : consulta DB
```

---

## Tabla de Relaciones

| Entidad A | Cardinalidad | Entidad B | Descripcion |
|---|---|---|---|
| User | 1 -- 0..1 | Asesor | Un usuario puede tener perfil de asesor o no |
| Asesor | 1 -- N | Propiedad | Un asesor gestiona muchas propiedades |
| Asesor | 1 -- N | Mensaje | Un asesor recibe muchos mensajes |
| Propiedad | 1 -- 1 | Ubicacion | Cada propiedad tiene una ubicacion unica |
| Propiedad | 1 -- N | Imagen | Una propiedad tiene muchas imagenes |
| Propiedad | 1 -- N | Mensaje | Una propiedad recibe muchos mensajes |
| Mensaje | N -- 1 | Asesor | Muchos mensajes pertenecen a un asesor |
| Mensaje | N -- 0..1 | Propiedad | Muchos mensajes pueden referir a una propiedad |

---

## Validaciones por Entidad

| Entidad | Campo | Validacion |
|---|---|---|
| User | email | Formato email valido, unico en DB |
| User | password | Min 8 caracteres, hash bcrypt |
| Asesor | nombre | No vacio, max 100 caracteres |
| Asesor | telefono | Formato valido (+593, 09...) |
| Propiedad | precio | Numero positivo, mayor a 0 |
| Propiedad | titulo | No vacio, max 200 caracteres |
| Propiedad | habitaciones | Entero no negativo |
| Mensaje | nombre | No vacio |
| Mensaje | email | Formato email valido |
| Mensaje | mensaje | Min 10 caracteres |
| Ubicacion | latitud | Rango -90 a 90 |
| Ubicacion | longitud | Rango -180 a 180 |
| Imagen | url | URL valida de Cloudinary |
