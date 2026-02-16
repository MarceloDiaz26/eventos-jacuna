# 📷 Guía paso a paso: Cloudinary

Cloudinary permite alojar las fotos en la nube sin ocupar espacio en tu servidor. Plan gratuito: ~25 GB de almacenamiento y ancho de banda al mes.

---

## Paso 1: Crear cuenta en Cloudinary

1. Entrá a **[cloudinary.com](https://cloudinary.com)**
2. Clic en **"Sign Up for Free"**
3. Registrate con tu email o con Google
4. Confirmá tu cuenta si te lo piden

---

## Paso 2: Ir al Dashboard

1. Una vez dentro, vas al **Dashboard**
2. Ahí vas a ver tres datos:
   - **Cloud name** (ej: `dxyz123abc`)
   - **API Key** (ej: `123456789012345`)
   - **API Secret** (clic en "Reveal" para verlo)

Dejá esta pestaña abierta para copiar los valores.

---

## Paso 3: Crear el archivo .env

1. Abrí la carpeta del proyecto: `D:\EventosFotoApp`
2. Abrí o creá el archivo **`.env`** en la raíz (al mismo nivel que `package.json`)
3. Agregá estas líneas con tus datos:

```
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

Reemplazá cada valor con lo que ves en el Dashboard de Cloudinary.

**Ejemplo:**
```
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

---

## Paso 4: Reiniciar la app

1. Si el servidor está corriendo, detenelo (Ctrl+C en la terminal)
2. Volvé a iniciarlo:

```bash
cd D:\EventosFotoApp
npm run dev
```

---

## Paso 5: Probar

1. Entrá a http://localhost:3000
2. Creá un evento o abrí uno existente
3. Subí una foto
4. La foto debería guardarse en Cloudinary
5. En el Dashboard de Cloudinary, en **Media Library**, vas a ver la imagen en la carpeta `eventos/[id-del-evento]`

---

## Ubicación de las fotos en Cloudinary

Las fotos se guardan por evento en: **eventos/[id-del-evento]**

Podés ver todo en: [Cloudinary Dashboard → Media Library](https://console.cloudinary.com/console/c-*)

---

## Seguridad

- No compartas tu **API Secret**
- No subas el archivo `.env` a GitHub (está en `.gitignore`)
- Si filtras el secret, generá uno nuevo en Cloudinary: Dashboard → Settings → API Keys

---

## ¿Qué pasa si no configuro Cloudinary?

Si no ponés nada en `.env`, la app guarda las fotos en `public/uploads/` en tu disco (como antes).
