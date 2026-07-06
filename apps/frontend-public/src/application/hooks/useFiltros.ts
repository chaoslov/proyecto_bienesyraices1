import { useMemo } from 'react'
import { usePropiedadStore } from '../store/propiedadStore'

export const useFiltros = () => {
  const { propiedades, filtros, setFiltros, aplicarFiltros, limpiarFiltros } =
    usePropiedadStore()

  const resultados = useMemo(() => aplicarFiltros(), [propiedades, filtros])

  return {
    resultados,
    filtros,
    setFiltros,
    limpiarFiltros,
    total: resultados.length,
  }
}