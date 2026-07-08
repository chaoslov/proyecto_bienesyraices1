import { useState, FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '@/application/store/authStore'
import { LogIn } from 'lucide-react'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err?.message || 'Credenciales inválidas')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-[#2C3E50]">
            Alpha Inmobiliaria
          </Link>
          <p className="text-gray-500 mt-2">Accede a tu panel de asesor</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-8 space-y-5"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-[#2C3E50] rounded-full mx-auto">
            <LogIn className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-xl font-bold text-center text-gray-800">Iniciar Sesión</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@alpha.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2C3E50] text-white py-2.5 rounded-lg font-medium hover:bg-[#1a2a3a] transition-colors disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            ¿Eres asesor? Usa las credenciales proporcionadas por la administración.
          </p>
        </form>

        <p className="text-center mt-6">
          <Link to="/" className="text-sm text-[#C47B4A] hover:underline">
            &larr; Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
