import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 👇 ESTE ES EL CAMBIO MÁS IMPORTANTE. AHORA APUNTA AL PAQUETE CORRECTO. 👇
import tailwindcss from '@tailwindcss/postcss' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
})