# 📦 Boxful — Frontend

Mini plataforma de envíos construida con **Next.js 16**, que permite gestionar órdenes de recolección y entrega de paquetes.

## ✨ Funcionalidades

- 🔐 **Inicio de sesión y registro** de usuarios
- 📦 **Creación de órdenes** con múltiples paquetes (dimensiones, peso, contenido)
- 📋 **Historial de envíos** con filtros por rango de fechas
- 📥 **Exportación a CSV** de órdenes seleccionadas
- 🔒 **Autenticación segura** con cookies `httpOnly` — el token nunca se expone al cliente

## 🛠️ Stack tecnológico

- [Next.js 16](https://nextjs.org/) — App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/) — cliente HTTP
- [PapaParse](https://www.papaparse.com/) — exportación CSV


## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Roberto640Alvarado/frontend-boxful.git
cd frontend-boxful
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
API_URL=https://backend-boxful.onrender.com/api
```

### 4. Iniciar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del proyecto

```
app/
  api/                  # Route Handlers (proxy seguro al backend)
    auth/
      login/route.ts
      logout/route.ts
      whoami/route.ts
      register/route.ts
    orders/
      route.ts
      history/route.ts
  (auth)/               # Rutas públicas
    login/
    register/
  (private)/            # Rutas protegidas
    home/
    history/
components/
  forms/                # OrderForm, PackagesForm
  layout/               # Navbar
  modals/               # ConfirmPhoneModal
  ui/                   # Toast
context/                # AuthContext
lib/                    # apiClient, interceptors
services/               # authService, orderService
types/                  # auth.types, order.types
utils/                  # exportCsv
middleware.ts           # Protección de rutas
```