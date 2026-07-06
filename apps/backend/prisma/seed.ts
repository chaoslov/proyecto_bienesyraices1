import 'dotenv/config'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import bcrypt from 'bcryptjs'

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🗑️  Limpiando datos existentes...')
  await prisma.mensaje.deleteMany()
  await prisma.imagen.deleteMany()
  await prisma.propiedad.deleteMany()
  await prisma.ubicacion.deleteMany()
  await prisma.asesor.deleteMany()
  await prisma.user.deleteMany()

  console.log('🔑 Creando usuarios y asesores...')
  const password = await bcrypt.hash('123456', 10)

  // Admin
  const adminUser = await prisma.user.create({
    data: { email: 'admin@alpha.com', password, rol: 'admin' },
  })

  // Asesores
  const asesoresData = [
    { email: 'juan@alpha.com', nombre: 'Juan Pérez', telefono: '0991234567', especialidad: 'Ventas de lujo', experiencia: 8, foto: 'https://geobienes-files.nyc3.digitaloceanspaces.com/1776351466280.webp', descripcion: 'Especialista en propiedades de alta gama con más de 8 años en el mercado inmobiliario de Guayaquil.' },
    { email: 'ana@alpha.com', nombre: 'Ana López', telefono: '0997654321', especialidad: 'Residencial', experiencia: 5, foto: 'https://geobienes-files.nyc3.digitaloceanspaces.com/1776702684557.webp', descripcion: 'Apasionada por ayudar a familias a encontrar el hogar perfecto. Experta en zonas residenciales.' },
    { email: 'carlos@alpha.com', nombre: 'Carlos Ruiz', telefono: '0991122334', especialidad: 'Terrenos y proyectos', experiencia: 10, foto: 'https://geobienes-files.nyc3.digitaloceanspaces.com/1775581756005.webp', descripcion: 'Más de 10 años asesorando en terrenos y proyectos de construcción en toda la provincia.' },
    { email: 'maria@alpha.com', nombre: 'María García', telefono: '0999988776', especialidad: 'Alquileres temporales', experiencia: 3, foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', descripcion: 'Joven asesora enfocada en alquileres temporales y corporativos en el centro de la ciudad.' },
  ]

  const asesores = []
  for (const a of asesoresData) {
    const user = await prisma.user.create({
      data: { email: a.email, password, rol: 'asesor' },
    })
    const asesor = await prisma.asesor.create({
      data: {
        userId: user.id,
        nombre: a.nombre,
        telefono: a.telefono,
        foto: a.foto,
        especialidad: a.especialidad,
        descripcion: a.descripcion,
        añosExperiencia: a.experiencia,
      },
    })
    asesores.push(asesor)
  }

  console.log(`✅ ${asesores.length} asesores creados`)

  console.log('🏠 Creando propiedades...')

  const propiedadesData = [
    {
      titulo: 'Casa de lujo en Urdesa',
      descripcion: 'Hermosa casa de 3 plantas con piscina, jardín y acabados de lujo. Amplios espacios con vista panorámica al río. Ideal para familia ejecutiva.',
      precio: 250000,
      tipoPropiedad: 'casa' as const,
      tipoTransaccion: 'venta' as const,
      habitaciones: 3, banios: 2, parqueos: 2, metrajeTotal: 280, metrajeConstruido: 220,
      destacada: true, estado: 'activa' as const,
      asesorIdx: 0,
      direccion: 'Av. Principal 123 y 3ra', sector: 'Urdesa', ciudad: 'Guayaquil', lat: -2.203, lng: -79.897,
      imagenes: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      ],
    },
    {
      titulo: 'Departamento frente al río',
      descripcion: 'Moderno departamento con vista al río, 2 habitaciones y balcón. Edificio con seguridad 24h, piscina y gimnasio.',
      precio: 180000,
      tipoPropiedad: 'departamento' as const,
      tipoTransaccion: 'venta' as const,
      habitaciones: 2, banios: 1, parqueos: 1, metrajeTotal: 90, metrajeConstruido: 85,
      destacada: true, estado: 'activa' as const,
      asesorIdx: 0,
      direccion: 'Malecón 900 y Loja', sector: 'Centro', ciudad: 'Guayaquil', lat: -2.188, lng: -79.883,
      imagenes: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      ],
    },
    {
      titulo: 'Villa campestre en Samborondón',
      descripcion: 'Espectacular villa con piscina, cancha de tenis y amplios jardines. La mejor propiedad del sector.',
      precio: 320000,
      tipoPropiedad: 'casa' as const,
      tipoTransaccion: 'venta' as const,
      habitaciones: 4, banios: 3, parqueos: 3, metrajeTotal: 450, metrajeConstruido: 320,
      destacada: true, estado: 'activa' as const,
      asesorIdx: 1,
      direccion: 'Km 8 Vía Samborondón', sector: 'Samborondón', ciudad: 'Samborondón', lat: -2.100, lng: -79.940,
      imagenes: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      ],
    },
    {
      titulo: 'Oficina ejecutiva Malecón',
      descripcion: 'Oficina de 2 plantas con vista al río, ideal para empresa. Incluye recepción, sala de juntas y 3 despachos.',
      precio: 150000,
      tipoPropiedad: 'oficina' as const,
      tipoTransaccion: 'venta' as const,
      habitaciones: 2, banios: 1, parqueos: 2, metrajeTotal: 120, metrajeConstruido: 110,
      destacada: false, estado: 'activa' as const,
      asesorIdx: 2,
      direccion: 'Malecón Simón Bolívar 789', sector: 'Centro', ciudad: 'Guayaquil', lat: -2.195, lng: -79.886,
      imagenes: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1497366811356-3c2d9e45d6e6?w=800&h=600&fit=crop',
      ],
    },
    {
      titulo: 'Terreno urbanizable Las Garzas',
      descripcion: 'Terreno de 500m² listo para construir, cerca de centros comerciales y vías principales.',
      precio: 85000,
      tipoPropiedad: 'terreno' as const,
      tipoTransaccion: 'venta' as const,
      habitaciones: 0, banios: 0, parqueos: 0, metrajeTotal: 500, metrajeConstruido: 0,
      destacada: false, estado: 'activa' as const,
      asesorIdx: 2,
      direccion: 'Calle Las Garzas Mz 45', sector: 'Las Garzas', ciudad: 'Guayaquil', lat: -2.250, lng: -79.920,
      imagenes: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      ],
    },
    {
      titulo: 'Casa en alquiler Kennedy',
      descripcion: 'Casa de 3 habitaciones en el mejor sector de Kennedy. Cerca de universidades, centros comerciales y hospitales.',
      precio: 700,
      tipoPropiedad: 'casa' as const,
      tipoTransaccion: 'alquiler' as const,
      habitaciones: 3, banios: 2, parqueos: 1, metrajeTotal: 160, metrajeConstruido: 140,
      destacada: true, estado: 'activa' as const,
      asesorIdx: 1,
      direccion: 'Calle 3ra, Kennedy Norte', sector: 'Kennedy', ciudad: 'Guayaquil', lat: -2.170, lng: -79.910,
      imagenes: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop',
      ],
    },
    {
      titulo: 'Departamento amoblado Vía a la Costa',
      descripcion: 'Departamento de 2 habitaciones completamente amoblado, cerca de la vía a la Costa. Ideal para ejecutivos.',
      precio: 500,
      tipoPropiedad: 'departamento' as const,
      tipoTransaccion: 'alquiler' as const,
      habitaciones: 2, banios: 1, parqueos: 1, metrajeTotal: 75, metrajeConstruido: 70,
      destacada: false, estado: 'activa' as const,
      asesorIdx: 3,
      direccion: 'Vía a la Costa Km 5', sector: 'Vía a la Costa', ciudad: 'Guayaquil', lat: -2.210, lng: -79.860,
      imagenes: [
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop',
      ],
    },
    {
      titulo: 'Casa en Lirios del Sur',
      descripcion: 'Acogedora casa con jardín, 2 habitaciones y garaje. Perfecta para parejas jóvenes.',
      precio: 120000,
      tipoPropiedad: 'casa' as const,
      tipoTransaccion: 'venta' as const,
      habitaciones: 2, banios: 1, parqueos: 1, metrajeTotal: 100, metrajeConstruido: 85,
      destacada: false, estado: 'activa' as const,
      asesorIdx: 3,
      direccion: 'Calle Los Lirios 123', sector: 'Lirios del Sur', ciudad: 'Guayaquil', lat: -2.280, lng: -79.890,
      imagenes: [
        'https://images.unsplash.com/photo-1600585154525-990dced4db0d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      ],
    },
    {
      titulo: 'Local comercial Centro',
      descripcion: 'Local comercial de 80m² en pleno centro de la ciudad. Alta afluencia de público.',
      precio: 1200,
      tipoPropiedad: 'local' as const,
      tipoTransaccion: 'alquiler' as const,
      habitaciones: 1, banios: 1, parqueos: 0, metrajeTotal: 80, metrajeConstruido: 80,
      destacada: false, estado: 'activa' as const,
      asesorIdx: 0,
      direccion: 'Av. 9 de Octubre 456', sector: 'Centro', ciudad: 'Guayaquil', lat: -2.192, lng: -79.882,
      imagenes: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      ],
    },
    {
      titulo: 'Casa de playa en Villamil',
      descripcion: 'Hermosa casa frente al mar en Playas Villamil. 4 habitaciones, piscina y área de barbacoa.',
      precio: 350000,
      tipoPropiedad: 'casa' as const,
      tipoTransaccion: 'venta' as const,
      habitaciones: 4, banios: 3, parqueos: 2, metrajeTotal: 350, metrajeConstruido: 280,
      destacada: true, estado: 'activa' as const,
      asesorIdx: 1,
      direccion: 'Malecón de Villamil', sector: 'Playas', ciudad: 'General Villamil', lat: -2.631, lng: -80.388,
      imagenes: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      ],
    },
  ]

  let propCount = 0
  for (const p of propiedadesData) {
    const ubicacion = await prisma.ubicacion.create({
      data: {
        direccion: p.direccion,
        sector: p.sector,
        ciudad: p.ciudad,
        provincia: 'Guayas',
        latitud: p.lat,
        longitud: p.lng,
      },
    })

    const propiedad = await prisma.propiedad.create({
      data: {
        titulo: p.titulo,
        descripcion: p.descripcion,
        precio: p.precio,
        tipoPropiedad: p.tipoPropiedad,
        tipoTransaccion: p.tipoTransaccion,
        habitaciones: p.habitaciones,
        banios: p.banios,
        parqueos: p.parqueos,
        metrajeTotal: p.metrajeTotal,
        metrajeConstruido: p.metrajeConstruido,
        destacada: p.destacada,
        estado: p.estado,
        asesorId: asesores[p.asesorIdx].id,
        ubicacionId: ubicacion.id,
      },
    })

    for (let i = 0; i < p.imagenes.length; i++) {
      const publicId = `seed_${propCount}_${i}`
      await prisma.imagen.create({
        data: {
          url: p.imagenes[i],
          publicId,
          orden: i,
          propiedadId: propiedad.id,
        },
      })
    }

    propCount++
  }

  console.log(`✅ ${propCount} propiedades creadas con imágenes`)
  console.log('')
  console.log('🎉 Seed completado exitosamente!')
  console.log('')
  console.log('📧 Credenciales de prueba:')
  console.log('   Admin:  admin@alpha.com / 123456')
  console.log('   Asesor: juan@alpha.com / 123456')
  console.log('   Asesor: ana@alpha.com / 123456')
  console.log('   Asesor: carlos@alpha.com / 123456')
  console.log('   Asesor: maria@alpha.com / 123456')
}

main()
  .catch((e) => {
    console.error('Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
