# Estado real y actual del simulador

**Fecha de revisión:** 3 de octubre de 2026  
**Proyecto revisado:** `empresa-facil-peru`  
**Alcance:** código fuente, rutas, cuestionario, reglas, datos estáticos, persistencia, migraciones de Supabase y verificaciones locales. Este documento describe el estado actual; no contiene propuestas de mejora.

## 1. Naturaleza actual del producto

El proyecto es un prototipo web en Next.js llamado **Crea**. Su objetivo actual es orientar a una persona que quiere crear, formalizar o revisar un negocio en Perú mediante un cuestionario y una ruta de pasos.

En funcionamiento local, el simulador permite:

- Registrar o ingresar con una cuenta de demostración almacenada en el navegador, o usar Supabase si las credenciales públicas están configuradas.
- Completar un cuestionario de cinco secciones.
- Guardar el avance, las respuestas y el estado de cada paso en el almacenamiento local del navegador.
- Calcular una estimación de ventas mensuales a partir de una o más ofertas de productos o servicios.
- Generar una ruta con requisitos tributarios, societarios, municipales, laborales y de consumo según respuestas específicas.
- Mostrar orientación sobre RUC, CIIU, forma legal y regímenes tributarios.
- Consultar fichas de requisitos, documentos referenciales, entidades y enlaces oficiales.

El resultado es **orientativo**. El propio código marca las fuentes y las reglas como `POR_VERIFICAR`; por ello, ninguna obligación ni régimen se presenta como confirmado por una entidad pública.

## 2. Tecnología, ejecución y rutas

| Elemento | Estado actual |
| --- | --- |
| Framework | Next.js 16.3.7 con React 19.2.8 y TypeScript. |
| Estilos | Tailwind CSS. |
| Pruebas | Vitest. Hay 2 archivos de prueba y 12 pruebas automatizadas. |
| Datos de reglas | Archivos TypeScript estáticos en `src/lib/seed-catalog.ts`. |
| Base de datos prevista | Supabase: autenticación y tablas con políticas RLS definidas en migraciones. |
| Servidor local revisado | Disponible en `http://localhost:3000`. |

Las siguientes páginas devolvieron respuesta HTTP 200 durante la revisión local:

- `/`
- `/negocios`
- `/negocios/nuevo`
- `/negocios/nuevo?continuar=P20`
- `/negocios/demo/ruta`
- `/requisitos/ruc`
- `/admin`

Las rutas principales existentes son:

| Ruta | Comportamiento actual |
| --- | --- |
| `/` | Página de presentación del prototipo. |
| `/registro` y `/ingresar` | Registro e ingreso. Funcionan en modo demostración si no hay Supabase configurado. |
| `/negocios` | Espacio de evaluaciones; muestra una única tarjeta llamada “Mi empresa” y una opción para crear otra evaluación. |
| `/negocios/nuevo` | Cuestionario principal. Acepta `?continuar=<idPregunta>` y `?continuar=tributario`. |
| `/negocios/[id]/ruta` | Pantalla de ruta. El componente no utiliza el identificador de la URL para cargar una evaluación distinta. |
| `/requisitos/[id]` | Ficha individual de un requisito estático. |
| `/admin` | Consola de consulta de datos estáticos. Con Supabase activo exige rol administrativo; sin Supabase se muestra el componente de administración. |
| `/api/businesses` | Recibe el contexto del negocio; en modo demo devuelve `mode: demo`. Con Supabase inserta solo datos básicos en `businesses`. |
| `/api/diagnostics/evaluate` | Evalúa las reglas estáticas y devuelve la ruta y comparación tributaria para el contexto enviado. |

## 3. Flujo que vive hoy una persona usuaria

1. Puede crear una cuenta o iniciar sesión.
2. Inicia una evaluación desde “Mi espacio”.
3. Responde el cuestionario por secciones.
4. Al terminar, el navegador guarda un contexto resumido del negocio y navega siempre a `/negocios/demo/ruta`.
5. La ruta vuelve a enviar ese contexto local a `/api/diagnostics/evaluate`.
6. La pantalla muestra los requisitos seleccionados, la orientación tributaria, los documentos referenciales y enlaces a fuentes.
7. La persona puede cambiar manualmente el estado de los pasos entre los estados disponibles; estos cambios quedan en el almacenamiento local del navegador.

La pantalla “Mis evaluaciones” no consulta ni lista evaluaciones guardadas. La tarjeta “Mi empresa” abre la ruta de ejemplo o la última evaluación guardada en ese mismo navegador.

## 4. Cuestionario actual

El cuestionario está dividido en cinco etapas visuales:

