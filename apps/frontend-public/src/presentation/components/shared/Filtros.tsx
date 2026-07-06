import { useEffect, useState } from 'react'
import { useFiltros } from '@/application/hooks/useFiltros'
import { useDebounce } from '@/application/hooks/useDebounce'
import { Input } from '@/presentation/components/ui/Entrada'
import { Button } from '@/presentation/components/ui/Botones'

export const Filtros = () => {
  const { filtros, setFiltros, limpiarFiltros } = useFiltros()
  const [busquedaLocal, setBusquedaLocal] = useState(filtros.busqueda || '')
  const debouncedBusqueda = useDebounce(busquedaLocal, 500)

  useEffect(() => {
    setFiltros({ busqueda: debouncedBusqueda || undefined })
  }, [debouncedBusqueda])

  return (
    <div className="bg-[#E8D9C8] p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Input
            label="Buscar"
            placeholder="Escribe lo que buscas..."
            value={busquedaLocal}
            onChange={(e) => setBusquedaLocal(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Transacción</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
            value={filtros.tipoTransaccion || ''}
            onChange={(e) => setFiltros({ tipoTransaccion: e.target.value as 'venta' | 'alquiler' || undefined })}
          >
            <option value="">Todos</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        <div>
          <Input
            label="Precio mínimo"
            type="number"
            placeholder="$0"
            value={filtros.precioMin || ''}
            onChange={(e) => setFiltros({ precioMin: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>

        <div>
          <Input
            label="Precio máximo"
            type="number"
            placeholder="$999,999"
            value={filtros.precioMax || ''}
            onChange={(e) => setFiltros({ precioMax: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="outline" size="pq" onClick={limpiarFiltros}>
          Limpiar filtros
        </Button>
      </div>
    </div>
  )
}