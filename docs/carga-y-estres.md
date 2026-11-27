# Pruebas locales de carga y estrés

Las pruebas usan la exportación estática de CREA y los emuladores de Firebase. Requieren Node.js 24, pnpm, Java y Firebase CLI. El generador usa HTTP contra los emuladores en `127.0.0.1` y crea cuentas y evaluaciones sintéticas en el proyecto `demo-crea`. Inicia una instancia de emuladores dedicada a estas pruebas.

Compila el repositorio desde la revisión que quieras medir y abre los emuladores en la misma carpeta:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm dlx firebase-tools emulators:start --only hosting,auth,firestore --project demo-crea
```

Con los emuladores activos, ejecuta los escenarios uno después del otro desde otra terminal:

```sh
node tests/load/run.mjs --scenario firebase --output carga-firebase.json
node tests/load/run.mjs --scenario hosting --output carga-hosting.json
```

## Qué mide

| Escenario | Ciclo medido |
| --- | --- |
| Hosting | Descarga de una de seis páginas exportadas y de un archivo JavaScript de la compilación. Comprueba el estado HTTP y el contenido esperado de la página. |
| Firebase | Consulta de las evaluaciones de la cuenta autenticada. El 10 % de los ciclos programados vuelve a iniciar sesión y otro 10 % guarda y relee la evaluación propia con una transacción de Firestore. La preparación de las cuentas queda fuera de la medición. |

La prueba mantiene 1 operación concurrente como referencia y 36 como carga de trabajo elegida para el estudio. Aumenta a 64, 96 y 128 en estrés. Los clientes sintéticos vuelven a iniciar un ciclo al terminar el anterior. Las etapas duran 15 segundos por defecto y la carga dura el doble. Cada solicitud tiene un máximo de 5 segundos. Con 10 % de fallos o un p95 de 4 segundos se detiene la escalada. Se espera 1 segundo entre etapas. Tras el último escalón se deja pasar entre 3 y 4 segundos antes de medir de nuevo con 1 cliente.

El JSON conserva los intentos, los fallos por causa, los ciclos exitosos por segundo y los percentiles de latencia de ciclos exitosos. El p95 indica el tiempo en el que terminaron 95 de cada 100 ciclos exitosos. Como referencia de QA local se usa un máximo de 1 % de fallos y un p95 de 1 segundo para Hosting o 2 segundos para Firebase. El comando devuelve un código distinto de cero si la carga de 36 clientes o la recuperación quedan fuera de esa referencia.

La descarga de Hosting mide HTTP sin renderizar el navegador. Los resultados dependen del equipo y los emuladores. La capacidad del servicio público, el rendimiento del navegador y los tiempos del proveedor externo de IA requieren mediciones en sus propios entornos.
