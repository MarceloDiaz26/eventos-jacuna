# Guía de despliegue - JACUNA eventos

## Contenido del paquete

Subí toda la carpeta del proyecto (o el contenido del zip) a tu servidor.

## Requisitos del servidor

- **Node.js 18+**
- Hosting que soporte aplicaciones Node.js (VPS, Railway, Render, Vercel, etc.)

---

## Opción 1: Vercel (más simple)

1. Entrá a [vercel.com](https://vercel.com) y creá una cuenta.
2. Conectá tu repositorio Git o subí la carpeta del proyecto.
3. Agregá las variables de entorno en Vercel:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `ADMIN_PASSWORD`
   - `ADMIN_SECRET`
4. Vercel va a detectar Next.js y desplegar solo.

**URL de entrada:** La que te asigne Vercel (ej: `tu-proyecto.vercel.app`).

---

## Opción 2: VPS o servidor propio

### 1. Subir archivos

Subí toda la carpeta del proyecto (incluyendo `package.json`, `app/`, `lib/`, `public/`, etc.).  
**No subas** `node_modules` ni `.next` (se generan en el servidor).

### 2. En el servidor

```bash
cd /ruta/del/proyecto
npm install
npm run build
npm start
```

### 3. Variables de entorno

Creá un archivo `.env` en la raíz del proyecto con:

```
CLOUDINARY_CLOUD_NAME=tu_valor
CLOUDINARY_API_KEY=tu_valor
CLOUDINARY_API_SECRET=tu_valor
ADMIN_PASSWORD=tu_contraseña
ADMIN_SECRET=tu_secreto
NEXT_PUBLIC_BASE_URL=https://tudominio.com
```

### 4. Usar PM2 (para que siga corriendo)

```bash
npm install -g pm2
pm2 start npm --name "eventos" -- start
pm2 save
pm2 startup
```

### 5. Nginx (si usás dominio propio)

```nginx
server {
    listen 80;
    server_name tudominio.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

---

## Archivo de entrada

No hay un solo archivo HTML para abrir. Es una app Next.js que se ejecuta en el servidor.

- **URL inicial:** `https://tudominio.com/` o `https://tudominio.com`
- **Ejemplo:** Si tu dominio es `eventos.jacuna.com`, la página principal es `https://eventos.jacuna.com/`

---

## Estructura mínima a subir

```
EventosFotoApp/
├── app/
├── lib/
├── public/
├── package.json
├── next.config.js
├── tsconfig.json
├── .env.example
└── (resto de archivos de config)
```

Copiá `.env.example` a `.env` y completá los valores antes de subir (o configurá las variables en el panel de tu hosting).
