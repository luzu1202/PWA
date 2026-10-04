# Auditoría técnica de Dulce Pausa

**Fecha de actualización:** 2026-10-04
**Repositorio:** [luzu1202/PWA](https://github.com/luzu1202/PWA)
**Sitio publicado:** [https://luzu1202.github.io/PWA/](https://luzu1202.github.io/PWA/)

## Alcance

Revisión de HTML, CSS, JavaScript, manifiesto y Service Worker, incluyendo el catálogo remoto, traducción bajo demanda, estimaciones de duración y persistencia local. Se verificaron en navegador local el catálogo, el detalle de una receta internacional, la estimación, el enlace a la fuente original, la traducción y su almacenamiento. No incluye pentest, análisis automatizado de dependencias, Lighthouse ni verificación de publicación de los cambios actuales.

## Resultado ejecutivo

**Estado: cambios locales funcionales y listos para revisión.** El navegador cargó 168 resultados de postres y el detalle de Æbleskiver. La vista calculó un tiempo aproximado de 1 h 25 min, enlazó la fuente HTTPS y tradujo 10 ingredientes y 12 pasos al español; la traducción quedó persistida en `localStorage` y se confirmó de nuevo después de recargar. Con la conexión desactivada se volvió a cargar el shell y se abrió el detalle guardado, incluida su traducción. El texto visible no contiene «API» ni «TheMealDB». Las modificaciones están en el entorno local; no se hizo push. La versión publicada en Pages continúa siendo la revisión anterior.

## Hallazgos

| Prioridad | Hallazgo | Impacto | Recomendación |
|---|---|---|---|
| Baja | Las ocho fotos del catálogo y la foto del hero se sirven desde Unsplash. La aplicación intenta precargarlas y almacena las respuestas que consigue, pero no puede garantizar esas fotos sin conexión si la instalación ocurre sin acceso al proveedor. | El contenido de las recetas sigue accesible; puede mostrarse el SVG local de respaldo en lugar de una fotografía no almacenada. | Si se requiere independencia absoluta de terceros, incorporar las fotografías al repositorio y precargar archivos locales. |
| Baja | El manifiesto proporciona iconos SVG, sin variantes PNG de 192 y 512 píxeles. | La instalación funciona en el navegador probado, pero algunos sistemas instalables antiguos pueden preferir iconos rasterizados. | Añadir variantes PNG si se necesita ampliar compatibilidad de instalación. |
| Baja | La búsqueda compara texto en minúsculas, pero no normaliza diacríticos. | Buscar `limon` no coincide con `limón` si la tilde forma parte del contenido coincidente. | Normalizar acentos en la consulta y los campos indexados si se desea búsqueda tolerante a tildes. |
| Baja | TheMealDB es un proveedor externo y entrega nombres e instrucciones en el idioma de origen; la respuesta no aporta necesariamente duración o dificultad. | La carga depende de internet y parte del contenido puede aparecer en inglés; no se inventan datos que faltan. | Se conserva el catálogo local de ocho recetas, se informa la fuente/estado y se permite configurar el temporizador manualmente. |
| Baja | La traducción automática usa un servicio público con cuota anónima diaria, y su resultado puede dejar palabras sin traducir o contener errores. El contador local es conservador por navegador y no puede coordinar el consumo entre dispositivos que compartan la dirección de red. | Una receta puede no traducirse si no hay conexión, se agota la cuota o el servicio falla; el resultado no debe tratarse como traducción editorial revisada. | Se solicita solo bajo acción explícita, se limita el tamaño de segmentos y el consumo diario local, se conserva el original, se indica que la traducción es automática y se ofrece acceso a la fuente. |
| Baja | Las duraciones que no están publicadas por la fuente son una heurística calculada con los pasos, tiempos detectados y cantidad de ingredientes. | La preparación real cambia según equipo, experiencia y técnica; el total no es una duración verificada. | La interfaz etiqueta el resultado como «Tiempo total aproximado», describe que es una estimación y enlaza la fuente original segura cuando existe. |
| Corregido | Una regla CSS tardía volvía a colorear el párrafo del hero con el tono apagado usado sobre fondos claros. | El texto perdía contraste sobre la portada Midnight Blue. | `.hero .hero-description` establece Buttermilk (`#FFF2BA`) con mayor especificidad. |
| Corregido | El hero usaba una ilustración de pastel y la receta del flan cargaba una foto que no correspondía al plato. | La imagen principal no mostraba claramente un postre de chocolate y la foto del flan era engañosa. | Se reemplazaron por fotografías Unsplash de pastel de chocolate y flan con caramelo; ambas se incorporan a la precarga del Service Worker. |
| Corregido | El encuadre vertical de la foto del tiramisú dejaba el postre parcialmente cortado en las tarjetas y el detalle. | El postre no se apreciaba completo en el recorte fijo de la imagen. | Se ajustó solo esta foto a `object-position: center 85%`; se verificó que ese valor se aplica en Pages tanto en tarjeta como en detalle. |

No se identificaron bloqueos ni hallazgos de prioridad alta o crítica durante esta revisión funcional. Esta observación no equivale a una auditoría de seguridad especializada.

## Verificaciones de la publicación anterior (2026-10-03)

Los siguientes resultados corresponden a la publicación previa, no a la integración de Fetch API que permanece local.

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

## Verificaciones previas de integración local (2026-10-04)

- `node --check script.js` y `node --check sw.js`: completados sin errores. El manifiesto JSON también se pudo analizar.
- TheMealDB `filter.php?c=Dessert`: respuesta válida con 168 postres en la comprobación; la cantidad la controla el proveedor y puede cambiar.
- TheMealDB `lookup.php`: el primer resultado consultado entregó detalle válido, con 10 ingredientes y 12 pasos útiles tras limpiar separadores vacíos de la respuesta.
- La página local mostró 20 tarjetas al iniciar: ocho recetas propias y doce tarjetas externas. El botón de carga incremental presenta el siguiente bloque.
- La búsqueda por nombre `Æbleskiver` mostró una tarjeta; la búsqueda por ingrediente `mascarpone` encontró el tiramisú local. Los ingredientes de resultados externos se consultan al abrir el detalle.
- La lista remota y el detalle consultado aparecen en `localStorage`; también se comprobó que el favorito externo se guarda bajo el identificador del postre.
- La Cache API almacenó los endpoints de listado y detalle, y las imágenes TheMealDB descargadas; la respuesta de imagen durante navegación offline no se verificó individualmente.
- Al simular desconexión, la aplicación conservó las 20 tarjetas y pudo abrir los ingredientes y pasos del detalle previamente consultado. La interfaz informó que no se pudo actualizar la API y mantuvo los datos guardados.
- Los cambios se probaron en `localhost`; no se han desplegado a GitHub Pages. La respuesta offline de imágenes remotas no se considera verificada individualmente en esta auditoría.

## Verificaciones locales de traducción y estimaciones

- `node --check script.js` y `node --check sw.js`: sin errores tras la actualización.
- La aplicación local cargó 168 recetas internacionales y mostró las 20 tarjetas iniciales (ocho locales y doce adicionales).
- Æbleskiver abrió con 10 ingredientes, 12 pasos, tiempo total aproximado de 1 h 25 min y enlace HTTPS a la fuente original.
- El botón de traducción realizó la traducción al español, cambió a «Ver original» y permitió volver al texto original. La traducción quedó incluida en el detalle persistido; tras una recarga, el diálogo volvió a ofrecer la versión traducida.
- La solicitud de traducción usó 958 caracteres por intento del límite local de 4500; el contador acumuló 1916 tras dos pruebas. MyMemory puede devolver términos sin traducir; la interfaz lo advierte y preserva acceso al texto original. El locale `en|es-MX` tradujo `2 cups flour` como `2 tazas de harina`.
- El Service Worker de la caché `dulce-pausa-v15-recetas` se instaló y controló la página. Con el navegador en modo sin conexión, la aplicación volvió a cargar desde el shell guardado y abrió Æbleskiver con sus 10 ingredientes, 12 pasos y traducción guardada. Después se probó la traducción `en|es-MX` y se incrementó a `dulce-pausa-v17-recetas` para versionar ese locale y el último ajuste de estilos. La caché v17 se activó y controló la página en navegador.
- No se hizo push ni se comprobó la publicación de esta versión. La versión desplegada y las verificaciones históricas de Pages más arriba corresponden a revisiones anteriores.

## Rendimiento, accesibilidad y mantenimiento

- Las imágenes de tarjetas usan carga diferida; el layout de las tarjetas reserva altura para reducir desplazamientos al cargar.
- CSS, JavaScript, icono y SVG de respaldo se sirven desde el proyecto, sin bibliotecas de runtime. El catálogo se consume con Fetch API y la traducción se realiza solo al solicitarla; no se envían datos personales.
- Las familias Poppins, Playfair Display y Great Vibes se solicitan a Google Fonts; si no están disponibles, se utilizan las familias de reserva del sistema.
- La interfaz ofrece etiquetas accesibles, foco visible, estados de botones y adaptación a movimiento reducido.
- Los recursos esenciales se cachean antes de activar la nueva versión; la precarga remota de imágenes tolera fallos y no bloquea el shell.
- La caché local del Service Worker se versiona como `dulce-pausa-v17-recetas`; incluye caché de respuestas JSON de TheMealDB e imágenes descargadas. Las versiones de CSS y JavaScript se actualizan con query strings en el shell.
- El HTML de datos externos se escapa antes de renderizarse, y las URL de imágenes remotas se restringen a HTTPS en el host de TheMealDB.
- Las solicitudes Fetch API se limitan a doce segundos; el fallo o el rechazo de la API no impide usar las recetas propias.
- El modo cocina usa Screen Wake Lock cuando está disponible y comunica la limitación cuando el navegador no lo permite.
- Lighthouse y la instalación física no se ejecutaron; no se reportan puntuaciones ni compatibilidad fuera del navegador probado.

## Conclusión

La revisión publicada anteriormente (`9f77064`) fue validada en GitHub Actions. La integración nueva del catálogo, traducción, tiempo estimado, caché `dulce-pausa-v17-recetas` y documentos se comprobaron localmente y no se han subido a GitHub. Se verificaron en navegador el catálogo, el detalle, la traducción guardada, la estimación, la alternancia de idioma y el funcionamiento offline del shell/detalle; además, se validó la activación final de la caché v17 y la sintaxis. La variante `en|es-MX` del traductor se confirmó con el ejemplo de ingrediente (`2 cups flour` → `2 tazas de harina`). No se ejecutaron Lighthouse, instalación física ni comprobación individual de cada imagen remota. Se recomienda revisar traducciones automáticas y tiempos orientativos antes de cocinar.
