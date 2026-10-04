# Auditoría técnica de Dulce Pausa

**Fecha:** 2026-10-03
**Repositorio:** [luzu1202/PWA](https://github.com/luzu1202/PWA)
**Sitio publicado:** [https://luzu1202.github.io/PWA/](https://luzu1202.github.io/PWA/)

## Alcance

Revisión estática de HTML, CSS, JavaScript, manifiesto, Service Worker y workflow; comprobaciones funcionales en navegador; verificación del despliegue y de la instalación de la PWA desde GitHub Pages. No incluye pentest, análisis automatizado de dependencias ni puntuación Lighthouse.

## Resultado ejecutivo

**Estado: apto para pruebas.** La validación y publicación de la revisión `9f77064` concluyeron correctamente en GitHub Actions. En la comprobación de Pages, el Service Worker `dulce-pausa-v8` controla la aplicación; se verificaron las funciones principales, la corrección visual del hero y el nuevo encuadre del tiramisú. La prueba completa de navegación offline no pudo repetirse en esta sesión: el navegador automatizado no completó la recarga con la red simulada como desconectada. Por tanto, se informa por separado la verificación de caché y no se afirma una nueva navegación offline exitosa con esta revisión.

## Hallazgos

| Prioridad | Hallazgo | Impacto | Recomendación |
|---|---|---|---|
| Baja | Las ocho fotos del catálogo y la foto del hero se sirven desde Unsplash. La aplicación intenta precargarlas y almacena las respuestas que consigue, pero no puede garantizar esas fotos sin conexión si la instalación ocurre sin acceso al proveedor. | El contenido de las recetas sigue accesible; puede mostrarse el SVG local de respaldo en lugar de una fotografía no almacenada. | Si se requiere independencia absoluta de terceros, incorporar las fotografías al repositorio y precargar archivos locales. |
| Baja | El manifiesto proporciona iconos SVG, sin variantes PNG de 192 y 512 píxeles. | La instalación funciona en el navegador probado, pero algunos sistemas instalables antiguos pueden preferir iconos rasterizados. | Añadir variantes PNG si se necesita ampliar compatibilidad de instalación. |
| Baja | La búsqueda compara texto en minúsculas, pero no normaliza diacríticos. | Buscar `limon` no coincide con `limón` si la tilde forma parte del contenido coincidente. | Normalizar acentos en la consulta y los campos indexados si se desea búsqueda tolerante a tildes. |
| Corregido | Una regla CSS tardía volvía a colorear el párrafo del hero con el tono apagado usado sobre fondos claros. | El texto perdía contraste sobre la portada Midnight Blue. | `.hero .hero-description` establece Buttermilk (`#FFF2BA`) con mayor especificidad. |
| Corregido | El hero usaba una ilustración de pastel y la receta del flan cargaba una foto que no correspondía al plato. | La imagen principal no mostraba claramente un postre de chocolate y la foto del flan era engañosa. | Se reemplazaron por fotografías Unsplash de pastel de chocolate y flan con caramelo; ambas se incorporan a la precarga del Service Worker. |
| Corregido | El encuadre vertical de la foto del tiramisú dejaba el postre parcialmente cortado en las tarjetas y el detalle. | El postre no se apreciaba completo en el recorte fijo de la imagen. | Se ajustó solo esta foto a `object-position: center 85%`; se verificó que ese valor se aplica en Pages tanto en tarjeta como en detalle. |

No se identificaron bloqueos ni hallazgos de prioridad alta o crítica durante esta revisión funcional. Esta observación no equivale a una auditoría de seguridad especializada.

## Verificaciones realizadas

- JavaScript sintácticamente válido en Actions: `node --check script.js` y `node --check sw.js`.
- Manifiesto JSON válido, con `display: standalone`, ruta de inicio y recursos necesarios presentes.
- Catálogo de ocho postres; búsqueda por `mascarpone`, filtro `Pasteles`, favoritos persistentes en `localStorage`, diálogo con ingredientes y pasos, y temporizador decrementando correctamente.
- Duraciones de tarjetas y detalle legibles y coherentes: tiramisú `4 h 35 min`, pay de limón `3 h 45 min`, cheesecake `5 h 45 min` y flan `3 h 15 min`; las esperas se indican en las descripciones y quedan fuera del temporizador activo.
- Temporizador de brownies inicia en 25 minutos, se ajusta a 26, decrementa a `25:59`, bloquea la edición mientras corre y reinicia con la duración elegida.
- En recetas sin cocción cronometrada, el temporizador queda sin valor inicial, pero puede configurarse como recordatorio manual; se comprobó con un minuto y reinicio.
- El tiempo se actualiza contra una hora de finalización, evitando perder precisión cuando el navegador limita los intervalos en segundo plano.
- La duración estimada aparece en las tarjetas y en el detalle, con horas y minutos legibles y las esperas descritas fuera del temporizador de cocción.
- El tema usa variables CSS Buttermilk (`#FFF2BA`) y Midnight Blue (`#0F3C65`); la tipografía combina Poppins, Playfair Display y Great Vibes con alternativas locales para modo offline.
- El párrafo del hero conserva texto Buttermilk sobre fondo Midnight Blue. El contraste calculado de esos colores supera WCAG AA para texto normal.
- La imagen del hero es una fotografía de pastel de chocolate; la del flan muestra flan con caramelo. Se verificaron ambas URL de Unsplash con respuesta de imagen.
- El manifiesto, el color del navegador, el icono y la caché versionada se alinearon con la nueva paleta. La caché Service Worker publicada es `dulce-pausa-v8` y la URL CSS actual es `styles.css?v=tiramisu-85`, para invalidar copias HTTP anteriores.
- En una auditoría anterior, las nuevas imágenes respondieron `200 image/jpeg`, el hero y el detalle del flan cargaron en navegador y el texto del hero alcanzó un contraste calculado de `10.06:1`.
- Una prueba offline previa en `localhost` conservó catálogo, estilos y fotografías usando una versión anterior de la caché; no sustituye la comprobación offline pendiente de esta revisión.
- En GitHub Pages se volvió a verificar la versión publicada: 8 tarjetas, 8 imágenes del catálogo cargadas, el buscador `mascarpone` devuelve 1 receta, el filtro `Pasteles` devuelve 2 y el diálogo del flan carga la foto `photo-1653988354010-39637252a2db` y muestra su fase activa de 50 minutos.
- Temporizador actual en Pages: brownies parte en `25:00`, se ajusta a `26:00`, avanza a `25:59` y se reinicia en `26:00`.
- Encuadre actual del tiramisú en Pages: la tarjeta y el detalle cargan la foto de receta con `object-position: 50% 85%`; la imagen responde cargada.
- La hoja CSS publicada aplica `rgb(255, 242, 186)` al texto descriptivo del hero sobre `rgb(15, 60, 101)`; el contraste calculado de estos colores es 10.06:1.
- El Service Worker controló Pages con scope `https://luzu1202.github.io/PWA/`. La caché actual es `dulce-pausa-v8`; incluye siete recursos esenciales y se precargan nueve fotos (hero más ocho recetas).
- Se comprobó en navegador la carga de la hoja `styles.css?v=tiramisu-85`, la activación de la caché `dulce-pausa-v8` y la posición calculada `50% 85%` tanto en la tarjeta como en el detalle del tiramisú.
- No se pudo completar una recarga de página mientras el navegador simulaba estar offline en esta sesión; la prueba anterior en localhost correspondía a una revisión/caché anterior y no se presenta como repetición de esta revisión.
- GitHub Actions [run 37101217479](https://github.com/luzu1202/PWA/actions/runs/37101217479): validación y publicación completadas con éxito para `9f7706445074054ef49a98ce52157ff7e23bd28a`.

## Rendimiento, accesibilidad y mantenimiento

- Las imágenes de tarjetas usan carga diferida; el layout de las tarjetas reserva altura para reducir desplazamientos al cargar.
- CSS, JavaScript, icono y SVG de respaldo se sirven desde el proyecto, sin bibliotecas de runtime; las fuentes externas son una mejora progresiva y cuentan con alternativas de sistema.
- Las familias Poppins, Playfair Display y Great Vibes se solicitan a Google Fonts; si no están disponibles, se utilizan las familias de reserva del sistema.
- La interfaz ofrece etiquetas accesibles, foco visible, estados de botones y adaptación a movimiento reducido.
- Los recursos esenciales se cachean antes de activar la nueva versión; la precarga remota de imágenes tolera fallos y no bloquea el shell.
- La caché del Service Worker se versiona como `dulce-pausa-v8` para renovar los recursos y fotografías en instalaciones anteriores. La URL de la hoja CSS también incluye el identificador `?v=tiramisu-85` para evitar reutilizar una copia HTTP anterior.
- El modo cocina usa Screen Wake Lock cuando está disponible y comunica la limitación cuando el navegador no lo permite.
- Lighthouse y la instalación física no se ejecutaron; no se reportan puntuaciones ni compatibilidad fuera del navegador probado.

## Conclusión

La versión `9f77064` está desplegada en GitHub Pages y el workflow de validación y publicación finalizó correctamente. La UI publicada, la búsqueda, el filtro, las fotos del flan y del tiramisú, el recorte del tiramisú y los recursos versionados se verificaron en navegador. La prueba de recarga con red desconectada no pudo repetirse en esta sesión; Lighthouse y la instalación en dispositivo físico siguen fuera del alcance. Esta actualización de la auditoría es local y no se ha subido a GitHub. Los hallazgos de baja prioridad describen mejoras opcionales de compatibilidad y autonomía.
