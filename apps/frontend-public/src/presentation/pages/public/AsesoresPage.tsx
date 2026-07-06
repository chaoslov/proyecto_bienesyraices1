import { useEffect } from 'react'
import { useAsesorStore } from '@/application/store/asesorStore'
import { AsesorCard } from '@/presentation/components/shared/AsesorCard'

export const AsesoresPage = () => {
  const { asesores, fetchAsesores, loading } = useAsesorStore()

  useEffect(() => {
    if (asesores.length === 0) {
      fetchAsesores()
    }
  }, [asesores.length, fetchAsesores])

  if (loading) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#2C3E50] border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-center text-[#2C3E50] mb-8">Nuestros Asesores</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {asesores.map((asesor) => (
          <AsesorCard key={asesor.id} asesor={asesor} />
        ))}
      </div>
    </div>
  )
}
