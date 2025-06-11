// packages/app/vite.config.js
export default {
  publicDir: "public",
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/auth": "http://localhost:3000",
      "/images": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/register": "http://localhost:3000"
    }
  }
};
