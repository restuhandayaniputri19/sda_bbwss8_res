import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: "/balai/bbwssumatera8/",
    server: {
      proxy: {
        "/balai/bbwssumatera8/api": {
          target: "https://sda.pu.go.id",
          changeOrigin: true,
          secure: false,
        },
      },
      host: '0.0.0.0',
      port: 5173,
      watch: {
        usePolling: true,
      },
    },
  };
});