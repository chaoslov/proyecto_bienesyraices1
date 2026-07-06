import { Button } from '@/presentation/components/ui/Botones'

interface PaginacionProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Paginacion = ({ currentPage, totalPages, onPageChange }: PaginacionProps) => {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const getVisiblePages = () => {
    if (totalPages <= 7) return pages

    const visible: number[] = []
    visible.push(1)

    if (currentPage > 3) {
      visible.push(-1) // ...
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      visible.push(i)
    }

    if (currentPage < totalPages - 2) {
      visible.push(-1) // ...
    }

    visible.push(totalPages)

    return visible
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
      {/* Anterior */}
      <Button
        variant="outline"
        size="pq"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </Button>

      {/* Números de página */}
      {visiblePages.map((page, index) =>
        page === -1 ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? 'primary' : 'outline'}
            size="pq"
            onClick={() => onPageChange(page)}
            className="min-w-[40px]"
          >
            {page}
          </Button>
        )
      )}

      {/* Siguiente */}
      <Button
        variant="outline"
        size="pq"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </Button>
    </div>
  )
}