# 📸 JACUNA eventos – Álbum de fotos

Álbum digital para eventos. Los invitados escanean un QR, suben fotos y se guardan en Cloudinary.

## Características

- **Crear eventos** – Nombre y descripción
- **Código QR** – Para que los invitados accedan a la subida
- **Subida de fotos** – A Cloudinary (no ocupa espacio local)
- **Álbum digital** – Galería con todas las fotos

## Configuración

1. Crear cuenta en [Cloudinary](https://cloudinary.com)
2. Copiar Cloud name, API Key y API Secret del Dashboard
3. Crear `.env` con:
   ```
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

Ver `CONFIGURAR_CLOUDINARY.md` para más detalles.

## Uso

```bash
npm run dev
```

Abrir http://localhost:3000

## Tecnologías

- Next.js 14
- React 18
- SQLite
- Cloudinary
- QRCode
