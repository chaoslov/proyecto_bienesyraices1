# Guía para trabajar con Git - Proyecto Bienes Raíces

## Estructura de ramas

```
main                    ← Código base (no tocar directo)
├── feature/jhonny-frontend   ← Jhonny - Frontend público
├── feature/kelvin-admin      ← Kelvin - Panel asesor
├── feature/allan-mapas       ← Allan - Mapas
├── feature/ricardo-chatbot   ← Ricardo - Chatbot
└── feature/yandri-backend    ← Yandri - Backend
```

## 1. Clonar el repositorio (solo la primera vez)

```powershell
git clone https://github.com/chaoslov/proyecto_bienesyraices1.git
cd proyecto_bienesyraices1
```

## 2. Cambiarse a SU rama

```powershell
git checkout main
git pull origin main
git checkout <su-rama>
```

Ejemplo para Jhonny: `git checkout feature/jhonny-frontend`

## 3. Trabajar (crear/modificar archivos)

Pon tus archivos en las carpetas que corresponden.

## 4. Subir tus cambios

```powershell
git add .
git commit -m "feat: descripción de lo que hiciste"
git push origin <su-rama>
```

## 5. Si tienes conflictos al hacer push

```powershell
git pull origin <su-rama>
# Resuelve conflictos si los hay
git add .
git commit -m "fix: resolver conflictos"
git push origin <su-rama>
```

## 6. Fusionar a main (cuando esté listo)

Desde GitHub:
1. Ve al repositorio
2. Haz clic en **Compare & pull request**
3. Asigna un revisor
4. Haz clic en **Create pull request**
5. Espera revisión y luego **Merge pull request**

## Reglas importantes

- ❌ **NUNCA hagas push directo a `main`**
- ✅ Siempre trabaja en **tu rama**
- ✅ Siempre haz `git pull origin main` antes de empezar
- ✅ Commits descriptivos: `"feat: agregar filtros de búsqueda"` no `"cambios"`