1. **Tu negocio**
2. **Cómo funcionará**
3. **Ventas y tributación**
4. **Situación actual**
5. **Resultado**

### 4.1 Información recopilada

El formulario solicita, entre otros datos:

- Rubro, actividad descrita en palabras simples y etapa del negocio.
- Departamento, provincia y distrito.
- Número de personas involucradas, aportes y forma legal deseada: persona natural, persona jurídica o todavía no definida.
- Local físico, atención al público, almacenamiento, obras, operación digital o itinerante.
- Producto o servicio, fabricación propia o reventa.
- Estimación de ventas, origen de compras, tipo de clientes, comprobantes, pagos, canales de venta, importación, exportación y trabajadores.
- Situación de RUC, formalización previa, local y trámites existentes.

Las preguntas son condicionales: por ejemplo, las preguntas sobre local solo aparecen al indicar que habrá local, y las preguntas laborales aparecen al indicar que habrá trabajadores.

### 4.2 Rubros disponibles

La primera pregunta tiene 17 opciones:

1. Restaurante / alimentos
2. Tienda / comercio
3. Tecnología
4. Servicios
5. Construcción
6. Transporte
7. Manufactura
8. Turismo
9. Hospedaje
10. Educación
11. Salud
12. Belleza
13. Agropecuario
14. Importación
15. Exportación
16. Entretenimiento
17. Otro

Los primeros 16 rubros usan los íconos PNG incluidos en `public/rubros`. La opción **Otro** permanece disponible y permite escribir un rubro propio.

### 4.3 Preguntas sectoriales

El proyecto contiene bloques de preguntas específicas para estos rubros:

- Restaurante / alimentos
- Tienda / comercio
- Servicios
- Hospedaje
- Manufactura
- Agropecuario
- Salud
- Educación
- Transporte
- Construcción

Los rubros Tecnología, Turismo, Belleza, Importación, Exportación, Entretenimiento y Otro no tienen un bloque sectorial adicional dentro del cuestionario actual. Turismo sí tiene ejemplos y heurísticas específicas en el campo de descripción de actividad.

### 4.4 Actividad y CIIU

El código contiene 21 actividades estáticas vinculadas a códigos CIIU. Ejemplos: restaurante `5610`, tienda `4711`, desarrollo de software `6201`, agencia de viajes `7911`, operador turístico `7912` y transporte de carga `4923`.

La actividad se identifica desde el texto libre de la persona usuaria mediante coincidencias de palabras. Si el texto no coincide con los nombres o palabras previstas, `activityId` puede quedar vacío. Para turismo, la lógica diferencia principalmente entre agencia de viajes (`7911`) y operador de tours o excursiones (`7912`) según expresiones del texto.

El CIIU mostrado en la orientación proviene de ese catálogo estático del código. No se realiza una consulta en línea a SUNAT ni a un catálogo externo en el momento de responder.

## 5. Estimación de ventas y tributación

### 5.1 Estimación mensual

La pregunta P20 permite tres formas de responder:

- Calcular el total con una o varias filas de productos o servicios: nombre, cantidad mensual y precio promedio.
- Escribir un monto mensual directamente.
- Elegir uno de los rangos de ingresos disponibles, incluida la opción de no poder estimarlo todavía.

La calculadora suma las filas ingresadas y guarda el resultado como un monto mensual. No descuenta compras, alquileres, salarios ni otros gastos; la interfaz lo presenta como el total que se espera cobrar.

El cuestionario también pregunta por compras, activos, trabajadores, clientes, comprobantes y otros datos que usa la orientación tributaria.

### 5.2 Comparación de regímenes

El motor considera cuatro regímenes:

- Nuevo RUS (NRUS)
- Régimen Especial de Renta (RER)
- Régimen MYPE Tributario (RMT)
- Régimen General (RG)

La comparación implementa condiciones estáticas sobre forma legal, tipo de clientes, necesidad de comprobantes, ventas, compras, activos, trabajadores y ciertas actividades. Usa como referencia programada una UIT de S/ 5,500 para 2026 y límites codificados para los regímenes.

Sin embargo, la fuente `sunat-regimes` está configurada como `POR_VERIFICAR` y con próxima revisión al **1 de octubre de 2026**. Al evaluar el 3 de octubre de 2026, el endpoint tributario entrega los cuatro regímenes como `INFORMACION_INSUFICIENTE`, aun cuando el contexto complete varias condiciones. La interfaz puede mostrar una “primera opción a revisar” o una lista de datos faltantes, pero no confirma un régimen tributario.

