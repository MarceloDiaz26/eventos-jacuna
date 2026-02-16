# Guía paso a paso: Subir a Vercel

## Paso 1: Crear cuenta en Vercel

1. Entrá a **[vercel.com](https://vercel.com)**
2. Clic en **"Sign Up"** o **"Iniciar sesión"**
3. Podés registrarte con:
   - GitHub (recomendado)
   - GitLab
   - Bitbucket
   - Email

---

## Paso 2: Preparar el proyecto (si usás GitHub)

Si querés usar GitHub (más cómodo para actualizar después):

1. Creá una cuenta en **[github.com](https://github.com)** si no tenés
2. Creá un nuevo repositorio (por ejemplo: "eventos-jacuna")
3. Subí tu proyecto:
   - En la carpeta `D:\EventosFotoApp`, abrí la terminal
   - Ejecutá:
   ```
   git init
   git add .
   git commit -m "Proyecto inicial"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

**O sin GitHub:** Vercel permite subir la carpeta directo desde tu computadora.

---

## Paso 3: Crear el proyecto en Vercel

1. Entrá a **[vercel.com/new](https://vercel.com/new)**

2. **Si tenés GitHub:**
   - Clic en **"Import Git Repository"**
   - Seleccioná tu repositorio
   - Clic en **"Import"**

3. **Si subís la carpeta:**
   - Descargá **Vercel CLI**: en la terminal ejecutá `npm i -g vercel`
   - Navegá a `D:\EventosFotoApp`
   - Ejecutá `vercel` y seguí las instrucciones
   - O usá el botón "Deploy" en vercel.com y arrastrá la carpeta

---

## Paso 4: Configurar variables de entorno

Antes de desplegar (o después, en Settings):

1. En la pantalla de configuración del proyecto, buscá **"Environment Variables"** o **"Variables de entorno"**

2. **Base de datos (obligatorio):** Agregá Neon Postgres:
   - En Vercel: **Storage** → **Create Database** → elegí **Neon**
   - O entrá a [vercel.com/marketplace/neon](https://vercel.com/marketplace/neon) e instalá la integración
   - Vercel va a inyectar `DATABASE_URL` automáticamente
   - Después del primer deploy, entrá a `https://tu-url.vercel.app/api/db/init` para crear las tablas

3. Agregá el resto de variables:

   | Nombre | Valor | Descripción |
   |--------|-------|-------------|
   | `CLOUDINARY_CLOUD_NAME` | dmp0e6tf4 | Tu cloud name |
   | `CLOUDINARY_API_KEY` | 586395141178214 | Tu API key |
   | `CLOUDINARY_API_SECRET` | NKhxrvkOoUvsg2APtu91LvcGsf4 | Tu API secret |
   | `ADMIN_PASSWORD` | (elegí una contraseña) | Para el panel admin |
   | `ADMIN_SECRET` | (texto aleatorio largo) | Para las sesiones |

4. Para `ADMIN_SECRET`, usá algo aleatorio como: `jacuna2024eventos-secreto-xyz123`

---

## Paso 5: Desplegar

1. Clic en **"Deploy"**
2. Esperá 1-2 minutos mientras Vercel compila
3. Cuando termine, te va a dar una URL como: **`tu-proyecto.vercel.app`**

---

## Paso 6: Configurar tu dominio (opcional)

Si querés usar tu propio dominio (ej: eventos.jacuna.com):

1. En el proyecto en Vercel, andá a **Settings** → **Domains**
2. Agregá tu dominio
3. Vercel te va a dar instrucciones para configurar los DNS en DonWeb

4. Agregá también la variable:
   - `NEXT_PUBLIC_BASE_URL` = `https://tudominio.com`

---

## Paso 7: Probar

Abrí la URL que te dio Vercel. Deberías ver:

- Página principal
- Crear evento
- Subir fotos
- Álbum
- Animación en pantalla

Para el panel admin: `https://tu-url.vercel.app/admin`

---

## Base de datos: Neon Postgres

La app usa **Neon Postgres** (reemplazo de Vercel Postgres) porque SQLite no funciona en Vercel (disco temporal). Con Neon:

- Los **eventos y fotos** se guardan en la nube de forma persistente
- Plan gratuito suficiente para empezar
- Integración directa con Vercel

**Primera vez:** Después del deploy, visitá `https://tu-url.vercel.app/api/db/init` una vez para crear las tablas.

---

## ¿Problemas?

- **Error al desplegar**: Revisá que todas las variables de entorno estén cargadas
- **Fotos no suben**: Verificá que Cloudinary esté bien configurado
- **"Admin no configurado"**: Agregá ADMIN_PASSWORD y ADMIN_SECRET
