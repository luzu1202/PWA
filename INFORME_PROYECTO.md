# Dulce Pausa: PWA de recetas de postres

## 1. Objetivo General

Desarrollar una aplicación web progresiva, adaptable a dispositivos móviles y de escritorio, que permita descubrir, consultar y preparar recetas exclusivamente de postres con o sin conexión a internet.

## 2. Objetivos Específicos

Las metas concretas traducen el objetivo general en funcionalidades verificables de catálogo, preparación y disponibilidad offline.

- Presentar un catálogo interactivo con ocho recetas dulces, fotografía, categoría, duración y dificultad.
- Permitir búsquedas en tiempo real por nombre, descripción e ingredientes, además de filtros por categoría.
- Ofrecer instrucciones e ingredientes detallados, temporizador y modo cocina.
- Guardar los favoritos en `localStorage` para conservarlos entre sesiones y sin conexión.
- Instalar la aplicación y almacenar los recursos esenciales mediante un manifiesto y un Service Worker.
- Verificar la estructura, las funcionalidades principales y la estrategia de caché offline.

## 3. Introducción

Dulce Pausa reúne recetas de postres en una interfaz pensada para acompañar la preparación desde la elección del antojo hasta el último paso. El diseño combina un catálogo visual con herramientas útiles en cocina y una estrategia de almacenamiento local.

### 3.1 Contexto

Las recetas suelen consultarse desde el teléfono mientras se cocina, incluso en lugares con conectividad limitada. Una PWA permite mantener disponibles la interfaz, las recetas, las imágenes almacenadas y los favoritos tras la primera carga con conexión.

### 3.2 Alcance funcional

El catálogo incluye tiramisú, brownies, pay de limón, cheesecake de frutos rojos, churros, galletas con chispas, flan y tarta de manzana. La aplicación no incluye platos salados. Las imágenes fotográficas se obtienen de Unsplash; un recurso SVG incluido localmente sirve como respaldo para las imágenes que no estén disponibles.

## 4. Fundamentos Teóricos

Esta sección presenta las tecnologías que hacen posible la instalación, el almacenamiento local y el uso del recetario cuando falta la conexión.

### 4.1 Progressive Web App

Una PWA es una aplicación web que combina tecnologías web con capacidades de instalación y experiencias similares a las aplicaciones nativas. En este proyecto, el manifiesto define metadatos de instalación y el Service Worker habilita la carga offline.

### 4.2 Service Worker

El Service Worker es un script ejecutado por el navegador en segundo plano, registrado desde un origen seguro (HTTPS o `localhost`). Intercepta solicitudes `GET`, atiende recursos almacenados y proporciona una respuesta de navegación cuando la red no está disponible.

### 4.3 Cache API y estrategia offline-first

La Cache API conserva los archivos estáticos y las fotografías. Durante la instalación se guardan primero los archivos indispensables; después se intenta precargar cada fotografía sin hacer que un fallo externo impida instalar la aplicación. Las visitas a recursos externos también se guardan para futuras consultas offline.

### 4.4 LocalStorage

`localStorage` persiste los identificadores de las recetas favoritas en el dispositivo. La interfaz maneja errores de lectura o escritura y limita los identificadores guardados a las recetas que forman parte del catálogo.

## 5. Metodología

La solución se construyó como una aplicación cliente estática, con responsabilidades separadas y un recorrido de datos desde el catálogo hasta la interfaz.

### 5.1 Arquitectura

La solución es una aplicación estática, sin servidor de datos ni dependencias de frameworks. `index.html`, `styles.css` y `script.js` dividen estructura, presentación y comportamiento; el manifiesto y el Service Worker agregan capacidades PWA. El sistema visual centraliza los colores en variables: Buttermilk (`#FFF2BA`) para el fondo y Midnight Blue (`#0F3C65`) para texto y acciones.

### 5.2 Flujo de datos

El catálogo de recetas se define en `script.js`. `time` representa la duración total estimada y suma preparación, cocción y los reposos indicados; `timerMinutes` es independiente y solo propone la duración inicial de una fase activa de cocción u horneado. Los reposos largos se presentan en las notas y pasos, no se incluyen en el temporizador de cocina. En recetas sin cocción cronometrada, el usuario puede configurar un temporizador opcional. La búsqueda, la categoría seleccionada y el filtro de favoritos producen una lista visible que se representa en tarjetas. Los favoritos se leen y guardan en `localStorage`; la vista de detalle obtiene los ingredientes y pasos del mismo catálogo.

### 5.3 Estrategia offline-first

Al instalarse, el Service Worker almacena HTML, CSS, JavaScript, manifiesto, icono e imagen local de respaldo. También intenta precargar las fotografías. Para la navegación usa la red primero y la copia local de `index.html` si la solicitud falla; para recursos estáticos usa caché primero y almacena las nuevas respuestas correctas.

## 6. Desarrollo

El desarrollo concreta esa arquitectura en los documentos de la aplicación, el comportamiento de la interfaz y los recursos necesarios para su instalación y caché.

