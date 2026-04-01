# 🏛️ Hermes - Sistema Operativo para Autónomos

> El primer sistema operativo "Todo-en-Uno" con Inteligencia Adaptativa para Autónomos

![Hermes Banner](https://img.shields.io/badge/Hermes-OS%20para%20Aut%C3%B3nomos-0ea5e9)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

---

## 📋 Características

### ✅ Módulos Implementados (MVP)

- **📊 Dashboard "Hoy"**: Resumen visual de tu día
  - Tareas pendientes y vencidas
  - Proyectos activos
  - Ingresos por cobrar
  - Estadísticas del mes

- **📁 Gestor de Proyectos**
  - Vista Kanban con drag & drop
  - Vista de Lista
  - Estados: Planificación, En Progreso, Revisión, Completado
  - Seguimiento de progreso y presupuesto
  - Alertas de tareas atrasadas

- **💰 Sistema de Facturación**
  - Generación de facturas
  - Estados: Borrador, Enviada, Pagada, Vencida
  - Estadísticas de cobros
  - Gestión de presupuestos

- **👥 Gestión de Clientes**
  - Base de datos de clientes
  - Información de contacto completa
  - Búsqueda y filtrado

- **🎨 Canvas de Ideas**
  - Pizarra infinita para brainstorming
  - Notas con colores personalizables
  - Drag & drop
  - Conversión de notas en tareas

- **⚙️ Configuración**
  - Perfil de usuario
  - Notificaciones
  - Temas
  - Gestión de datos

---

## 🚀 Instalación Local

### Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio** (cuando esté en GitHub):
\`\`\`bash
git clone https://github.com/tu-usuario/hermes-app.git
cd hermes-app
\`\`\`

2. **Instalar dependencias**:
\`\`\`bash
npm install
# o
yarn install
\`\`\`

3. **Ejecutar en modo desarrollo**:
\`\`\`bash
npm run dev
# o
yarn dev
\`\`\`

4. **Abrir en el navegador**:
\`\`\`
http://localhost:3000
\`\`\`

---

## 🌐 Deployment en Vercel

### Opción 1: Deploy Automático desde GitHub

1. **Subir el proyecto a GitHub**:
\`\`\`bash
git init
git add .
git commit -m "Initial commit - Hermes MVP"
git branch -M main
git remote add origin https://github.com/tu-usuario/hermes-app.git
git push -u origin main
\`\`\`

2. **Conectar con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New" → "Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es Next.js
   - Click en "Deploy"

3. **¡Listo!** Tu app estará en:
\`\`\`
https://hermes-app.vercel.app
\`\`\`

### Opción 2: Deploy Manual con Vercel CLI

1. **Instalar Vercel CLI**:
\`\`\`bash
npm i -g vercel
\`\`\`

2. **Login en Vercel**:
\`\`\`bash
vercel login
\`\`\`

3. **Deploy**:
\`\`\`bash
vercel
\`\`\`

4. **Deploy a Producción**:
\`\`\`bash
vercel --prod
\`\`\`

---

## 📦 Estructura del Proyecto

\`\`\`
hermes-app/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Dashboard principal
│   ├── projects/          # Módulo de proyectos
│   ├── invoices/          # Módulo de facturación
│   ├── clients/           # Módulo de clientes
│   ├── canvas/            # Canvas de ideas
│   ├── settings/          # Configuración
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   └── Sidebar.tsx        # Navegación lateral
├── lib/                   # Utilidades
│   └── store.ts           # Zustand store (estado global)
├── public/                # Archivos estáticos
├── package.json           # Dependencias
├── tsconfig.json          # Configuración TypeScript
├── tailwind.config.js     # Configuración Tailwind
└── next.config.js         # Configuración Next.js
\`\`\`

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 14.2.0 | Framework React con SSR |
| **React** | 18.3.0 | Biblioteca UI |
| **TypeScript** | 5.4.0 | Tipado estático |
| **Tailwind CSS** | 3.4.0 | Estilos utility-first |
| **Zustand** | 4.5.0 | Gestión de estado |
| **Lucide React** | 0.368.0 | Iconos |
| **date-fns** | 3.6.0 | Manejo de fechas |
| **Recharts** | 2.12.0 | Gráficos |
| **jsPDF** | 2.5.1 | Generación de PDFs |

---

## 💾 Almacenamiento de Datos

Actualmente, Hermes usa **localStorage** con Zustand Persist para almacenar los datos localmente en el navegador.

### Para Producción (Próximas Fases):

- **Base de Datos**: Vercel Postgres o Supabase
- **Autenticación**: NextAuth.js
- **Almacenamiento de Archivos**: Vercel Blob

---

## 🎨 Tema y Colores

Hermes utiliza una paleta inspirada en el dios griego del comercio:

- **Hermes Blue**: `#0ea5e9` - Color principal
- **Gold**: `#f59e0b` - Acentos de lujo
- **Grises**: Para textos y fondos

---

## 📝 Próximas Fases (Roadmap)

### Fase 2: Finanzas Avanzadas
- [ ] Integración bancaria (PSD2)
- [ ] Conexión con AEAT
- [ ] Generación automática de modelos (IVA/IRPF)
- [ ] Conciliación bancaria automática

### Fase 3: Inteligencia Artificial
- [ ] Asistente IA con Claude
- [ ] Predictor de burnout
- [ ] Redacción automática de propuestas
- [ ] Sugerencias inteligentes

### Fase 4: Integraciones
- [ ] Google Calendar / Outlook
- [ ] Stripe / PayPal
- [ ] Calendly-style scheduling
- [ ] Exportación a Excel/PDF avanzado

### Fase 5: Colaboración
- [ ] Multiusuario
- [ ] Permisos y roles
- [ ] Chat interno
- [ ] Notificaciones en tiempo real

---

## 🤝 Contribuir

Este es un proyecto personal de Packo. Si quieres contribuir o tienes sugerencias:

1. Abre un Issue
2. Crea un Fork
3. Haz un Pull Request

---

## 📄 Licencia

Proyecto privado © 2026 Packo - Todos los derechos reservados

---

## 🎯 Autor

**Packo**
- 📍 Mallorca, España
- 🎨 Diseñador publicitario con 25+ años de experiencia
- 💼 Especializado en herramientas digitales y comunicación visual

---

## 💡 ¿Necesitas Ayuda?

Si tienes problemas con la instalación o deployment:

1. Revisa la [documentación de Next.js](https://nextjs.org/docs)
2. Consulta la [documentación de Vercel](https://vercel.com/docs)
3. Abre un Issue en este repositorio

---

**Hermes** - *El dios del comercio al servicio de los autónomos* ⚡
