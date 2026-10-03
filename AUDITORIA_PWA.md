# Auditoría técnica de Dulce Pausa

**Fecha:** 2026-10-02  
**Repositorio:** [luzu1202/PWA](https://github.com/luzu1202/PWA)  
**Sitio publicado:** [https://luzu1202.github.io/PWA/](https://luzu1202.github.io/PWA/)

## Alcance

Revisión estática de HTML, CSS, JavaScript, manifiesto, Service Worker y workflow; comprobaciones funcionales en navegador; verificación del despliegue y de la instalación de la PWA desde GitHub Pages. No incluye pentest, análisis automatizado de dependencias ni puntuación Lighthouse.

## Resultado ejecutivo

**Estado: apto para pruebas.** No se encontraron bloqueos funcionales en las verificaciones ejecutadas. Las validaciones de GitHub Actions finalizaron correctamente y Pages respondió HTTP 200. El Service Worker de Pages quedó activo, con scope restringido al proyecto, y se confirmaron las dos cachés esperadas. La prueba de navegación offline se realizó en localhost; no se afirma una prueba offline completa del navegador contra el dominio público.

## Hallazgos

| Prioridad | Hallazgo | Impacto | Recomendación |
|---|---|---|---|
| Baja | Las ocho fotos se sirven desde Unsplash. La aplicación intenta precargarlas y almacena las respuestas que consigue, pero no puede garantizar esas fotos sin conexión si la instalación ocurre sin acceso al proveedor. | El contenido de las recetas sigue accesible; puede mostrarse el SVG local de respaldo en lugar de una fotografía no almacenada. | Si se requiere independencia absoluta de terceros, incorporar las fotografías al repositorio y precargar archivos locales. |
| Baja | El manifiesto proporciona iconos SVG, sin variantes PNG de 192 y 512 píxeles. | La instalación funciona en el navegador probado, pero algunos sistemas instalables antiguos pueden preferir iconos rasterizados. | Añadir variantes PNG si se necesita ampliar compatibilidad de instalación. |
| Baja | La búsqueda compara texto en minúsculas, pero no normaliza diacríticos. | Buscar `limon` no coincide con `limón` si la tilde forma parte del contenido coincidente. | Normalizar acentos en la consulta y los campos indexados si se desea búsqueda tolerante a tildes. |

No se identificaron hallazgos de prioridad alta o crítica durante esta revisión funcional. Esta observación no equivale a una auditoría de seguridad especializada.

## Verificaciones realizadas

- JavaScript sintácticamente válido en Actions: `node --check script.js` y `node --check sw.js`.
- Manifiesto JSON válido, con `display: standalone`, ruta de inicio y recursos necesarios presentes.
- Catálogo de ocho postres; búsqueda por `mascarpone`, filtro `Pasteles`, favoritos persistentes en `localStorage`, diálogo con ingredientes y pasos, y temporizador decrementando correctamente.
- En `localhost`, recargar sin conexión conservó el catálogo, los estilos y ocho fotografías previamente almacenadas.
- En GitHub Pages se observó HTTP 200, ocho tarjetas, Service Worker activo y controlador, scope `https://luzu1202.github.io/PWA/`, siete entradas en caché de aplicación y ocho en caché de fotografías.
- GitHub Actions [run 37095116436](https://github.com/luzu1202/PWA/actions/runs/37095116436): validación y despliegue completados con éxito.

## Rendimiento, accesibilidad y mantenimiento

- Las imágenes de tarjetas usan carga diferida; el layout de las tarjetas reserva altura para reducir desplazamientos al cargar.
- CSS, JavaScript, icono y SVG de respaldo se sirven desde el proyecto, sin bibliotecas de runtime ni fuente tipográfica externa.
- La interfaz ofrece etiquetas accesibles, foco visible, estados de botones y adaptación a movimiento reducido.
- Los recursos esenciales se cachean antes de activar la nueva versión; la precarga remota de imágenes tolera fallos y no bloquea el shell.
- El modo cocina usa Screen Wake Lock cuando está disponible y comunica la limitación cuando el navegador no lo permite.
- Lighthouse y la instalación física no se ejecutaron; no se reportan puntuaciones ni compatibilidad fuera del navegador probado.

## Conclusión

La aplicación está desplegada y lista para pruebas en GitHub Pages. El funcionamiento offline de la estructura y de los recursos ya almacenados está verificado en localhost; las recomendaciones de baja prioridad describen mejoras de compatibilidad y autonomía, no impedimentos para probar la versión actual.
