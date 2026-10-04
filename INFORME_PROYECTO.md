# Dulce Pausa: PWA de recetas de postres

## 1. Objetivo General

Desarrollar una aplicación web progresiva, adaptable a dispositivos móviles y de escritorio, que permita descubrir, consultar y preparar recetas exclusivamente de postres con o sin conexión a internet.

## 2. Objetivos Específicos

Las metas concretas traducen el objetivo general en funcionalidades verificables de catálogo, preparación y disponibilidad offline.

- Presentar ocho recetas propias y ampliar el catálogo con postres obtenidos desde TheMealDB mediante Fetch API.
- Permitir búsquedas en tiempo real por nombre del catálogo, descripción e ingredientes de las recetas locales, además de filtros por categoría.
- Ofrecer instrucciones e ingredientes detallados, temporizador y modo cocina.
- Permitir traducir recetas internacionales al español bajo demanda y conservar la traducción para su lectura offline.
- Mostrar estimaciones orientativas del tiempo de preparación para recetas que no publican una duración, diferenciándolas de tiempos comprobados y enlazando la fuente original cuando está disponible.
- Guardar favoritos, la lista externa consultada y detalles recientes en `localStorage` para conservarlos entre sesiones y sin conexión.
- Instalar la aplicación y almacenar los recursos esenciales mediante un manifiesto y un Service Worker.
- Verificar la estructura, las funcionalidades principales y la estrategia de caché offline.

## 3. Introducción

Dulce Pausa reúne recetas de postres en una interfaz pensada para acompañar la preparación desde la elección del antojo hasta el último paso. El diseño combina un catálogo visual con herramientas útiles en cocina y una estrategia de almacenamiento local.

### 3.1 Contexto

Las recetas suelen consultarse desde el teléfono mientras se cocina, incluso en lugares con conectividad limitada. Una PWA permite mantener disponibles la interfaz y los datos guardados; Fetch API complementa el recetario local consultando un servicio público cuando hay conexión.

### 3.2 Alcance funcional

El catálogo local incluye tiramisú, brownies, pay de limón, cheesecake de frutos rojos, churros, galletas con chispas, flan y tarta de manzana. El catálogo internacional solicita a TheMealDB la categoría `Dessert` y obtiene ingredientes e instrucciones solo al abrir un postre. Las recetas que no están en español se pueden traducir mediante un botón explícito; la traducción automática se marca como tal, queda guardada localmente y no reemplaza el texto original. Las duraciones faltantes se estiman en el navegador a partir de los pasos y de sus tiempos expresos, se identifican como aproximadas y pueden contrastarse con el enlace HTTPS de la fuente original. Las imágenes fotográficas se obtienen de Unsplash o TheMealDB y un SVG incluido localmente sirve como respaldo.

## 4. Fundamentos Teóricos

Esta sección presenta las tecnologías que hacen posible la instalación, el almacenamiento local y el uso del recetario cuando falta la conexión.

### 4.1 Progressive Web App

Una PWA es una aplicación web que combina tecnologías web con capacidades de instalación y experiencias similares a las aplicaciones nativas. En este proyecto, el manifiesto define metadatos de instalación y el Service Worker habilita la carga offline.

### 4.2 Service Worker

El Service Worker es un script ejecutado por el navegador en segundo plano, registrado desde un origen seguro (HTTPS o `localhost`). Intercepta solicitudes `GET`, atiende recursos almacenados y proporciona una respuesta de navegación cuando la red no está disponible.

### 4.3 Fetch API y consumo de servicios web

Fetch API es la interfaz nativa del navegador para realizar solicitudes HTTP basadas en promesas. Dulce Pausa usa `fetch()` con `async`/`await` para solicitar la lista de postres y sus detalles a TheMealDB. Comprueba `response.ok`, convierte el cuerpo JSON, limita el tiempo de espera y presenta un estado comprensible cuando la solicitud falla. Fetch API es el mecanismo de consumo; TheMealDB es el servicio que aporta los datos.

### 4.4 Cache API y estrategia offline-first