La lógica de la tarjeta resumida de la ruta (`getTaxPath`) y la lógica de la comparación detallada (`RuleEngine.recommendTax`) son funciones separadas. Ambas usan datos del mismo contexto, pero no devuelven necesariamente el mismo nivel de certeza: la tarjeta puede señalar una opción para revisar y el comparador mantiene los regímenes como información por verificar debido al estado de la fuente.

## 6. Ruta de formalización que se genera

El motor de reglas incorpora ocho requisitos estáticos:

| Requisito | Condición actual en el motor |
| --- | --- |
| Inscripción en el RUC | Siempre se añade. |
| Elegir régimen tributario | Siempre se añade. |
| Evaluar constitución y reserva de nombre | Solo si se indicó persona jurídica. |
| Licencia de funcionamiento | Si se indicó local físico. |
| Inspección ITSE | Si hay local físico y atención al público. |
| T-Registro y PLAME | Si se indicaron trabajadores. |
| Libro de Reclamaciones | Si se atiende a personas o a ambos tipos de clientes. |
| Revisión sectorial especializada | Siempre se añade como informativa. |

Los requisitos no son obtenidos desde una entidad externa. Se seleccionan mediante reglas declaradas en `src/lib/seed-catalog.ts`, evaluadas por `src/lib/rule-engine.ts`.

Cada paso de la ruta puede mostrar:

- Entidad asociada.
- Documentos o información referencial.
- Explicación de por qué apareció.
- Enlace oficial estático.
- Guía práctica de dónde ir, qué solicitar y qué preparar.
- Estado editable por la persona usuaria.

El estado de los pasos (`PENDIENTE`, `EN_PROCESO`, `COMPLETADO`, `NO_APLICA` o `REQUIERE_REVISION`) se almacena localmente y no se sincroniza mediante el flujo actual de la interfaz con Supabase.

## 7. Fuentes y vigencia normativa mostradas

El catálogo contiene nueve fuentes: SUNAT para RUC, regímenes y planilla; SUNARP; Congreso de la República; PCM; Indecopi; DIGESA y una fuente genérica de revisión sectorial.

Las ocho fuentes principales tienen:

- Estado `POR_VERIFICAR`.
- Revisión anterior vacía.
- Próxima revisión `2026-10-01`.
- Responsable “Pendiente de asignación”.

La fuente sectorial genérica tiene última revisión `2026-07-01`, próxima revisión `2026-09-30` y el texto “No utilizar como requisito confirmado”.

Todas las reglas de requisitos tienen próxima revisión `2026-10-01`, excepto la regla sectorial, cuya próxima revisión es `2026-09-30`. Por la fecha actual de revisión del proyecto, el motor marca los resultados aplicados como `POR_VERIFICAR`.

Las fichas de requisitos muestran explícitamente que sirven para preparar preguntas ante la entidad y que no confirman una obligación individual. También indican que los documentos, costos y plazos se confirman ante la entidad competente.

## 8. Documentos referenciales actuales

La ruta puede listar cinco referencias asociadas a los pasos:

- DNI
- Actividad económica
- Domicilio fiscal
- Proyección de ingresos y compras
- Datos del proveedor

En la interfaz de la ruta, estas referencias incluyen explicaciones visuales y en lenguaje simple. Por ejemplo, la proyección de ingresos y compras se presenta como un cálculo para comparar opciones, no como un formato oficial; los datos del proveedor se relacionan con el Libro de Reclamaciones; y la actividad económica se explica como la descripción que se declarará al inscribir o actualizar el RUC.

La ficha individual de un requisito muestra únicamente los documentos enumerados en el catálogo estático correspondiente. No genera documentos oficiales, no completa formularios de SUNAT, SUNARP, municipalidades o Indecopi y no envía documentación a ninguna entidad.

## 9. Persistencia, cuentas y Supabase

### 9.1 Modo de demostración

Cuando faltan las variables públicas de Supabase, el producto entra en modo demostración:

- Las cuentas se guardan en `localStorage` del navegador.
- El registro guarda correo y nombre. El campo de contraseña es obligatorio en el formulario, pero no se conserva ni se valida en el modo demo.
- El ingreso busca una cuenta local por correo y la establece como cuenta activa.
- Borrando los datos del navegador se eliminan esas cuentas, respuestas, contextos y avances locales.
- Las claves de cuestionario, contexto y estado se separan por correo de la cuenta activa dentro del navegador.

El modo demo no ofrece autenticación validada por servidor ni acceso desde otro navegador o dispositivo.

### 9.2 Modo Supabase implementado

