export const validarEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email)
}

export const validarTelefono = (telefono: string): boolean => {
  const regex = /^[0-9]{10}$/
  return regex.test(telefono)
}

export const validarTexto = (texto: string, min: number = 2): boolean => {
  return texto.trim().length >= min
}