La Cache API conserva los archivos estáticos, fotografías y respuestas de la API. Durante la instalación se guardan primero los archivos indispensables; después se intenta precargar cada fotografía sin hacer que un fallo externo impida instalar la aplicación. Las respuestas TheMealDB se solicitan a la red y se guardan en caché; si la red falla, el Service Worker intenta entregar la respuesta previamente almacenada.

### 4.5 LocalStorage

`localStorage` persiste los favoritos, la lista de postres externos y hasta veinte detalles externos consultados recientemente. Así, los resultados y recetas vistos antes pueden seguir accesibles sin conexión incluso antes de que el Service Worker controle la página. Los errores de almacenamiento se registran y la interfaz mantiene accesibles las recetas locales.

### 4.6 Traducción automática y límites del servicio

La traducción se solicita únicamente cuando la persona pulsa el botón correspondiente. El navegador divide el nombre, la descripción, los ingredientes y cada paso en segmentos cortos y los envía al servicio MyMemory con el par inglés-español latinoamericano. El servicio gratuito anónimo tiene una cuota diaria; la aplicación mantiene un contador local conservador, informa errores/cuota y conserva el original si la traducción falla. La traducción y su idioma automático se identifican en la vista de receta. El acceso offline a una traducción requiere haberla solicitado y guardado antes.

### 4.7 Estimación de duración

TheMealDB no proporciona siempre tiempos. Cuando falta la duración, el navegador suma duraciones expresas detectadas en los pasos y añade una estimación heurística de preparación; si detecta cocción sin duración indicada, utiliza un valor orientativo según el método descrito. La interfaz no presenta este cálculo como dato comprobado externamente y, si hay una fuente HTTPS, enlaza la receta original para que se pueda consultar.

## 5. Metodología

La solución se construyó como una aplicación cliente estática, con responsabilidades separadas y un recorrido de datos desde el catálogo hasta la interfaz.

### 5.1 Arquitectura

La solución es una aplicación estática, sin servidor propio ni dependencias de frameworks. `index.html`, `styles.css` y `script.js` dividen estructura, presentación y comportamiento; el manifiesto y el Service Worker agregan capacidades PWA. TheMealDB aporta datos desde una API externa, consumida desde el navegador mediante Fetch API. El sistema visual centraliza los colores en variables: Buttermilk (`#FFF2BA`) para el fondo y Midnight Blue (`#0F3C65`) para texto y acciones.

### 5.2 Flujo de datos

Ocho recetas curadas se definen localmente en `script.js`; en paralelo, Fetch API consulta `filter.php?c=Dessert` para obtener el catálogo de TheMealDB. Los detalles se solicitan bajo demanda con `lookup.php?i={id}`. Los resultados externos se normalizan antes de representarlos, se muestran por bloques de doce y se guardan en `localStorage`. La búsqueda por nombre, categoría y filtro de favoritos se aplican al catálogo local y a la lista externa; los ingredientes remotos se indexan después de abrir cada detalle. Los detalles y traducciones externos recientes se persisten para reutilizarlos offline. El tiempo calculado para recetas sin duración es una estimación local marcada como aproximada; el usuario puede configurar por separado el temporizador de una fase activa.

### 5.3 Estrategia offline-first

Al instalarse, el Service Worker almacena HTML, CSS, JavaScript, manifiesto, icono e imagen local de respaldo. También intenta precargar las fotografías. Para la navegación usa la red primero y la copia local de `index.html` si la solicitud falla; para recursos estáticos usa caché primero y almacena las nuevas respuestas correctas. Las respuestas de TheMealDB y las imágenes de sus recetas se conservan en caché; el catálogo y hasta veinte detalles, incluidas traducciones ya realizadas, se guardan además en `localStorage`. Sin conexión, las ocho recetas propias permanecen disponibles aunque todavía no se haya consultado el catálogo internacional. Una traducción nueva sí requiere conectividad.

## 6. Desarrollo

El desarrollo concreta esa arquitectura en los documentos de la aplicación, el comportamiento de la interfaz y los recursos necesarios para su instalación y caché.

