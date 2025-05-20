import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        allTutorials: resolve(__dirname, "all-tutorials.html"),
        strength: resolve(__dirname, "workout-plan-strength.html"),
        cardio: resolve(__dirname, "workout-plan-cardio.html"),
        custom: resolve(__dirname, "workout-plan-custom.html"),
        pushup: resolve(__dirname, "tutorial-pushup.html"),
        squat: resolve(__dirname, "tutorial-squat.html"),
        burpees: resolve(__dirname, "tutorial-burpees.html"),
        jumpingJacks: resolve(__dirname, "tutorial-jumping-jacks.html"),
        highKnees: resolve(__dirname, "tutorial-high-knees.html"),
        achievement: resolve(__dirname, "achievement-first-workout.html")
      }
    }
  }
});
