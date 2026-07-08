import { useState, FormEvent, useEffect } from 'react'
import { useAuthStore } from '@/application/store/authStore'
import { api } from '@/infrastructure/api/httpClient'

export const PerfilPage = () => {
  const { user } = useAuthStore()
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '', telefono: '', especialidad: '', descripcion: '', foto: '',
    email: '',
  })

  useEffect(() => {
    if (user?.asesor) {
      setForm({
        nombre: user.asesor.nombre || '',
        telefono: user.asesor.telefono || '',
        especialidad: (user.asesor as any).especialidad || '',
        descripcion: (user.asesor as any).descripcion || '',
        foto: user.asesor.foto || '',
        email: user.email || '',
      })
    }
  }, [user])

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
        foto: form.foto || undefined,
      })
      setExito('Perfil actualizado correctamente')
      setTimeout(() => setExito(''), 3000)
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar')
    } finally {
      setEnviando(false)
    }
  }

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:border-transparent text-sm"
  const labelCls = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        {exito && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">{exito}</div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="w-16 h-16 rounded-full bg-[#C47B4A] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {form.nombre?.charAt(0) || 'A'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{form.nombre || 'Asesor'}</h2>
            <p className="text-sm text-gray-500">{form.email}</p>
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
            <label className={labelCls}>URL de foto</label>
            <input className={inputCls} placeholder="https://..." value={form.foto} onChange={(e) => setForm({ ...form, foto: e.target.value })} />
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Descripción</label>
            <textarea className={inputCls} rows={3} placeholder="Breve descripción profesional..." value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <button type="submit" disabled={enviando} className="bg-[#2C3E50] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#1a2a3a] disabled:opacity-50">
            {enviando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
