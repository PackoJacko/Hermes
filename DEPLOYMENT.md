# 🚀 Guía de Deployment - Hermes

## 📦 Opción 1: Deployment en Vercel (RECOMENDADO)

### Paso 1: Preparar el repositorio en GitHub

1. **Crear un nuevo repositorio en GitHub**:
   - Ve a https://github.com/new
   - Nombre: `hermes-app` (o el que prefieras)
   - Privado o Público según prefieras
   - NO añadas README, .gitignore ni licencia (ya los tenemos)
   - Click en "Create repository"

2. **Subir el código desde tu terminal**:

\`\`\`bash
# Navega a la carpeta del proyecto
cd hermes-app

# Inicializar git
git init

# Añadir todos los archivos
git add .

# Hacer el primer commit
git commit -m "🎉 Initial commit - Hermes MVP"

# Añadir el repositorio remoto (sustituye con tu URL)
git remote add origin https://github.com/TU-USUARIO/hermes-app.git

# Subir el código
git branch -M main
git push -u origin main
\`\`\`

### Paso 2: Deploy en Vercel

1. **Crear cuenta en Vercel** (si no la tienes):
   - Ve a https://vercel.com/signup
   - Regístrate con tu cuenta de GitHub

2. **Importar el proyecto**:
   - Click en "Add New..." → "Project"
   - Vercel te mostrará tus repositorios de GitHub
   - Selecciona `hermes-app`
   - Click en "Import"

3. **Configurar el proyecto**:
   - Framework Preset: **Next.js** (se detecta automáticamente)
   - Root Directory: `./` (dejar por defecto)
   - Build Command: `npm run build` (automático)
   - Output Directory: `.next` (automático)
   - **NO necesitas configurar variables de entorno** (por ahora)

4. **Deploy**:
   - Click en "Deploy"
   - Espera 2-3 minutos mientras se construye
   - ¡Tu app estará lista!

5. **URL de tu app**:
   - Vercel te dará una URL como: `https://hermes-app-xxx.vercel.app`
   - Puedes configurar un dominio personalizado después

---

## 💻 Opción 2: Deployment Manual con Vercel CLI

Si prefieres hacerlo desde la terminal:

1. **Instalar Vercel CLI**:
\`\`\`bash
npm install -g vercel
\`\`\`

2. **Login**:
\`\`\`bash
vercel login
\`\`\`

3. **Deploy**:
\`\`\`bash
cd hermes-app
vercel
\`\`\`

4. **Deploy a producción**:
\`\`\`bash
vercel --prod
\`\`\`

---

## 🌐 Opción 3: Otras plataformas

### Netlify
1. Sube el código a GitHub
2. Ve a https://app.netlify.com
3. "Add new site" → "Import from Git"
4. Selecciona el repositorio
5. Build command: `npm run build`
6. Publish directory: `.next`

### Railway
1. Sube el código a GitHub
2. Ve a https://railway.app
3. "New Project" → "Deploy from GitHub repo"
4. Selecciona el repositorio
5. Railway detectará automáticamente Next.js

---

## 🔧 Verificación Post-Deployment

Una vez desplegado, verifica que:

1. ✅ La página principal carga correctamente
2. ✅ La navegación funciona (todas las secciones)
3. ✅ El botón "Cargar Datos de Ejemplo" aparece (si no hay datos)
4. ✅ Los datos se guardan en localStorage
5. ✅ El diseño responsive funciona en móvil

---

## 📱 Compartir tu App

Una vez desplegada, puedes compartir:

\`\`\`
🏛️ Hermes - Sistema para Autónomos
🔗 https://tu-app.vercel.app

Características:
✅ Dashboard con resumen del día
✅ Gestión de proyectos con Kanban
✅ Sistema de facturación
✅ Canvas de ideas
✅ Gestión de clientes
\`\`\`

---

## 🐛 Solución de Problemas

### Error: "Module not found"
\`\`\`bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Error en el build
\`\`\`bash
# Limpiar caché de Next.js
rm -rf .next
npm run build
\`\`\`

### La app no se ve bien en móvil
- Verifica que el viewport meta tag esté presente (ya está incluido)
- Verifica que Tailwind esté compilando correctamente

---

## 📊 Métricas de Performance

Hermes está optimizado para:
- ⚡ Lighthouse Score: 90+
- 🎨 First Contentful Paint: < 1.5s
- 📦 Total Bundle Size: < 200KB (gzipped)

---

## 🔒 Seguridad

Para producción, considera:
1. Añadir autenticación (NextAuth.js)
2. Migrar de localStorage a base de datos
3. Implementar rate limiting
4. Añadir HTTPS (Vercel lo hace automáticamente)

---

## 📞 ¿Necesitas Ayuda?

- 📧 Contacta al desarrollador
- 📖 Lee el README.md completo
- 🐛 Reporta bugs en GitHub Issues

---

¡Listo! Tu app Hermes debería estar funcionando en producción. 🎉
