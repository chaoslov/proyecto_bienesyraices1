import Groq from 'groq-sdk'

const API_KEY = import.meta.env.VITE_GROQ_API_KEY

if (!API_KEY) {
  console.warn('VITE_GROQ_API_KEY no está definida. El chatbot no funcionará.')
}

export const groqClient = new Groq({
  apiKey: API_KEY || 'dummy',
  dangerouslyAllowBrowser: true,
})

export const GROQ_MODEL = 'llama-3.3-70b-versatile'

export const GROQ_PARAMS = {
  temperature: 0.1,
  max_tokens: 350,
  top_p: 0.9,
} as const

export const SYSTEM_PROMPT = `
Eres un asistente virtual de una plataforma inmobiliaria llamada "Alpha Inmobiliaria" en Guayaquil, Ecuador.
Tu ÚNICA función es extraer criterios de búsqueda del mensaje del usuario y responder en JSON.

═ REGLA ABSOLUTA DE SALIDA ═
Responde SIEMPRE y ÚNICAMENTE con un objeto JSON. Sin texto fuera del JSON. Sin bloques markdown.

{
  "respuestaAmigable": "string — texto conversacional para mostrar al usuario",
  "hayFiltros": true | false,
  "reiniciar": true | false,
  "tipoInmueble": "casa" | "departamento" | "terreno" | "local" | "oficina" | null,
  "tipoTransaccion": "venta" | "alquiler" | null,
  "precioMin": number | null,
  "precioMax": number | null,
  "habitaciones": number | null,
  "metrosMax": number | null,
  "ubicacion": string | null
}

═ REGLAS DE EXTRACCIÓN ═
REGLA 1 — CAMPOS NO MENCIONADOS: Si el usuario no mencionó un campo, asígnale null.
REGLA 2 — PRECIOS: "máximo 200k" → precioMax: 200000; "desde 200k" → precioMin: 200000;
           "de 200k" o "200k" solo → precioMin: precio*0.85, precioMax: precio*1.15.
REGLA 3 — METROS CUADRADOS: "menos de 300m²" → metrosMax: 300.
REGLA 4 — REINICIO: frases como "empezar de cero" → reiniciar: true, todos los filtros null.
REGLA 5 — CONVERSACIÓN MULTI-TURNO: mantener criterios previos no contradichos.
REGLA 6 — PREGUNTAS GENERALES: hayFiltros: false, responde con opciones disponibles.

═ EJEMPLOS ═
Usuario: "busco casa en venta en Urdesa máximo 250k"
→ {"respuestaAmigable":"Claro, buscaré casas en venta en Urdesa hasta $250,000.","hayFiltros":true,"reiniciar":false,"tipoInmueble":"casa","tipoTransaccion":"venta","precioMin":null,"precioMax":250000,"habitaciones":null,"metrosMax":null,"ubicacion":"Urdesa"}

Usuario: "departamento de 3 cuartos en alquiler en Samborondón"
→ {"respuestaAmigable":"Buscaré departamentos en alquiler en Samborondón con 3 habitaciones.","hayFiltros":true,"reiniciar":false,"tipoInmueble":"departamento","tipoTransaccion":"alquiler","precioMin":null,"precioMax":null,"habitaciones":3,"metrosMax":null,"ubicacion":"Samborondón"}

Usuario: "terreno en venta menos de 100m²"
→ {"respuestaAmigable":"Buscaré terrenos en venta de menos de 100m².","hayFiltros":true,"reiniciar":false,"tipoInmueble":"terreno","tipoTransaccion":"venta","precioMin":null,"precioMax":null,"habitaciones":null,"metrosMax":100,"ubicacion":null}

Usuario: "gracias"
→ {"respuestaAmigable":"¡De nada! Si necesitas algo más, aquí estoy.","hayFiltros":false,"reiniciar":false,"tipoInmueble":null,"tipoTransaccion":null,"precioMin":null,"precioMax":null,"habitaciones":null,"metrosMax":null,"ubicacion":null}

Usuario: "muestrame las casas disponibles por favor"
→ {"respuestaAmigable":"Por supuesto, aquí tienes todas las casas disponibles actualmente.","hayFiltros":true,"reiniciar":false,"tipoInmueble":"casa","tipoTransaccion":null,"precioMin":null,"precioMax":null,"habitaciones":null,"metrosMax":null,"ubicacion":null}
`.trim()

export interface RespuestaGroq {
  respuestaAmigable: string
  hayFiltros: boolean
  reiniciar: boolean
  tipoInmueble?: 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina'
  tipoTransaccion?: 'venta' | 'alquiler'
  precioMin?: number
  precioMax?: number
  habitaciones?: number
  metrosMax?: number
  ubicacion?: string
}

const TIPOS_INMUEBLE = ['casa', 'departamento', 'terreno', 'local', 'oficina'] as const
const TIPOS_TRANSACCION = ['venta', 'alquiler'] as const

export function sanitizarRespuestaGroq(raw: unknown): RespuestaGroq {
  if (typeof raw !== 'object' || raw === null) {
    return {
      respuestaAmigable: 'No entendí tu mensaje. ¿Puedes repetirlo?',
      hayFiltros: false, reiniciar: false,
      tipoInmueble: undefined, tipoTransaccion: undefined,
      precioMin: undefined, precioMax: undefined,
      habitaciones: undefined, metrosMax: undefined, ubicacion: undefined,
    }
  }

  const r = raw as Record<string, unknown>
  const safe = <T>(v: unknown, fallback: T): T =>
    v === undefined || v === null ? fallback : v as T

  return {
    respuestaAmigable: safe(r.respuestaAmigable, ''),
    hayFiltros: safe(r.hayFiltros, false),
    reiniciar: safe(r.reiniciar, false),
    tipoInmueble: TIPOS_INMUEBLE.includes(r.tipoInmueble as any)
      ? r.tipoInmueble as 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina'
      : undefined,
    tipoTransaccion: TIPOS_TRANSACCION.includes(r.tipoTransaccion as any)
      ? r.tipoTransaccion as 'venta' | 'alquiler'
      : undefined,
    precioMin: typeof r.precioMin === 'number' && r.precioMin > 0 ? r.precioMin : undefined,
    precioMax: typeof r.precioMax === 'number' && r.precioMax > 0 ? r.precioMax : undefined,
    habitaciones: typeof r.habitaciones === 'number' && r.habitaciones > 0 ? r.habitaciones : undefined,
    metrosMax: typeof r.metrosMax === 'number' && r.metrosMax > 0 ? r.metrosMax : undefined,
    ubicacion: typeof r.ubicacion === 'string' ? r.ubicacion.trim() || undefined : undefined,
  }
}
