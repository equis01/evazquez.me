import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const seoFilesPlugin = {
  name: 'seo-files',
  generateBundle() {
    for (const fileName of ['robots.txt', 'sitemap.xml']) {
      this.emitFile({
        type: 'asset',
        fileName,
        source: readFileSync(resolve(__dirname, fileName), 'utf8'),
      });
    }
  },
};

export default defineConfig({
  root: './',
  // Desactivamos el mapeo automático de public para que funcione 
  // con rutas relativas manuales como /public/img/...
  publicDir: false,
  plugins: [seoFilesPlugin],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          if (assetInfo.name === 'lalia-hero.png') {
            return 'public/img/lalia/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
      input: {
        main: resolve(__dirname, 'index.html'),
        experiencia: resolve(__dirname, 'experiencia/index.html'),
        portafolio: resolve(__dirname, 'portafolio/index.html'),
        cuidado: resolve(__dirname, 'public/analytics/animal/cuidado.html'),
        privacidadCuidado: resolve(__dirname, 'public/analytics/animal/privacidad.html'),
        tratamientoDatosCuidado: resolve(__dirname, 'public/analytics/animal/tratamiento-datos.html'),
        tours: resolve(__dirname, 'public/analytics/tours/index.html'),
        privacidadTours: resolve(__dirname, 'public/analytics/tours/privacidad.html'),
        shop: resolve(__dirname, 'portafolio/shop/index.html'),
        viewer: resolve(__dirname, 'portafolio/shop/viewer.html'),
        cv: resolve(__dirname, 'cv/index.html'),
        qr: resolve(__dirname, 'portafolio/herramientas/qr-gen/index.html'),
        chula: resolve(__dirname, 'portafolio/proyectos/chula/index.html'),
        lalia: resolve(__dirname, 'lalia/index.html'),
        404: resolve(__dirname, '404.html'),
      }
    }
  }
});
