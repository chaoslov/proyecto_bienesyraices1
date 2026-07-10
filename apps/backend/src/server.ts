import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import express, { Request, Response } from 'express'
import cors from 'cors'
import prisma from './infrastructure/database/prisma'
import { propiedadRouter } from './infrastructure/routes/propiedad.routes'
import { asesorRouter } from './infrastructure/routes/asesor.routes'
import { mensajeRouter } from './infrastructure/routes/mensaje.routes'
import { imagenRouter } from './infrastructure/routes/imagen.routes'
import { authRouter } from './infrastructure/routes/auth.routes'
import { errorHandler } from './infrastructure/middlewares/errorHandler'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api', propiedadRouter)
app.use('/api', asesorRouter)
app.use('/api', mensajeRouter)
app.use('/api', imagenRouter)
app.use('/api', authRouter)
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: 'conectado', message: 'API Alpha Inmobiliaria funcionando' })
  } catch {
    res.status(500).json({ status: 'error', db: 'desconectado', message: 'Error de conexión a BD' })
  }
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

export default app