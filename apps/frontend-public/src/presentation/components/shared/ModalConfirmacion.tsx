import { AlertTriangle, X } from 'lucide-react'

interface Props {
  abierto: boolean
  titulo: string
  mensaje: string
  onConfirmar: () => void
  onCancelar: () => void
  confirmando?: boolean
  textoConfirmar?: string
  textoCancelar?: string
}

export const ModalConfirmacion = ({
  abierto, titulo, mensaje, onConfirmar, onCancelar,
  confirmando = false, textoConfirmar = 'Confirmar', textoCancelar = 'Cancelar',
}: Props) => {
  if (!abierto) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onCancelar} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">{titulo}</h3>
                <button onClick={onCancelar} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">{mensaje}</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={onCancelar}
              disabled={confirmando}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {textoCancelar}
            </button>
            <button
              onClick={onConfirmar}
              disabled={confirmando}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {confirmando ? 'Eliminando...' : textoConfirmar}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}