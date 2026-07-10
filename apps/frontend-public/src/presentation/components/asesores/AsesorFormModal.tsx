import { useState, FormEvent } from 'react'
import { Asesor } from '@/domain/entities/Asesor'

interface Props {
  asesor: Asesor | null
  onClose: () => void
  onSave: (data: any) => Promise<void>
}

interface FormData {
  nombre: string
  email: string
  password: string
  telefono: string
  especialidad: string
  descripcion: string
  añosExperiencia: number | ''
}

export const AsesorFormModal = ({ asesor, onClose, onSave }: Props) => {
  const esEdicion = !!asesor
  const [form, setForm] = useState<FormData>({
    nombre: asesor?.nombre || '',
    email: asesor?.email || '',
    password: '',
    telefono: asesor?.telefono || '',
    especialidad: asesor?.especialidad || '',
    descripcion: asesor?.descripcion || '',
    añosExperiencia: asesor?.experiencia ?? '',
  })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const cambiar = (campo: keyof FormData, valor: string | number) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.nombre || !form.email || (!esEdicion && !form.password)) {
      setError('Completa los campos obligatorios')
      return
    }

    if (!esEdicion && form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setGuardando(true)
    try {
      const data: Record<string, any> = {
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        especialidad: form.especialidad || undefined,
        descripcion: form.descripcion || undefined,
        añosExperiencia: form.añosExperiencia !== '' ? Number(form.añosExperiencia) : undefined,
      }

      if (form.password) {
        data.password = form.password
      }

      await onSave(data)
    } catch (err: any) {
      setError(err?.message || 'Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {esEdicion ? 'Editar Asesor' : 'Nuevo Asesor'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => cambiar('nombre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => cambiar('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {esEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña'} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => cambiar('password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
                {...(!esEdicion ? { required: true } : {})}
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="text"
                value={form.telefono}
                onChange={(e) => cambiar('telefono', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
              <input
                type="text"
                value={form.especialidad}
                onChange={(e) => cambiar('especialidad', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Años de experiencia</label>
              <input
                type="number"
                value={form.añosExperiencia}
                onChange={(e) => cambiar('añosExperiencia', e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
                min={0}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => cambiar('descripcion', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A] resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-4 py-2 text-sm bg-[#C47B4A] text-white rounded-lg font-medium hover:bg-[#b06a3d] transition-colors disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear Asesor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