### 6.1 `index.html`

Define la página en español con encabezado, presentación, filtros, campo de búsqueda, estado y controles del catálogo, aviso offline, pie de página y diálogo accesible para el detalle de cada receta. El diálogo incorpora controles para solicitar o revertir la traducción, estado accesible y enlaces a fuentes originales cuando existen. También declara el manifiesto, los metadatos de visualización, el color Midnight Blue del navegador y las fuentes Poppins, Playfair Display y Great Vibes.

### 6.2 `styles.css`

Implementa una identidad visual de repostería con Buttermilk (`#FFF2BA`) y Midnight Blue (`#0F3C65`) en variables CSS; las superficies crema y el acento caramelo completan los estados secundarios. La descripción del hero usa Buttermilk para mantener contraste sobre el fondo azul. La ilustración se reemplazó por una fotografía Unsplash de pastel de chocolate. El encuadre específico del tiramisú usa `object-position: center 85%` tanto en la tarjeta como en el detalle, para mostrar mejor el postre dentro del recorte. Poppins se usa para lectura, Playfair Display para títulos y Great Vibes aporta un acento caligráfico inspirado en «Velvet Moon». Las fuentes web tienen alternativas tipográficas para el uso offline. Incluye tarjetas responsivas, diálogo de receta, estados vacíos, avisos, foco visible y adaptación a pantallas pequeñas y a movimiento reducido.

### 6.3 `script.js`

Implementa las ocho recetas locales, consulta la categoría Dessert y obtiene los detalles remotos con Fetch API, bajo demanda. Presenta doce resultados externos por bloque, búsqueda y filtros, favoritos, estados de carga/error y persistencia para uso offline. Normaliza y escapa el contenido remoto antes de insertarlo en el HTML. Para una receta externa sin duración calcula una estimación heurística y la distingue claramente de un valor publicado; permite abrir la fuente original segura. El botón de traducción transforma nombre, descripción, ingredientes y pasos bajo demanda, limita segmentos y consumo diario, informa errores y persiste el resultado sin destruir el original. Las recetas locales conservan sus duraciones, instrucciones, temporizador ajustable y modo cocina. El Service Worker se registra y cachea recursos esenciales, respuestas de recetas e imágenes.

### 6.4 `manifest.json`

Establece nombre, nombre corto, idioma, ámbito, ruta de inicio, colores, visualización `standalone`, categorías e icono SVG escalable.

### 6.5 `sw.js`

Versiona las cachés como `dulce-pausa-v14-recetas`, elimina versiones antiguas en la activación, reclama las páginas abiertas y administra solicitudes de navegación, recursos propios, imágenes de Unsplash y TheMealDB, así como sus respuestas JSON. La instalación de recursos esenciales es obligatoria; la precarga de fotografías es tolerante a fallos de red.

### 6.6 Recursos visuales

`assets/icon.svg` aporta el icono de marca de la PWA y `assets/postre-placeholder.svg` permite representar un postre local si una fotografía no puede cargarse.

## 7. Resultados

Los resultados describen el comportamiento implementado y las pruebas locales de integración con el servicio en la fecha de actualización.

### 7.1 Funcionalidades implementadas

- Catálogo visual de ocho recetas locales y carga de resultados de postres internacionales; el número de resultados depende del servicio externo.
- Paleta Buttermilk/Midnight Blue validada en navegador: fondo `rgb(255, 242, 186)`, portada `rgb(15, 60, 101)` y títulos `rgb(15, 60, 101)`.
- Fuentes calculadas como Poppins para lectura, Playfair Display para titulares y Great Vibes para el acento caligráfico.
- Búsqueda por nombre en las recetas locales y remotas cargadas, descripción e ingredientes locales, filtros por categoría y vista de favoritos.
- Detalle con ingredientes, pasos ordenados, tiempo total separado de las fases activas, temporizador ajustable por minuto y modo cocina.
- Persistencia local de favoritos, indicador online/offline e instalación PWA.
- Integración Fetch API para lista y detalle, carga de doce tarjetas remotas por bloque y mensaje accesible ante errores.
- Traducción manual bajo demanda de recetas, con advertencia de traducción automática, fallback al original, límite diario local y persistencia offline.
- Estimación de tiempo externa identificada como aproximada, con enlace HTTPS a la receta original cuando está disponible.
- Caché versionada de recursos esenciales, respuestas TheMealDB e imágenes; lista externa y hasta veinte detalles recientes, traducción incluida, persisten en `localStorage`.

