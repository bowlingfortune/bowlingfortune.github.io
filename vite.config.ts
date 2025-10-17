import { defineConfig } from 'vite';

const buildDate = new Date();
const chicagoTime = new Date(buildDate.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
const year = chicagoTime.getFullYear();
const month = String(chicagoTime.getMonth() + 1).padStart(2, '0');
const day = String(chicagoTime.getDate()).padStart(2, '0');
const hours = String(chicagoTime.getHours()).padStart(2, '0');
const minutes = String(chicagoTime.getMinutes()).padStart(2, '0');
const seconds = String(chicagoTime.getSeconds()).padStart(2, '0');
const buildTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

export default defineConfig({
  root: '.',
  base: '/',
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(buildTimestamp)
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true
  }
});
