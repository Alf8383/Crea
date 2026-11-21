# CREA

MVP web para orientar la creación y formalización de restaurantes, cafeterías y servicios afines en Perú, incluidos el delivery, la comida para llevar y los puestos móviles. La aplicación usa preguntas sencillas, un motor de reglas independiente de la interfaz y fuentes oficiales trazables.

## Ejecutar localmente

1. Instala las dependencias con `pnpm install`.
2. Copia `.env.example` como `.env.local` y completa las credenciales de tu proyecto Supabase. Sin estas variables, las cuentas funcionan en modo demostración local.
3. Ejecuta `pnpm dev` y abre `http://localhost:3000`.

## Base de datos y autenticación

En Supabase, aplica los archivos de [migraciones](supabase/migrations) en orden y luego ejecuta [los datos iniciales](supabase/seed.sql). En una base existente aplica solo las migraciones pendientes. La especialización agrega el cuestionario a los nuevos registros y desactiva las actividades de otros rubros del catálogo. Conserva los registros anteriores.

Los borradores de demostración se guardan en el navegador. Al retomar un borrador gastronómico anterior, confirma que el servicio de comidas para consumo inmediato es tu actividad principal para volver a evaluar tus respuestas.

Asigna el rol `ADMINISTRADOR` a un perfil desde el panel SQL de Supabase para habilitar la administración en producción.

## Verificación

```bash
pnpm lint
pnpm test
pnpm build
```

## Publicación

Importa el repositorio en Vercel, agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en las variables de entorno y publica. La ruta `/admin` debe limitarse en la siguiente integración de sesión a perfiles `ADMINISTRADOR` o `SUPER_ADMIN`.