### 6.1 `index.html`

Define la página en español con encabezado, presentación, filtros, campo de búsqueda, catálogo, aviso offline, pie de página y diálogo accesible para el detalle de cada receta. También declara el manifiesto, los metadatos de visualización, el color Midnight Blue del navegador y las fuentes Poppins, Playfair Display y Great Vibes.

### 6.2 `styles.css`

Implementa una identidad visual de repostería con Buttermilk (`#FFF2BA`) y Midnight Blue (`#0F3C65`) en variables CSS; las superficies crema y el acento caramelo completan los estados secundarios. La descripción del hero usa Buttermilk para mantener contraste sobre el fondo azul. La ilustración se reemplazó por una fotografía Unsplash de pastel de chocolate. El encuadre específico del tiramisú usa `object-position: center 85%` tanto en la tarjeta como en el detalle, para mostrar mejor el postre dentro del recorte. Poppins se usa para lectura, Playfair Display para títulos y Great Vibes aporta un acento caligráfico inspirado en «Velvet Moon». Las fuentes web tienen alternativas tipográficas para el uso offline. Incluye tarjetas responsivas, diálogo de receta, estados vacíos, avisos, foco visible y adaptación a pantallas pequeñas y a movimiento reducido.

### 6.3 `script.js`

Implementa ocho recetas exclusivamente dulces, filtros y búsqueda inmediata, favoritos persistentes, instrucciones detalladas, temporizador ajustable por minuto, modo cocina y registro del Service Worker. La receta del flan incluye una fotografía Unsplash de flan con caramelo. Cada tarjeta y detalle presentan el tiempo total estimado; las esperas de refrigeración y reposo quedan descritas aparte del temporizador de la fase activa. El tiempo se puede ajustar antes de iniciar o al pausarlo y se calcula desde una hora objetivo para evitar deriva en segundo plano. Las recetas sin cocción cronometrada admiten un temporizador opcional. Las duraciones se muestran en español como minutos u horas y minutos. El modo cocina solicita Screen Wake Lock cuando el navegador lo admite; en otros casos explica la limitación y conserva el modo visual.

### 6.4 `manifest.json`

Establece nombre, nombre corto, idioma, ámbito, ruta de inicio, colores, visualización `standalone`, categorías e icono SVG escalable.

### 6.5 `sw.js`

Versiona las cachés, elimina versiones antiguas en la activación, reclama las páginas abiertas y administra las solicitudes de navegación, recursos propios e imágenes de Unsplash. La instalación de recursos esenciales es obligatoria; la precarga de fotografías es tolerante a fallos de red.

### 6.6 Recursos visuales

`assets/icon.svg` aporta el icono de marca de la PWA y `assets/postre-placeholder.svg` permite representar un postre local si una fotografía no puede cargarse.

## 7. Resultados

Los resultados se describen a partir de las funciones implementadas y de las verificaciones que pueden confirmarse con el código entregado.

### 7.1 Funcionalidades implementadas

- Catálogo visual de ocho postres con duración total estimada, categoría y dificultad.
- Paleta Buttermilk/Midnight Blue validada en navegador: fondo `rgb(255, 242, 186)`, portada `rgb(15, 60, 101)` y títulos `rgb(15, 60, 101)`.
- Fuentes calculadas como Poppins para lectura, Playfair Display para titulares y Great Vibes para el acento caligráfico.
- Búsqueda por nombre, ingredientes y descripción, filtros por categoría y vista de favoritos.
- Detalle con ingredientes, pasos ordenados, tiempo total separado de las fases activas, temporizador ajustable por minuto y modo cocina.
- Persistencia local de favoritos, indicador online/offline e instalación PWA.
- Caché versionada de recursos esenciales y precarga opcional de fotografías.

### 7.2 Pruebas y checklist PWA

