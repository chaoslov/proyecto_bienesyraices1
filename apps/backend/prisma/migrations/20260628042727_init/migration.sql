-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('asesor', 'admin');

-- CreateEnum
CREATE TYPE "TipoPropiedad" AS ENUM ('casa', 'departamento', 'terreno', 'local', 'oficina');

-- CreateEnum
CREATE TYPE "TipoTransaccion" AS ENUM ('venta', 'alquiler');

-- CreateEnum
CREATE TYPE "EstadoPropiedad" AS ENUM ('activa', 'pausada', 'vendida', 'alquilada');

-- CreateEnum
CREATE TYPE "TipoMensaje" AS ENUM ('contacto', 'venta');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asesor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "foto" TEXT,
    "especialidad" TEXT,
    "descripcion" TEXT,
    "añosExperiencia" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asesor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Propiedad" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "tipoPropiedad" "TipoPropiedad" NOT NULL,
    "tipoTransaccion" "TipoTransaccion" NOT NULL,
    "habitaciones" INTEGER,
    "banios" INTEGER,
    "parqueos" INTEGER,
    "metrajeTotal" DOUBLE PRECISION,
    "metrajeConstruido" DOUBLE PRECISION,
    "estado" "EstadoPropiedad" NOT NULL DEFAULT 'activa',
    "destacada" BOOLEAN NOT NULL DEFAULT false,
    "asesorId" TEXT NOT NULL,
    "ubicacionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Propiedad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "id" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "sector" TEXT,
    "ciudad" TEXT NOT NULL DEFAULT 'Guayaquil',
    "provincia" TEXT NOT NULL DEFAULT 'Guayas',
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imagen" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "propiedadId" TEXT NOT NULL,

    CONSTRAINT "Imagen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "mensaje" TEXT NOT NULL,
    "tipo" "TipoMensaje" NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "archivado" BOOLEAN NOT NULL DEFAULT false,
    "propiedadId" TEXT,
    "asesorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mensaje_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Asesor_userId_key" ON "Asesor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Propiedad_ubicacionId_key" ON "Propiedad"("ubicacionId");

-- AddForeignKey
ALTER TABLE "Asesor" ADD CONSTRAINT "Asesor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propiedad" ADD CONSTRAINT "Propiedad_asesorId_fkey" FOREIGN KEY ("asesorId") REFERENCES "Asesor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propiedad" ADD CONSTRAINT "Propiedad_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagen" ADD CONSTRAINT "Imagen_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_asesorId_fkey" FOREIGN KEY ("asesorId") REFERENCES "Asesor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
