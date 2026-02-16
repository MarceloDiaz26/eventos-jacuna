# Configurar Neon Postgres para Vercel

La app migró de SQLite a **Neon Postgres** para funcionar correctamente en Vercel.

## Opción 1: Desde Vercel (recomendado)

1. En tu proyecto en Vercel, andá a **Storage**
2. Clic en **Create Database**
3. Elegí **Neon** (Postgres)
4. Seguí los pasos para conectar
5. Vercel inyecta `DATABASE_URL` automáticamente

## Opción 2: Desde Neon directamente

1. Entrá a [neon.tech](https://neon.tech) y creá una cuenta
2. Creá un nuevo proyecto
3. Copiá la **connection string** (empieza con `postgresql://`)
4. En Vercel: **Settings** → **Environment Variables**
5. Agregá: `DATABASE_URL` = (la connection string)

## Después del primer deploy

1. Visitá `https://tu-url.vercel.app/api/db/init`
2. Deberías ver: `{"ok":true,"message":"Base de datos inicializada"}`
3. Las tablas se crean automáticamente

## Desarrollo local

Para probar en local, creá un archivo `.env.local` con:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

Obtené la URL desde tu proyecto en [neon.tech](https://neon.tech) o desde la integración en Vercel.
