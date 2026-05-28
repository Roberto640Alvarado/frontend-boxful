# 📦 Boxful — Frontend

Mini plataforma de envíos construida con **Next.js 16**, que permite gestionar órdenes de recolección y entrega de paquetes.

## ✨ Funcionalidades

- 🔐 **Inicio de sesión y registro** de usuarios
- 📦 **Creación de órdenes** con múltiples paquetes (dimensiones, peso, contenido)
- 💵 **Soporte COD (Cash on Delivery)** — al crear una orden se puede indicar si requiere cobro contra entrega y el monto esperado
- 💰 **Monto a liquidar** — se muestra en tiempo real el balance acumulado del comercio en todas las vistas privadas
- 📋 **Historial de envíos** con filtros por rango de fechas
- 📥 **Exportación a CSV** de órdenes seleccionadas
- 🔒 **Autenticación segura** con cookies `httpOnly` — el token nunca se expone al cliente

## 🛠️ Stack tecnológico

- [Next.js 16](https://nextjs.org/) — App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/) — cliente HTTP
- [PapaParse](https://www.papaparse.com/) — exportación CSV

## 🖥️ Vistas

### 🔓 Públicas

| Vista | Descripción |
|-------|-------------|
| `/login` | Inicio de sesión con correo y contraseña. Redirige al home si ya hay sesión activa |
| `/register` | Registro de usuario con nombre, apellido, sexo, fecha de nacimiento, correo, teléfono y contraseña |

### 🔐 Privadas (requieren sesión activa)

| Vista | Descripción |
|-------|-------------|
| `/home` | Vista principal. Muestra el formulario de datos del destinatario para iniciar la creación de una orden. Incluye el badge de **Monto a liquidar** en el header |
| `/home` (paso 2) | Listado dinámico de paquetes de la orden. Permite agregar, editar y eliminar paquetes con sus dimensiones, peso y contenido. Si la orden es **COD**, se activa el checkbox y se ingresa el monto esperado |
| `/history` | Historial de órdenes del usuario en orden descendente. Permite filtrar por rango de fechas, seleccionar órdenes y exportarlas a CSV. Muestra el **Monto a liquidar** actualizado en el header |

## 💵 Punto extra — COD y Liquidación

Se implementó el módulo de **Cash on Delivery (COD)** como punto extra:

- Al crear una orden se puede marcar el checkbox **COD** e ingresar un monto esperado a cobrar al destinatario
- El backend expone un webhook público `POST /webhooks/orders/:numeroOrden` que recibe el monto real recolectado y calcula la liquidación automáticamente
- El **Monto a liquidar** visible en el header refleja el balance acumulado de todas las órdenes entregadas del comercio, calculado con la siguiente lógica:
  - **Orden COD:** `Monto Recolectado - Costo de Envío - Comisión (0.01% con tope de $25)`
  - **Orden sin cobro:** `- Costo de Envío`
- El balance se actualiza automáticamente cada 30 segundos mediante polling

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
API_URL=http://localhost:4000/api
```

### 4. Iniciar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del proyecto

```
app/
  api/                  # Route Handlers 
    auth/
      login/route.ts
      logout/route.ts
      whoami/route.ts
      register/route.ts
    orders/
      route.ts
      history/route.ts
      balance/route.ts  
  (auth)/               # Rutas públicas
    login/
    register/
  (private)/            # Rutas protegidas
    home/               # Crear orden (paso 1: datos destinatario, paso 2: paquetes + COD)
    history/            # Historial con filtros y exportación CSV
components/
  forms/                # OrderForm, PackagesForm
  layout/               # Navbar
  modals/               # ConfirmPhoneModal, OrderSuccessModal
  ui/                   # Toast
context/                # AuthContext
lib/                    # apiClient, interceptors
services/               # authService, orderService
types/                  # auth.types, order.types
utils/                  # exportCsv
proxy.ts                # Protección de rutas
```