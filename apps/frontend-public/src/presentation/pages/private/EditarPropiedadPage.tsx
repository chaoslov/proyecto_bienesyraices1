import { useEffect, useState, FormEvent, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PROVINCIAS_ECUADOR } from '@/shared/constants/ecuador'
import { PropiedadApi } from '@/infrastructure/api/repositories/PropiedadApiRepository'
import { uploadService } from '@/infrastructure/upload/uploadService'
import { MapaSelector } from '@/presentation/components/map/MapaSelector'
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react'

interface ImagenInfo {
  id: string
  url: string
}

export const EditarPropiedadPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [eliminandoImg, setEliminandoImg] = useState<string | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    titulo: '', descripcion: '', precio: '', tipoPropiedad: 'casa',
    tipoTransaccion: 'venta', habitaciones: '', banos: '', parqueos: '',
    areaTotal: '', metrajeConstruido: '',
    direccion: '', sector: '', ciudad: 'Guayaquil', provincia: 'Guayas',
    latitud: 0, longitud: 0,
    archivos: [] as File[],
    imagenesExistentes: [] as ImagenInfo[],
  })

  useEffect(() => {
    if (!id) { setCargando(false); return }
    PropiedadApi.obtenerRaw(id).then((raw: any) => {
      if (!raw) { setError('Propiedad no encontrada'); return }
      const p = raw
      setForm({
        titulo: p.titulo,
        descripcion: p.descripcion || '',
        precio: String(p.precio),
        tipoPropiedad: p.tipoPropiedad,
        tipoTransaccion: p.tipoTransaccion,
        habitaciones: String(p.habitaciones || ''),
        banos: String(p.banios || ''),
        parqueos: String(p.parqueos || ''),
        areaTotal: String(p.metrajeTotal || ''),
        metrajeConstruido: String(p.metrajeConstruido || ''),
        direccion: p.ubicacion?.direccion || '',
        sector: p.ubicacion?.sector || '',
        ciudad: p.ubicacion?.ciudad || 'Guayaquil',
        provincia: p.ubicacion?.provincia || 'Guayas',
        latitud: p.ubicacion?.latitud || 0,
        longitud: p.ubicacion?.longitud || 0,
        archivos: [],
        imagenesExistentes: (p.imagenes || []).map((i: any) => ({ id: i.id, url: i.url })),
      })
    }).catch((err: any) => {
      setError(err?.message || 'Error al cargar la propiedad')
    }).finally(() => setCargando(false))
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!id) return
    setError('')
    if (!form.titulo || !form.precio) {
      setError('Título y precio son obligatorios')
      return
    }
    setEnviando(true)
    try {
      await PropiedadApi.actualizar(id, {
        titulo: form.titulo,
        descripcion: form.descripcion,
        precio: form.precio,
        tipoInmueble: form.tipoPropiedad,
        tipoTransaccion: form.tipoTransaccion,
        habitaciones: form.habitaciones,
        banos: form.banos,
        parqueos: form.parqueos,
        areaTotal: form.areaTotal,
        metrajeConstruido: form.metrajeConstruido,
        imagenes: undefined,
        ubicacion: {
          direccion: form.direccion,
          sector: form.sector,
          ciudad: form.ciudad,
          provincia: form.provincia,
          latitud: form.latitud || 0,
          longitud: form.longitud || 0,
        },
      })

      if (form.archivos.length > 0) {
        await uploadService.subirImagenesPropiedad(id, form.archivos)
      }

      navigate('/panel/propiedades')
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar')
    } finally {
      setEnviando(false)
    }
  }

  const MAX_IMAGENES = 25

  const agregarArchivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const nuevos = Array.from(e.target.files)
      const total = form.archivos.length + nuevos.length + form.imagenesExistentes.length
      if (total > MAX_IMAGENES) {
        setError(`Máximo ${MAX_IMAGENES} imágenes permitidas`)
        return
      }
      setForm({ ...form, archivos: [...form.archivos, ...nuevos] })
    }
    e.target.value = ''
  }

  const quitarArchivo = (idx: number) => {
    setForm({ ...form, archivos: form.archivos.filter((_, i) => i !== idx) })
  }

  const eliminarImagenExistente = async (img: ImagenInfo) => {
    setEliminandoImg(img.id)
    try {
      await PropiedadApi.eliminarImagen(img.id)
      setForm({
        ...form,
        imagenesExistentes: form.imagenesExistentes.filter((i) => i.id !== img.id),
      })
    } catch (err: any) {
      setError(err?.message || 'Error al eliminar la imagen')
    } finally {
      setEliminandoImg(null)
    }
  }

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:border-transparent text-sm"
  const labelCls = "block text-sm font-medium text-gray-700 mb-1"

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-[#2C3E50] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => navigate('/panel/propiedades')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#2C3E50] mb-4">
        <ArrowLeft className="w-4 h-4" /> Cancelar cambios
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Propiedad</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Título *</label>
              <input className={inputCls} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
            </div>

            <div>
              <label className={labelCls}>Descripción</label>
              <textarea className={inputCls} rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Precio (USD) *</label>
                <input type="number" className={inputCls} value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>Tipo Transacción</label>
                <select className={inputCls} value={form.tipoTransaccion} onChange={(e) => setForm({ ...form, tipoTransaccion: e.target.value })}>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Tipo Propiedad</label>
                <select className={inputCls} value={form.tipoPropiedad} onChange={(e) => setForm({ ...form, tipoPropiedad: e.target.value })}>
                  <option value="casa">Casa</option>
                  <option value="departamento">Departamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="local">Local</option>
                  <option value="oficina">Oficina</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Habitaciones</label>
                <input type="number" className={inputCls} value={form.habitaciones} onChange={(e) => setForm({ ...form, habitaciones: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Baños</label>
                <input type="number" className={inputCls} value={form.banos} onChange={(e) => setForm({ ...form, banos: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Parqueos</label>
                <input type="number" className={inputCls} value={form.parqueos} onChange={(e) => setForm({ ...form, parqueos: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Área Total (m²)</label>
                <input type="number" className={inputCls} value={form.areaTotal} onChange={(e) => setForm({ ...form, areaTotal: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Área Construida (m²)</label>
                <input type="number" className={inputCls} value={form.metrajeConstruido} onChange={(e) => setForm({ ...form, metrajeConstruido: e.target.value })} />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Dirección</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Dirección</label>
                  <input className={inputCls} value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Sector</label>
                  <input className={inputCls} value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Ciudad</label>
                  <input className={inputCls} value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Provincia</label>
                  <select className={inputCls} value={form.provincia} onChange={(e) => setForm({ ...form, provincia: e.target.value })}>
                    {PROVINCIAS_ECUADOR.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Latitud</label>
                    <input type="number" step="any" className={inputCls} value={form.latitud} onChange={(e) => setForm({ ...form, latitud: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className={labelCls}>Longitud</label>
                    <input type="number" step="any" className={inputCls} value={form.longitud} onChange={(e) => setForm({ ...form, longitud: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Imágenes ({form.imagenesExistentes.length + form.archivos.length}/{MAX_IMAGENES})
              </h3>

              {(form.imagenesExistentes.length > 0 || form.archivos.length > 0) && (
                <div className="mb-3 grid grid-cols-5 gap-2">
                  {form.imagenesExistentes.map((img, idx) => (
                    <div key={`existente-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => eliminarImagenExistente(img)}
                        disabled={eliminandoImg === img.id}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
                      >
                        {eliminandoImg === img.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  ))}
                  {form.archivos.map((file, idx) => (
                    <div key={`nuevo-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => quitarArchivo(idx)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={agregarArchivos}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={form.imagenesExistentes.length + form.archivos.length >= MAX_IMAGENES}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#C47B4A] hover:text-[#C47B4A] transition w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                {form.imagenesExistentes.length + form.archivos.length >= MAX_IMAGENES ? 'Límite alcanzado' : 'Agregar imágenes'}
              </button>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700">Ubicación en el mapa</h3>
              <p className="text-xs text-gray-400 mt-1 mb-2">Haz clic en el mapa para ajustar la ubicación exacta</p>
              <MapaSelector
                latitud={form.latitud}
                longitud={form.longitud}
                onChange={(lat, lng) => setForm({ ...form, latitud: lat, longitud: lng })}
                altura="500px"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button type="submit" disabled={enviando} className="bg-[#2C3E50] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#1a2a3a] disabled:opacity-50">
            {enviando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
