import { useEffect, useState, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PropiedadApi } from '@/infrastructure/api/repositories/PropiedadApiRepository'
import { ArrowLeft } from 'lucide-react'

export const EditarPropiedadPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    titulo: '', descripcion: '', precio: '', tipoPropiedad: 'casa',
    tipoTransaccion: 'venta', habitaciones: '', banos: '', parqueos: '',
    areaTotal: '', metrajeConstruido: '',
    direccion: '', sector: '', ciudad: 'Guayaquil',
    latitud: '', longitud: '', imagenes: [''] as string[],
  })

  useEffect(() => {
    if (!id) return
    PropiedadApi.obtenerPorId(id).then((p) => {
      setForm({
        titulo: p.titulo,
        descripcion: p.descripcion || '',
        precio: String(p.precio),
        tipoPropiedad: p.tipoInmueble,
        tipoTransaccion: p.tipoTransaccion,
        habitaciones: String(p.habitaciones || ''),
        banos: String(p.banos || ''),
        parqueos: '',
        areaTotal: String(p.areaTotal || ''),
        metrajeConstruido: '',
        direccion: p.ubicacion?.direccion || '',
        sector: '',
        ciudad: p.ubicacion?.ciudad || 'Guayaquil',
        latitud: String(p.ubicacion?.latitud || ''),
        longitud: String(p.ubicacion?.longitud || ''),
        imagenes: p.imagenes?.length ? p.imagenes : [''],
      })
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
      const imagenes = form.imagenes.filter(Boolean)
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
        imagenes: imagenes.length ? imagenes : undefined,
        ubicacion: {
          direccion: form.direccion,
          sector: form.sector,
          ciudad: form.ciudad,
          latitud: form.latitud || 0,
          longitud: form.longitud || 0,
        },
      })
      navigate('/panel/propiedades')
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar')
    } finally {
      setEnviando(false)
    }
  }

  const agregarImagen = () => setForm({ ...form, imagenes: [...form.imagenes, ''] })
  const cambiarImagen = (idx: number, val: string) => {
    const imgs = [...form.imagenes]; imgs[idx] = val; setForm({ ...form, imagenes: imgs })
  }
  const quitarImagen = (idx: number) => {
    const imgs = form.imagenes.filter((_, i) => i !== idx)
    setForm({ ...form, imagenes: imgs.length ? imgs : [''] })
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
        <ArrowLeft className="w-4 h-4" /> Volver a mis propiedades
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Propiedad</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelCls}>Título *</label>
            <input className={inputCls} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Descripción</label>
            <textarea className={inputCls} rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </div>

          <div>
            <label className={labelCls}>Precio (USD) *</label>
            <input type="number" className={inputCls} value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
          </div>

          <div>
            <label className={labelCls}>Tipo de Transacción</label>
            <select className={inputCls} value={form.tipoTransaccion} onChange={(e) => setForm({ ...form, tipoTransaccion: e.target.value })}>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Tipo de Propiedad</label>
            <select className={inputCls} value={form.tipoPropiedad} onChange={(e) => setForm({ ...form, tipoPropiedad: e.target.value })}>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
              <option value="local">Local</option>
              <option value="oficina">Oficina</option>
            </select>
          </div>

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

          <div>
            <label className={labelCls}>Área Total (m²)</label>
            <input type="number" className={inputCls} value={form.areaTotal} onChange={(e) => setForm({ ...form, areaTotal: e.target.value })} />
          </div>

          <div>
            <label className={labelCls}>Área Construida (m²)</label>
            <input type="number" className={inputCls} value={form.metrajeConstruido} onChange={(e) => setForm({ ...form, metrajeConstruido: e.target.value })} />
          </div>

          <div className="md:col-span-2">
            <div className="border-t pt-4 mt-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Ubicación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Latitud</label>
                    <input type="number" step="any" className={inputCls} value={form.latitud} onChange={(e) => setForm({ ...form, latitud: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Longitud</label>
                    <input type="number" step="any" className={inputCls} value={form.longitud} onChange={(e) => setForm({ ...form, longitud: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="border-t pt-4 mt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Imágenes (URLs)</h3>
                <button type="button" onClick={agregarImagen} className="text-xs text-[#C47B4A] hover:underline">+ Agregar</button>
              </div>
              {form.imagenes.map((url, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input className={inputCls} placeholder="https://..." value={url} onChange={(e) => cambiarImagen(idx, e.target.value)} />
                  {form.imagenes.length > 1 && (
                    <button type="button" onClick={() => quitarImagen(idx)} className="text-red-500 text-sm px-2">×</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button type="button" onClick={() => navigate('/panel/propiedades')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className="bg-[#2C3E50] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#1a2a3a] disabled:opacity-50">
            {enviando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