### 7.2 Pruebas y checklist PWA

| Verificación | Resultado |
|---|---|
| Archivos principales y recursos locales presentes | Implementado |
| Catálogo limitado a recetas de postres | Verificado en los datos de la aplicación |
| Búsqueda, filtros y persistencia de favoritos | Verificados antes de la integración; la búsqueda y filtros ahora abarcan recetas locales y resultados externos cargados |
| Fetch API: listado TheMealDB | Verificado localmente: `filter.php?c=Dessert` respondió con 168 postres el 2026-10-04; la UI cargó 12 tarjetas externas junto a las ocho recetas locales |
| Fetch API: detalle | Verificado localmente: el primer resultado abrió detalle con 10 ingredientes y 12 pasos útiles obtenidos de `lookup.php` |
| Persistencia offline de catálogo y detalle | Verificada localmente: lista y detalle guardados en `localStorage`; tras simular desconexión se conservaron 20 tarjetas y el detalle del postre previamente consultado |
| Error de red del catálogo | Verificado al simular desconexión en la revisión anterior: el catálogo local y los resultados guardados siguieron visibles, y el detalle guardado pudo abrirse |
| Diálogo y pasos de receta | Verificados: detalle de brownies abre, presenta 8 ingredientes y 4 pasos, y cierra correctamente |
| Tiempo total y esperas | Verificados en tarjetas y detalle: tiramisú 4 h 35 min, pay de limón 3 h 45 min, cheesecake 5 h 45 min y flan 3 h 15 min; notas aclaran refrigeración/reposo |
| Temporizador de fase activa | Verificado en Pages: brownies inicia en `25:00`, se ajusta a `26:00`, decrementa a `25:59` y reinicia en `26:00`; la prueba previa confirmó el bloqueo de edición durante la marcha |
| Temporizador en recetas sin cocción cronometrada | Verificado: tiramisú y pay no cargan la espera larga en el temporizador; se puede configurar un temporizador opcional manualmente |
| Temporizador en segundo plano | El tiempo restante se calcula desde una hora objetivo, no contando ticks; se evita acumular deriva si el navegador limita intervalos |
| Modo cocina | Implementado; la retención de pantalla utiliza Screen Wake Lock cuando el navegador la admite |
| Estimación para receta internacional sin tiempo | Verificada en Æbleskiver: muestra 1 h 25 min como tiempo aproximado, usando instrucciones/ingredientes y sin atribuir la duración a la fuente |
| Enlace a fuente original | Verificado en Æbleskiver; enlace HTTPS se muestra tanto junto al tiempo como en las herramientas de idioma |
| Traducción automática al español | Verificada en navegador para Æbleskiver: 10 ingredientes y 12 pasos, botón de alternancia original/traducción, advertencia, traducción guardada y lectura tras recargar |
| Texto visible de la página | Verificado en navegador: no muestra los términos técnicos «API» ni «TheMealDB» |
| Disponibilidad offline | Verificada en navegador: con la conexión desactivada, el shell cargó, el Service Worker controló la página y Æbleskiver abrió con 10 ingredientes, 12 pasos y su traducción guardada |
| Manifiesto con modo `standalone` e icono | Implementado |
| Registro y control del Service Worker | Verificados en Pages: Service Worker activo, controlador presente y scope restringido a `https://luzu1202.github.io/PWA/` |
| Actualización de shell y fotos | Caché local actual `dulce-pausa-v17-recetas`; CSS `styles.css?v=tiramisu-87` y JavaScript `script.js?v=translation-estimates-v16` |
| Publicación en GitHub Pages | Verificada: respuesta HTTP 200 en [Dulce Pausa](https://luzu1202.github.io/PWA/) |
| Workflow de GitHub Actions | Ejecución [37101217479](https://github.com/luzu1202/PWA/actions/runs/37101217479) completada correctamente para el commit `9f7706445074054ef49a98ce52157ff7e23bd28a` |
| Instalación del Service Worker en GitHub Pages | Verificada en la revisión publicada: scope `https://luzu1202.github.io/PWA/`, worker activo y cachés de la versión `dulce-pausa-v8` |
| Caché offline del shell | Recursos del shell comprobados en la Cache API; no se pudo completar una recarga offline automatizada en esta repetición de la auditoría |
| Catálogo y recursos visuales publicados | 8 tarjetas y 8 imágenes del catálogo cargadas; fotografía del flan correcta y carga confirmada |
| Encuadre del tiramisú | Verificado en Pages: la imagen de tarjeta y detalle carga con `object-position: 50% 85%` |
| Búsqueda y filtros publicados | «mascarpone» devuelve 1 receta y «Pasteles» muestra 2 |
| Contraste y paleta publicados | Hero: texto `rgb(255, 242, 186)` sobre fondo `rgb(15, 60, 101)`, contraste 10.06:1 |
| Lighthouse / métricas de rendimiento | No ejecutado; no se reportan puntuaciones sintéticas |

El Service Worker no puede operar al abrir `index.html` directamente mediante `file://`; debe servirse desde `localhost` o HTTPS. Las fotos locales y externas se guardan cuando se descargan, con un SVG local de respaldo en caso contrario. Las recetas adicionales dependen de la disponibilidad del proveedor; la traducción automática nueva necesita conectividad y está sujeta a la cuota gratuita, mientras las traducciones guardadas pueden leerse offline. Esta revisión fue probada localmente y no se ha publicado ni se afirma que esté desplegada en GitHub Pages.

### 7.3 Auditoría de código y conclusiones

La arquitectura no agrega dependencias de runtime ni servidor propio. El contenido remoto se normaliza, las cadenas se escapan antes de insertarse en el DOM, las solicitudes esperan como máximo doce segundos y los errores se hacen visibles sin desactivar el catálogo local. La UI carga doce tarjetas externas por bloque; las fotos se cargan de forma diferida. La lista y los últimos veinte detalles se guardan en `localStorage`; las respuestas y fotos descargadas también usan Cache API. En navegador local se comprobaron el catálogo, los detalles de Æbleskiver, su estimación, el enlace original, la traducción automática, la alternancia al original, el guardado de la traducción y la ausencia de términos técnicos en el texto visible. Con la conexión desactivada se volvió a cargar la aplicación y se abrió el detalle traducido guardado, confirmando el uso offline. Lighthouse e instalación en dispositivo físico no se ejecutaron. La auditoría técnica actualizada está en [AUDITORIA_PWA.md](./AUDITORIA_PWA.md).

La revisión publicada previamente verificó el texto Buttermilk sobre el hero Midnight Blue, con contraste 10.06:1, y el encuadre del tiramisú (`object-position: center 85%`) en tarjeta y detalle. Esta versión local incrementa la caché del Service Worker a `dulce-pausa-v17-recetas` para incluir la traducción y estimaciones; no invalida la versión publicada hasta que se despliegue.

La publicación anterior corresponde al commit `9f7706445074054ef49a98ce52157ff7e23bd28a`; la validación y el despliegue finalizaron correctamente en [GitHub Actions](https://github.com/luzu1202/PWA/actions/runs/37101217479). La traducción, las estimaciones y esta actualización documental son cambios locales sin push; aún no forman parte de GitHub Pages.

## 8. Resumen

Dulce Pausa es una PWA para explorar ocho recetas locales y un catálogo internacional de postres. Permite buscar, guardar favoritos, consultar y traducir instrucciones, ver duraciones aproximadas claramente identificadas, usar un temporizador y activar el modo cocina. Se construyó con HTML, CSS y JavaScript nativos, un manifiesto instalable, un Service Worker con caché offline y recursos visuales locales de respaldo.
