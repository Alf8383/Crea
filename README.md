# Empresa Fácil Perú

MVP web para orientar la creación, formalización y revisión de restaurantes en Perú. La aplicación usa preguntas sencillas, un motor de reglas independiente de la interfaz y fuentes oficiales trazables.

## Ejecutar localmente

1. Instala las dependencias con `pnpm install`.
2. Copia `.env.example` como `.env.local` y completa las credenciales de tu proyecto Supabase. Sin estas variables, las cuentas funcionan en modo demostración local.
3. Ejecuta `pnpm dev` y abre `http://localhost:3000`.

## Base de datos y autenticación

En Supabase, ejecuta primero [`supabase/migrations/20261001000000_initial_schema.sql`](supabase/migrations/20261001000000_initial_schema.sql) y luego [`supabase/seed.sql`](supabase/seed.sql). El esquema incluye perfiles, negocios, cuestionarios, respuestas, catálogo, fuentes, requisitos, reglas versionadas, diagnósticos, avance, auditoría y políticas de acceso por fila.

Asigna el rol `ADMINISTRADOR` a un perfil desde el panel SQL de Supabase para habilitar la administración en producción.

## Verificación

```bash
pnpm lint
pnpm test
pnpm build
```

## Publicación

Importa el repositorio en Vercel, agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en las variables de entorno y publica. La ruta `/admin` debe limitarse en la siguiente integración de sesión a perfiles `ADMINISTRADOR` o `SUPER_ADMIN`.
