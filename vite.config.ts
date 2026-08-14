import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Ścieżki względne — strona ma działać i pod własną domeną, i serwowana
  // z podkatalogu przez Most (tak jak inne substrony Katedry).
  base: './',
});
