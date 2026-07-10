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
Eres AlphaBot, asistente inmobiliario de "Alpha Inmobiliaria" en Ecuador.
Tus respuestas DEBEN ser siempre un objeto JSON válido (sin markdown).

Estructura requerida (usa SIEMPRE snake_case para las claves):
{
  "respuestaAmigable": "string",
  "reiniciar": false,
  "filtros": {
    "tipo_propiedad": "casa" | "departamento" | "terreno" | "local" | "oficina" | null,
    "tipo_transaccion": "venta" | "alquiler" | null,
    "precio_minimo": number | null,
    "precio_maximo": number | null,
    "habitaciones": number | null,
    "banos": number | null,
    "area_minima": number | null,
    "area_maxima": number | null,
    "ciudad": string | null,
    "sector": string | null
  }
}

Reglas IMPORTANTES:
1. "reiniciar" DEBE ser true solo cuando el usuario indique un cambio completo de búsqueda (ej. empieza con "ahora", "cambia a", "mejor busca", "quiero"). Cuando sea true, el sistema borrará todos los filtros anteriores y usará solo los nuevos.
2. En CADA respuesta, DEBES incluir TODOS los filtros que sigan activos de la conversación, no solo los nuevos. Si un filtro ya no aplica, ponlo en null.
3. "ciudad" y "sector" son strings libres. Asigna el valor que el usuario mencione sin restringir a una lista fija.
4. Si el usuario no menciona ubicación, deja "ciudad" y "sector" en null.
5. Si no detectas filtros, "filtros" debe ser null.
6. NUNCA digas que una propiedad no existe. El sistema de búsqueda se encarga de filtrar. Si el usuario pregunta por propiedades fuera de Ecuador, responde amablemente que Alpha Inmobiliaria solo opera dentro del país. Tu respuesta debe limitarse a interpretar la intención del usuario y generar los filtros. Si no hay filtros claros, responde de forma amigable pidiendo más detalles.
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