El archivo `.env.example` contiene marcadores para `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. No se encontró un archivo de credenciales de Supabase en la raíz revisada; por tanto, la revisión no pudo comprobar una conexión a un proyecto remoto ni el estado de migraciones aplicadas en la nube.

Cuando esas variables están presentes, la interfaz usa Supabase Auth para registro e inicio de sesión. La API `/api/businesses` obtiene la persona autenticada e inserta en `businesses` solo estos campos:

- `owner_id`
- `name`
- `purpose`
- `department`
- `province`
- `district`

Aunque la respuesta puede incluir un identificador de negocio creado, el flujo de finalización no lo utiliza para navegar: redirige a `/negocios/demo/ruta`.

### 9.3 Esquema disponible en el repositorio

Las migraciones definen tablas para perfiles, negocios, miembros, actividades, CIIU, preguntas, respuestas, instituciones, fuentes, requisitos, reglas, diagnósticos, resultados, avances y auditoría. También definen políticas RLS.

El flujo activo revisado no lee el catálogo, preguntas, respuestas, diagnósticos, resultados ni avances desde esas tablas. El cuestionario y las reglas usados por la aplicación proceden de archivos TypeScript estáticos, y la persistencia cotidiana de respuestas y avances ocurre en `localStorage`.

El `seed.sql` de Supabase contiene un conjunto inicial parcial. En particular, inserta un solo código CIIU (`5610`) y una sola relación actividad–CIIU para Restaurante, mientras que la aplicación usa su propio catálogo TypeScript con 21 mapeos de actividad y CIIU.

## 10. Administración

Existe una ruta `/admin` que consulta el catálogo cargado en el cliente. En la interfaz actual se presenta como consola de revisión de fuentes, reglas y requisitos; no se encontraron formularios ni llamadas que permitan crear, editar, aprobar o publicar reglas desde esa pantalla.

Cuando Supabase está configurado, la página comprueba el rol en `profiles` y permite el acceso solo a `ADMINISTRADOR` o `SUPER_ADMIN`. Sin Supabase configurado, el componente de administración se puede visualizar en el modo local.

## 11. Aspectos no conectados o no disponibles en el flujo actual

Los siguientes comportamientos no están presentes en el código de ejecución revisado:

- Consulta en tiempo real a SUNAT, SUNARP, municipalidades, Indecopi, DIGESA u otras entidades.
- Confirmación automática de CIIU, RUC, régimen, licencia, ITSE o cualquier obligación individual.
- Cálculo de fechas reales de vencimiento. La pestaña “Mis obligaciones” muestra un calendario orientativo y dice que no hay vencimientos verificados.
- Listado real de múltiples negocios o evaluaciones desde base de datos.
- Carga de una ruta distinta a partir del identificador en `/negocios/[id]/ruta`.
- Persistencia por API de respuestas completas, diagnósticos, resultados, estados de requisitos o documentos.
- Edición de reglas, fuentes, requisitos o catálogo desde la interfaz administrativa.
- Generación, carga o envío de trámites o documentos oficiales.
- Preguntas sectoriales dedicadas para los siete rubros indicados en la sección 4.3 que carecen de bloque sectorial.

## 12. Verificación realizada

Se ejecutaron las verificaciones siguientes sobre el estado actual del repositorio:

| Verificación | Resultado |
| --- | --- |
| `pnpm lint` | Correcto, sin errores reportados. |
| `pnpm test -- --run` | Correcto: 2 archivos y 12 pruebas aprobadas. |
| `pnpm build` | Correcto: compilación, validación de TypeScript y generación de 11 rutas. |
| Respuesta de las páginas principales en `localhost:3000` | Correcta: HTTP 200 para las siete rutas verificadas. |

Las pruebas existentes cubren reglas de ruta, visibilidad condicional de preguntas, opción Otro, vencimiento de reglas y parte de la orientación tributaria. No hay pruebas automatizadas de la interfaz completa del cuestionario, autenticación demo, guardado en Supabase, administración ni de integración con entidades externas.

## 13. Conclusión de estado

Actualmente, el simulador es un prototipo navegable y compilable que recoge información de un negocio, guarda la sesión principalmente en el navegador y produce una orientación basada en reglas y catálogos estáticos. La ruta, los documentos referenciales, la explicación de CIIU, la forma legal y la comparación tributaria están disponibles como ayuda informativa.

Por la configuración vigente de fuentes y fechas de revisión, los resultados regulatorios y tributarios se muestran como información pendiente de verificación formal. La base de datos y las políticas de Supabase están modeladas en el repositorio, pero el flujo que se ejecuta hoy no persiste en ella la mayor parte de la evaluación ni usa los identificadores de negocio para recuperar rutas independientes.
