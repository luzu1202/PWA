# Auditoría técnica de Dulce Pausa

**Fecha de actualización:** 2026-10-04
**Repositorio:** [luzu1202/PWA](https://github.com/luzu1202/PWA)
**Sitio publicado:** [https://luzu1202.github.io/PWA/](https://luzu1202.github.io/PWA/)

## Alcance

Revisión funcional de HTML, CSS, JavaScript, manifiesto y Service Worker, incluyendo el catálogo remoto, traducción bajo demanda, estimaciones de duración y dificultad, y persistencia local. Se comprobaron funciones clave en navegador local y en GitHub Pages. No incluye pentest, análisis automatizado de dependencias, Lighthouse ni pruebas en dispositivos físicos.

## Resultado ejecutivo

**Estado: la aplicación está publicada y sus funciones principales fueron verificadas.** El catálogo ofrece recetas locales e internacionales, búsqueda, favoritos, detalles, traducción opcional y temporizador. El modo cocina y la lógica Wake Lock fueron eliminados. Las dificultades y duraciones que no publica la fuente se presentan como estimaciones; los niveles verificados enlazan a su fuente original.

## Hallazgos

| Prioridad | Hallazgo | Impacto | Recomendación |
|---|---|---|---|
| Baja | Las ocho fotos del catálogo y la foto del hero se sirven desde Unsplash. La aplicación intenta precargarlas y almacena las respuestas que consigue, pero no puede garantizar esas fotos sin conexión si la instalación ocurre sin acceso al proveedor. | El contenido de las recetas sigue accesible; puede mostrarse el SVG local de respaldo en lugar de una fotografía no almacenada. | Si se requiere independencia absoluta de terceros, incorporar las fotografías al repositorio y precargar archivos locales. |
| Baja | El manifiesto proporciona iconos SVG, sin variantes PNG de 192 y 512 píxeles. | La instalación funciona en el navegador probado, pero algunos sistemas instalables antiguos pueden preferir iconos rasterizados. | Añadir variantes PNG si se necesita ampliar compatibilidad de instalación. |
| Baja | La búsqueda compara texto en minúsculas, pero no normaliza diacríticos. | Buscar `limon` no coincide con `limón` si la tilde forma parte del contenido coincidente. | Normalizar acentos en la consulta y los campos indexados si se desea búsqueda tolerante a tildes. |
| Baja | TheMealDB no proporciona campos normalizados de duración o dificultad en el catálogo consultado. Las páginas fuente no siempre publican dificultad o no se pudieron verificar. | Una inferencia sin etiqueta podría confundirse con una calificación publicada. | La interfaz conserva y enlaza los niveles explícitos encontrados; marca los demás como estimaciones, los afina con los datos del detalle y conserva los niveles editoriales de las recetas locales. |
| Baja | La traducción automática usa un servicio público con cuota anónima diaria, y su resultado puede dejar palabras sin traducir o contener errores. El contador local es conservador por navegador y no puede coordinar el consumo entre dispositivos que compartan la dirección de red. | Una receta puede no traducirse si no hay conexión, se agota la cuota o el servicio falla; el resultado no debe tratarse como traducción editorial revisada. | Se solicita solo bajo acción explícita, se limita el tamaño de segmentos y el consumo diario local, se conserva el original, se indica que la traducción es automática y se ofrece acceso a la fuente. |
| Baja | Las duraciones que no están publicadas por la fuente son una heurística calculada con los pasos, tiempos detectados y cantidad de ingredientes. | La preparación real cambia según equipo, experiencia y técnica; el total no es una duración verificada. | La interfaz etiqueta el resultado como «Tiempo total aproximado», describe que es una estimación y enlaza la fuente original segura cuando existe. |
| Corregido | Una regla CSS tardía volvía a colorear el párrafo del hero con el tono apagado usado sobre fondos claros. | El texto perdía contraste sobre la portada Midnight Blue. | `.hero .hero-description` establece Buttermilk (`#FFF2BA`) con mayor especificidad. |
| Corregido | El hero usaba una ilustración de pastel y la receta del flan cargaba una foto que no correspondía al plato. | La imagen principal no mostraba claramente un postre de chocolate y la foto del flan era engañosa. | Se reemplazaron por fotografías Unsplash de pastel de chocolate y flan con caramelo; ambas se incorporan a la precarga del Service Worker. |
| Corregido | El encuadre vertical de la foto del tiramisú dejaba el postre parcialmente cortado en las tarjetas y el detalle. | El postre no se apreciaba completo en el recorte fijo de la imagen. | Se ajustó solo esta foto a `object-position: center 85%`; se verificó que ese valor se aplica en Pages tanto en tarjeta como en detalle. |

No se identificaron bloqueos ni hallazgos de prioridad alta o crítica durante esta revisión funcional. Esta observación no equivale a una auditoría de seguridad especializada.

## Verificaciones

- `node --check script.js` y `node --check sw.js` finalizaron sin errores; `manifest.json` se pudo analizar como JSON.
- El flujo de GitHub Actions validó y publicó correctamente el commit `f6ccbdb`; la página de GitHub Pages sirve el JavaScript actualizado.
- El catálogo internacional respondió con 168 postres en la consulta realizada. Con las ocho recetas locales, el catálogo contiene 176 recetas; la cantidad remota puede cambiar si el proveedor actualiza sus datos.
- La búsqueda por nombre y por ingrediente, el filtro por categoría, la carga incremental y la exclusión de nombres repetidos entre recetas locales y externas se comprobaron en el navegador.
- Se revisaron los títulos y descripciones internacionales cargados: no se encontraron nombres duplicados tras normalizar tildes, mayúsculas y puntuación, ni descripciones repetidas. Las descripciones permanecen personalizadas al actualizar los datos de una receta.
- Se contrastaron los niveles de dificultad internacionales: 52 fuentes publican un nivel explícito, 116 recetas muestran una estimación y 22 casos no se pudieron verificar en sus fuentes. El nivel publicado se acompaña de la fuente; las estimaciones se identifican como aproximadas.
- El detalle internacional consultado mostró ingredientes, pasos, duración aproximada y enlace HTTPS a la fuente. Los datos consultados, traducciones y favoritos se conservan localmente.
- La traducción bajo demanda permitió alternar entre texto traducido y original; se comprobó la persistencia local de la traducción. El servicio puede limitar solicitudes o devolver traducciones parciales, y la aplicación conserva el texto original.
- En GitHub Pages se comprobó que no aparece el modo cocina en el catálogo ni en el detalle de Brownies. El temporizador del detalle sigue disponible y funcional.
- El Service Worker almacenó recursos de la aplicación y respuestas consultadas. En una prueba offline local, el shell y el detalle internacional previamente consultado siguieron disponibles; no se verificó individualmente la disponibilidad offline de cada imagen remota.
- Las tarjetas usan carga diferida de imágenes y reservan espacio para reducir saltos de diseño. La interfaz incluye etiquetas accesibles, foco visible y adaptación a movimiento reducido; las fuentes externas tienen alternativas locales.
- Las solicitudes de catálogo tienen límite de espera y, si el proveedor falla, las recetas locales siguen disponibles. Los datos externos se escapan antes de mostrarse y las imágenes remotas se restringen a HTTPS.
- Lighthouse, la instalación física y la compatibilidad fuera del navegador probado no se evaluaron; no se reportan puntuaciones ni resultados para esas pruebas.

## Conclusión

Dulce Pausa está publicada en GitHub Pages y ofrece acceso al catálogo, detalles de recetas, favoritos, traducción opcional y temporizador, con soporte offline para recursos y datos consultados. Las fotografías remotas y los servicios externos pueden requerir conexión. Las comprobaciones funcionales no sustituyen una auditoría de seguridad, Lighthouse ni pruebas en dispositivos físicos.
