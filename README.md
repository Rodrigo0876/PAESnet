# PAESnet — prototipo funcional

Aplicación web HTML/CSS/JavaScript inspirada en un portal académico y adaptada a preparación PAES.

## Funciones incluidas

- Inicio con eventos, plan de estudio y resumen dinámico.
- 7 ensayos programados; 6 disponibles y el Ensayo 7 marcado como ausente.
- Ensayos ampliados a la extensión de referencia PAES: 65 preguntas en Competencia Lectora, M1 e Historia; 80 en Ciencias; 55 en M2. El Ensayo Mixto contiene 65 preguntas.
- Corrección automática y almacenamiento del último intento en `localStorage`.
- Asistencia PAES (6 de 7 = 86%).
- Revisión de correctas e incorrectas por ensayo.
- Detalle de pregunta en ventana flotante.
- Opción para volver a rendir un ensayo.
- Página de Resultados con promedio, mejor resultado, total de respuestas correctas y rendimiento por área.

## Cómo ejecutar

La forma recomendada es abrir la carpeta en Visual Studio Code y ejecutar `index.html` con Live Server. También puede abrirse directamente en un navegador, aunque `localStorage` es más consistente usando un servidor local.

## Archivos principales

- `index.html`: inicio.
- `asistencia.html`: ensayos, asistencia y revisión.
- `ensayo.html` / `ensayo.js`: realización de ensayos.
- `resultados.html` / `resultados.js`: resumen de rendimiento.
- `app.js`: lógica compartida del inicio y asistencia.
- `styles.css`: estilos de toda la aplicación.

## PAES de Invierno
La sección de Ensayos ahora permite alternar entre **PAES Regular** y **PAES de Invierno**. Los resultados se guardan por separado en el navegador para evitar que un intento de invierno reemplace un resultado regular. La página de Resultados también permite revisar ambas categorías de forma independiente.


## Perfil del estudiante
- Página `perfil.html` editable con nombre, curso, establecimiento, meta académica y puntajes objetivo.
- Los datos se guardan en `localStorage` bajo `paesnetStudentProfile`.
- El nombre, curso y metas se reflejan en Inicio, Ensayos y Resultados.

## Material oficial DEMRE
PAESnet mantiene las preguntas internas como simulaciones de práctica y enlaza a las publicaciones oficiales liberadas por DEMRE para consultar pruebas reales.


## Actualización de nivel PAES
- Banco de preguntas reescrito con situaciones, fuentes, interpretación de datos y modelamiento más cercanos al enfoque competencial de PAES.
- Las preguntas son originales de PAESnet y no copias de ítems oficiales DEMRE.
- Se agregaron plantillas visuales `calendario.html` y `estudio.html` para desarrollo posterior.


## Banco de preguntas ampliado

Las preguntas de PAESnet son simulaciones originales. La cantidad de preguntas por prueba toma como referencia la PAES de Invierno 2026 (Admisión 2027) publicada por DEMRE, sin reproducir ítems oficiales.