| Verificación | Resultado |
|---|---|
| Archivos principales y recursos locales presentes | Implementado |
| Catálogo limitado a recetas de postres | Verificado en los datos de la aplicación |
| Búsqueda, filtros y persistencia de favoritos | Verificados en navegador: «mascarpone» devuelve 1 receta y «Pasteles» muestra 2; favorito persiste en `localStorage` |
| Diálogo y pasos de receta | Verificados: detalle de brownies abre, presenta 8 ingredientes y 4 pasos, y cierra correctamente |
| Tiempo total y esperas | Verificados en tarjetas y detalle: tiramisú 4 h 35 min, pay de limón 3 h 45 min, cheesecake 5 h 45 min y flan 3 h 15 min; notas aclaran refrigeración/reposo |
| Temporizador de fase activa | Verificado en Pages: brownies inicia en `25:00`, se ajusta a `26:00`, decrementa a `25:59` y reinicia en `26:00`; la prueba previa confirmó el bloqueo de edición durante la marcha |
| Temporizador en recetas sin cocción cronometrada | Verificado: tiramisú y pay no cargan la espera larga en el temporizador; se puede configurar un temporizador opcional manualmente |
| Temporizador en segundo plano | El tiempo restante se calcula desde una hora objetivo, no contando ticks; se evita acumular deriva si el navegador limita intervalos |
| Modo cocina | Implementado; la retención de pantalla utiliza Screen Wake Lock cuando el navegador la admite |
| Manifiesto con modo `standalone` e icono | Implementado |
| Registro y control del Service Worker | Verificados en Pages: Service Worker activo, controlador presente y scope restringido a `https://luzu1202.github.io/PWA/` |
| Actualización de shell y fotos | Caché actual `dulce-pausa-v8`; la hoja de estilos usa la URL versionada `styles.css?v=tiramisu-85` |
| Publicación en GitHub Pages | Verificada: respuesta HTTP 200 en [Dulce Pausa](https://luzu1202.github.io/PWA/) |
| Workflow de GitHub Actions | Ejecución [37101217479](https://github.com/luzu1202/PWA/actions/runs/37101217479) completada correctamente para el commit `9f7706445074054ef49a98ce52157ff7e23bd28a` |
| Instalación del Service Worker en GitHub Pages | Verificada en la revisión publicada: scope `https://luzu1202.github.io/PWA/`, worker activo y cachés de la versión `dulce-pausa-v8` |
| Caché offline del shell | Recursos del shell comprobados en la Cache API; no se pudo completar una recarga offline automatizada en esta repetición de la auditoría |
| Catálogo y recursos visuales publicados | 8 tarjetas y 8 imágenes del catálogo cargadas; fotografía del flan correcta y carga confirmada |
| Encuadre del tiramisú | Verificado en Pages: la imagen de tarjeta y detalle carga con `object-position: 50% 85%` |
| Búsqueda y filtros publicados | «mascarpone» devuelve 1 receta y «Pasteles» muestra 2 |
| Contraste y paleta publicados | Hero: texto `rgb(255, 242, 186)` sobre fondo `rgb(15, 60, 101)`, contraste 10.06:1 |
| Lighthouse / métricas de rendimiento | No ejecutado; no se reportan puntuaciones sintéticas |

El Service Worker no puede operar al abrir `index.html` directamente mediante `file://`; debe servirse desde `localhost` o HTTPS. Las fotos quedan disponibles offline cuando la precarga o una visita online logra almacenarlas; para cada fallo se conserva un SVG local de respaldo. En esta repetición se confirmó que los recursos del shell y las nueve fotos están en las cachés de Pages, pero la automatización no completó una recarga con la red deshabilitada; no se atribuye ese resultado al build actual.

### 7.3 Auditoría de código y conclusiones

La arquitectura evita dependencias de ejecución y limita el registro persistente a identificadores de favoritos. El catálogo carga imágenes de forma diferida; la instalación precarga las fotografías en paralelo sin permitir que un error externo impida guardar el shell. Los recursos esenciales tienen una estrategia offline explícita. El CSS se adapta a móviles y teclado, la lista se actualiza sin recargar la página y el temporizador se detiene al cerrar la receta. En Pages se verificaron el controlador del Service Worker, ocho tarjetas, ocho imágenes, el buscador, el filtro, el temporizador y el detalle con la foto correcta del flan; también se confirmó `object-position: 50% 85%` para la foto del tiramisú en tarjeta y detalle. El Service Worker precarga siete recursos esenciales y nueve fotografías (ocho recetas más hero); la caché observada puede incluir variantes de navegación consultadas. La prueba de recarga offline no se completó en esta sesión. Lighthouse y la instalación en un dispositivo físico no se ejecutaron, por lo que no se atribuyen puntuaciones ni resultados de esos entornos. La auditoría técnica se documenta en [AUDITORIA_PWA.md](./AUDITORIA_PWA.md).

En la última revisión publicada se verificó el texto Buttermilk sobre el hero Midnight Blue con contraste 10.06:1 y el encuadre centrado en alto del tiramisú (`object-position: center 85%`) en tarjeta y detalle. La URL CSS lleva la consulta `?v=tiramisu-85` y el Service Worker usa la caché `dulce-pausa-v8` para renovar los estilos en instalaciones anteriores. El hero, la foto del flan y las ocho fotografías del catálogo se cargaron correctamente en el navegador; las nueve imágenes están incluidas en la caché de fotografías.

La publicación más reciente corresponde al commit `9f7706445074054ef49a98ce52157ff7e23bd28a`; la validación y el despliegue finalizaron correctamente en [GitHub Actions](https://github.com/luzu1202/PWA/actions/runs/37101217479). Esta actualización documental se realiza después de esa publicación y permanece local; no forma parte del despliegue.

## 8. Resumen

Dulce Pausa es una PWA en español para explorar y preparar ocho postres, buscar por ingredientes, guardar favoritos, seguir instrucciones, usar un temporizador y activar el modo cocina. Se construyó con HTML, CSS y JavaScript nativos, un manifiesto instalable, un Service Worker con caché offline y recursos visuales locales de respaldo.
