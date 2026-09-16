# Sistema de Captación y Fidelización - Cafetería

Bienvenido al repositorio del Sistema de Fidelización para nuestra cafetería. Este proyecto es un MVP diseñado para funcionar desde el navegador móvil del cliente sin necesidad de descargar una app.

## 🚀 Tecnologías Principales
- **Framework:** Next.js (App Router)
- **Estilos:** Tailwind CSS
- **Base de Datos y Autenticación:** Supabase (PostgreSQL)
- **Lenguaje:** TypeScript

## 📦 Configuración Inicial para Colaboradores

Sigue estos pasos para levantar el proyecto en tu máquina local:

### 1. Clonar e Instalar Dependencias
```bash
git clone <url-del-repo>
cd coffee-lynat
npm install
```

### 2. Variables de Entorno (IMPORTANTE)
Está **estrictamente prohibido** subir archivos `.env` (incluyendo `.env.example`) al repositorio por motivos de seguridad. 

Debes crear un archivo en tu computadora llamado `.env.local` en la raíz del proyecto. Las claves te las pasará un administrador del equipo de forma privada (vía mensaje). El formato del archivo debe ser:

```env
NEXT_PUBLIC_SUPABASE_URL=aqui_va_la_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=aqui_va_la_clave
```

### 3. Base de Datos
Todos nos conectamos a la misma base de datos remota en Supabase para el desarrollo del MVP. 
El esquema de las tablas y políticas de seguridad (RLS) se encuentra documentado en el archivo `docs/supabase_schema.sql`.

### 4. Iniciar el Servidor
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación funcionando.

## 🗺️ Estructura del Proyecto
- `app/(public)`: Rutas públicas. Aquí ocurre la captación de clientes (`/registro`) y la fidelización (`/tarjeta/[token]`).
- `app/(admin)`: Rutas privadas para los empleados/administradores (Dashboard, Clientes, Recompensas). Protegidas por Supabase Auth.
- `app/login`: Portal de inicio de sesión del personal.
- `lib/supabase/`: Clientes de Supabase para Servidor y Navegador.

## 🚀 Despliegue en Producción (Vercel)

El proyecto está diseñado para funcionar nativamente en **Vercel** (los creadores de Next.js). Desplegarlo tomará menos de 2 minutos y será completamente gratis para este MVP.

### Pasos para desplegar:
1. Sube este proyecto (ya configurado) a tu cuenta de **GitHub**.
2. Entra a [Vercel.com](https://vercel.com/) e inicia sesión con GitHub.
3. Haz clic en **"Add New..." > "Project"**.
4. Importa el repositorio de `coffee-lynat`.
5. Abre la sección de **"Environment Variables"** antes de presionar Deploy.
6. Añade las dos variables clave de Supabase que usas en tu `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Presiona **Deploy**.

¡Y eso es todo! En menos de un minuto tendrás tu enlace público de producción (ej. `https://coffee-lynat.vercel.app`) el cual los clientes podrán visitar directamente para registrarse, y tú podrás usar para imprimir los códigos QR definitivos.
