import { Outlet } from 'react-router-dom'

export const LayoutPrivado = () => {
  return (
    <div className="p-4 lg:p-6">
      <Outlet />
    </div>
  )
}
