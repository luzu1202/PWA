# Dulce Pausa

**Dulce Pausa** es una Progressive Web App (PWA) en español para descubrir y preparar postres. Incluye catálogo, búsqueda, filtros, favoritos locales, instrucciones paso a paso, temporizador ajustable y modo cocina. Tras cargar los recursos con conexión, el Service Worker conserva la aplicación para su uso sin conexión.

- **Aplicación publicada:** <https://luzu1202.github.io/PWA/>
- **Informe del proyecto:** [INFORME_PROYECTO.md](./INFORME_PROYECTO.md)
- **Auditoría técnica:** [AUDITORIA_PWA.md](./AUDITORIA_PWA.md)

## Funcionalidades

- Catálogo de ocho recetas exclusivamente de postres, con fotografía, categoría, dificultad y tiempo total estimado.
- Búsqueda en tiempo real por postre e ingredientes y filtros por categoría.
- Vista de receta con ingredientes, pasos, tiempos de reposo descritos por separado y temporizador ajustable para la fase activa.
- Favoritos guardados en `localStorage`.
- Modo cocina, con solicitud de Screen Wake Lock en los navegadores compatibles.
- Manifiesto instalable y Service Worker con caché del shell y precarga de fotografías.
- Interfaz adaptable a pantallas móviles y de escritorio.

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
| `script.js` | Recetas, búsqueda, filtros, favoritos, temporizador y modo cocina |
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

## Disponibilidad offline y recursos externos

El Service Worker utiliza la versión de caché `dulce-pausa-v5`: precarga el shell de la aplicación y trata de almacenar las nueve fotografías (ocho del catálogo y la imagen principal). Los errores al descargar fotos no impiden instalar la aplicación; cuando una imagen no está disponible se utiliza un SVG local de respaldo. Para que todas las fotos estén disponibles offline, abre la aplicación con conexión y permite completar la precarga.

Las fotografías se sirven desde Unsplash y las fuentes tipográficas se solicitan a Google Fonts. Si esos servicios no están disponibles, el funcionamiento del catálogo y las recetas continúa, con imágenes de respaldo cuando sea necesario y fuentes locales alternativas.
