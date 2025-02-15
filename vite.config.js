import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import fs from 'fs';
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/quizManager/',
  server: {
    
    allowedHosts: [
      'd284-89-46-234-222.ngrok-free.app', 
      'localhost',
      'https://chairman-tamil-catch-undergraduate.trycloudflare.com',
      '127.0.0.1',
      '6195e9c4464bb0.lhr.life'
    ],
    port: 3000,
    host: "0.0.0.0",
    /* hmr: {
        host: 'tg-mini-app.local',
        port: 443,
    }, */
    /* https: {
      key: fs.readFileSync('./.cert/localhost-key.pem'),
      cert: fs.readFileSync('./.cert/localhost.pem'),
    }, */
  },
})
