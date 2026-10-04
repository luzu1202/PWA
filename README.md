# Dulce Pausa

**Dulce Pausa** es una Progressive Web App (PWA) para descubrir y preparar postres. Combina ocho recetas propias disponibles offline con un catálogo internacional. Incluye búsqueda, filtros, favoritos locales, instrucciones paso a paso, traducción automática al español, tiempo total aproximado, temporizador ajustable y modo cocina.

- **Aplicación publicada:** <https://luzu1202.github.io/PWA/>
- **Informe del proyecto:** [INFORME_PROYECTO.md](./INFORME_PROYECTO.md)
- **Auditoría técnica:** [AUDITORIA_PWA.md](./AUDITORIA_PWA.md)

## Funcionalidades

- Catálogo de ocho recetas exclusivamente de postres, con fotografía, categoría, dificultad y tiempo total estimado.
- Catálogo adicional de postres internacionales, cargado con `fetch()`, con descripciones en español personalizadas según el postre y sin títulos duplicados; los detalles e ingredientes se consultan bajo demanda.
- Resultados en bloques de 12, indicador de carga/errores y botón para actualizar las recetas.
- Búsqueda en tiempo real por nombre en el catálogo y por ingredientes en las recetas locales; los ingredientes remotos se consultan al abrir el detalle.
- Vista de receta con ingredientes, pasos, tiempos de reposo descritos por separado y temporizador ajustable para la fase activa.
- Botón para traducir nombre, descripción, ingredientes y pasos al español. La traducción se guarda junto al detalle para consultarla offline; requiere conexión la primera vez, es automática y puede contener errores.
- Tiempo aproximado visible desde la tarjeta, primero orientado por el tipo de postre y luego afinado al consultar sus instrucciones. No equivale a un tiempo verificado por la fuente. Cuando existe un enlace seguro, la vista permite contrastar la receta original.
- Favoritos guardados en `localStorage`.
- Modo cocina, con solicitud de Screen Wake Lock en los navegadores compatibles.
- Manifiesto instalable y Service Worker con caché del shell y precarga de fotografías.
- Copia local del catálogo consultado y de los últimos 20 detalles abiertos para continuar la consulta offline. El Service Worker también cachea las respuestas de TheMealDB y sus imágenes cuando la red las entrega.
- Interfaz adaptable a pantallas móviles y de escritorio.

Las recetas internacionales pueden estar en inglés u otro idioma y no siempre incluyen una duración o dificultad verificable. La duración mostrada se identifica expresamente como aproximada; la traducción se solicita solo cuando la persona la activa y se conserva el texto original. El servicio gratuito de traducción tiene límites diarios y requiere conexión para una traducción nueva. Las ocho recetas propias continúan siendo la fuente de respaldo si no hay conexión o el catálogo adicional no carga.

## Ejecutar en local

No hay compilación ni dependencias de runtime. Sirve la carpeta del proyecto desde `localhost` (o HTTPS), ya que los navegadores no permiten registrar Service Workers desde `file://`.

Con Python instalado:

```powershell
py -m http.server 8000
```

Abre <http://localhost:8000/> en el navegador. Para probar la experiencia offline, carga primero la aplicación con conexión y espera a que se registre el Service Worker y se almacenen los recursos.

También puede utilizarse cualquier servidor estático local que atienda los archivos de esta carpeta.

## Archivos principales

| Archivo o carpeta | Responsabilidad |
|---|---|
| `index.html` | Estructura semántica, navegación, catálogo y diálogo de receta |
| `styles.css` | Diseño responsivo, paleta Buttermilk/Midnight Blue y tipografía |
| `script.js` | Catálogo local e internacional, búsqueda, filtros, traducción, favoritos, temporizador y modo cocina |
| `manifest.json` | Metadatos, ámbito, ruta de inicio e icono instalable |
| `sw.js` | Registro de cachés, actualizaciones y respuestas sin conexión |
| `assets/` | Icono de la aplicación y SVG local de respaldo |
| `.github/workflows/pages.yml` | Validación automática y publicación en GitHub Pages |

## Validaciones

Con Node.js instalado, ejecuta desde esta carpeta:

```powershell
node --check script.js
node --check sw.js
node -e "const fs=require('node:fs');const m=JSON.parse(fs.readFileSync('manifest.json','utf8'));if(m.display!=='standalone'||!m.name||!m.start_url)process.exit(1);for(const f of ['index.html','styles.css','script.js','sw.js','assets/icon.svg','assets/postre-placeholder.svg'])if(!fs.existsSync(f))throw Error('Falta '+f);console.log('Manifiesto PWA y recursos requeridos válidos')"
```

GitHub Actions repite las comprobaciones de sintaxis y manifiesto. El workflow despliega automáticamente a GitHub Pages cuando hay un `push` a `main`; también se puede iniciar manualmente desde la pestaña **Actions** del repositorio.

## Catálogo, traducciones, disponibilidad offline y recursos externos

La aplicación carga el catálogo internacional con `fetch()` y pide los ingredientes e instrucciones al abrir una receta. La lista recibida y los últimos 20 detalles consultados se guardan en `localStorage`; los datos traducidos también se conservan dentro del detalle, por lo que pueden leerse sin conexión después de traducirlos una vez. La estimación de tiempo se calcula en el dispositivo a partir del texto del paso a paso; es orientativa y no se presenta como duración publicada por la fuente. Cuando la receta incluye una dirección HTTPS original, se ofrece un enlace para contrastarla.

La traducción automática inglés-español latinoamericano se solicita solo cuando se pulsa **Traducir al español**. Se envían segmentos breves del texto de la receta al servicio de traducción, no información personal. Se registra localmente el uso diario para respetar el límite anónimo publicado por el proveedor; si hay error, se alcanza el límite o falta conexión, el texto original permanece disponible. Las traducciones se identifican como automáticas.

Las fotografías se sirven desde Unsplash y el catálogo desde TheMealDB; las fuentes tipográficas se sirven desde Google Fonts. Si una fuente externa no está disponible, se muestran imágenes de respaldo y se conserva el catálogo local. La traducción y las estimaciones se publicaron en GitHub Pages; las correcciones más recientes de descripciones personalizadas, tiempos visibles desde la tarjeta y eliminación de duplicados permanecen en el entorno local.
