import { useState, FormEvent, useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '@/application/store/authStore'
import { api } from '@/infrastructure/api/httpClient'
import { uploadService } from '@/infrastructure/upload/uploadService'
import { Camera, Phone, ZoomIn, X } from 'lucide-react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(
      image,
      pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
      0, 0, pixelCrop.width, pixelCrop.height,
    )
    canvas.toBlob((b) => {
      if (b) resolve(b)
      else reject(new Error('Error al generar el blob'))
    }, 'image/jpeg', 0.92)
  })
}

export const PerfilPage = () => {
  const { user } = useAuthStore()
  const [enviando, setEnviando] = useState(false)
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [exito, setExito] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    nombre: '', telefono: '', especialidad: '', descripcion: '', foto: '',
    email: '', añosExperiencia: 0,
  })
  const [original, setOriginal] = useState({
    nombre: '', telefono: '', especialidad: '', descripcion: '', foto: '',
    email: '', añosExperiencia: 0,
  })

  // Crop state
  const [cropFile, setCropFile] = useState<{ file: File; url: string } | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  useEffect(() => {
    if (user?.asesor) {
      const vals = {
        nombre: user.asesor.nombre || '',
        telefono: user.asesor.telefono || '',
        especialidad: user.asesor.especialidad || '',
        descripcion: user.asesor.descripcion || '',
        foto: user.asesor.foto || '',
        email: user.email || '',
        añosExperiencia: user.asesor.añosExperiencia ?? 0,
      }
      setForm(vals)
      setOriginal(vals)
    }
  }, [user])

  const hayCambios = () => {
    return form.nombre !== original.nombre ||
      form.telefono !== original.telefono ||
      form.especialidad !== original.especialidad ||
      form.descripcion !== original.descripcion ||
      form.foto !== original.foto ||
      form.añosExperiencia !== original.añosExperiencia
  }

  const cancelarCambios = () => {
    setForm(original)
    setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setExito('')
    if (!user?.asesor?.id) return

    setEnviando(true)
    try {
      await api.put(`/asesores/${user.asesor.id}`, {
        nombre: form.nombre,
        telefono: form.telefono,
        especialidad: form.especialidad || undefined,
        descripcion: form.descripcion || undefined,
        añosExperiencia: form.añosExperiencia || undefined,
      })
      const { checkAuth } = useAuthStore.getState()
      await checkAuth()
      setExito('Perfil actualizado correctamente')
      setTimeout(() => setExito(''), 3000)
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar')
    } finally {
      setEnviando(false)
    }
  }

  const cambiarFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.asesor?.id) return
    setError('')

    // Validate dimensions
    const img = new Image()
    const url = URL.createObjectURL(file)
    await new Promise<void>((resolve) => { img.onload = () => resolve(); img.src = url })
    if (img.width > 1400 || img.height > 1400) {
      setError(`La imagen es demasiado grande (${img.width}x${img.height}). Máximo 1400x1400 píxeles.`)
      URL.revokeObjectURL(url)
      e.target.value = ''
      return
    }

    setCropFile({ file, url })
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  const aplicarRecorte = async () => {
    if (!cropFile || !croppedAreaPixels || !user?.asesor?.id) return
    setSubiendoFoto(true)
    setError('')
    try {
      const blob = await getCroppedBlob(cropFile.url, croppedAreaPixels)
      const croppedFile = new File([blob], cropFile.file.name, { type: 'image/jpeg' })
      const fotoUrl = await uploadService.subirFotoAsesor(user.asesor.id, croppedFile)
      setForm({ ...form, foto: fotoUrl })
      setCropFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: any) {
      setError(err?.message || 'Error al subir foto')
    } finally {
      setSubiendoFoto(false)
    }
  }

  const cerrarRecorte = () => {
    if (cropFile) URL.revokeObjectURL(cropFile.url)
    setCropFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:border-transparent text-sm"
  const labelCls = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
            {exito && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">{exito}</div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
            )}

            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-[#C47B4A] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 overflow-hidden">
                  {form.foto ? (
                    <img src={form.foto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    form.nombre?.charAt(0) || 'A'
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={subiendoFoto}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white"
                >
                  {subiendoFoto ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{form.nombre || 'Asesor'}</h2>
                <p className="text-sm text-gray-500">{form.email}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={cambiarFoto}
                  className="hidden"
                />

          {/* Crop Modal */}
          {cropFile && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/70" onClick={cerrarRecorte} />
              <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h3 className="text-sm font-bold text-gray-800">Ajustar foto</h3>
                  <button onClick={cerrarRecorte} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative w-full h-80 bg-gray-900">
                  <Cropper
                    image={cropFile.url}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>

                <div className="px-4 py-3 border-t">
                  <div className="flex items-center gap-3">
                    <ZoomIn className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.05}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="flex-1 accent-[#C47B4A]"
                    />
                    <ZoomIn className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-4 py-3 border-t bg-gray-50">
                  <button
                    type="button"
                    onClick={cerrarRecorte}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={aplicarRecorte}
                    disabled={subiendoFoto}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#2C3E50] hover:bg-[#1a2a3a] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {subiendoFoto ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Subiendo...
                      </>
                    ) : (
                      'Aplicar'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={subiendoFoto}
                  className="text-xs text-[#C47B4A] hover:underline mt-1"
                >
                  {subiendoFoto ? 'Subiendo...' : 'Cambiar foto'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Nombre completo</label>
                <input className={inputCls} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
              </div>

              <div>
                <label className={labelCls}>Teléfono</label>
                <input className={inputCls} value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              </div>

              <div>
                <label className={labelCls}>Especialidad</label>
                <input className={inputCls} placeholder="Ej: Casas de lujo, Departamentos" value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} />
              </div>

              <div>
                <label className={labelCls}>Años de experiencia</label>
                <input type="number" min="0" className={inputCls} value={form.añosExperiencia} onChange={(e) => setForm({ ...form, añosExperiencia: Number(e.target.value) })} />
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Descripción</label>
                <textarea className={inputCls} rows={3} placeholder="Breve descripción profesional..." value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              {hayCambios() && (
                <button type="button" onClick={cancelarCambios} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Cancelar cambios
                </button>
              )}
              <button type="submit" disabled={enviando} className="bg-[#2C3E50] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#1a2a3a] disabled:opacity-50">
                {enviando ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Vista previa del perfil</h3>
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col border">
              <div className="relative overflow-hidden bg-gray-200 aspect-[4/3] flex items-center justify-center">
                {form.foto ? (
                  <img src={form.foto} alt={form.nombre} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-gray-400">{form.nombre?.charAt(0) || 'A'}</span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800">{form.nombre || 'Asesor'}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Agente · {form.especialidad || 'Alpha Inmobiliaria'}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-800">{form.añosExperiencia}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">AÑOS</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{user?.asesor?._count?.propiedades ?? 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">PROPIEDADES</p>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{form.telefono || 'No registrado'}</span>
                  </p>
                </div>
                <div className="mt-3">
                  <button className="w-full py-2.5 px-4 bg-[#2C3E50] text-white font-medium rounded-lg hover:bg-[#1A252F] transition-colors text-sm">
                    Ver Perfil
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              Así te verán los clientes en la sección de asesores
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
