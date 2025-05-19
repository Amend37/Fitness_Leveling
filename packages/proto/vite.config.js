import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        burpees: resolve(__dirname, 'tutorial-burpees.html'),
        highKnees: resolve(__dirname, 'tutorial-high-knees.html'),
        jumpingJacks: resolve(__dirname, 'tutorial-jumping-jacks.html'),
        pushup: resolve(__dirname, 'tutorial-pushup.html'),
        squat: resolve(__dirname, 'tutorial-squat.html')
      }
    }
  }
});
