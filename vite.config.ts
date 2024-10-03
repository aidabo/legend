import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import url from '@rollup/plugin-url';
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ /*command,*/ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()))
  
  // Load env file based on `mode` in the current working directory
  // const proxy_host = process.env.VITE_APP_PROXY_HOST;
  // const baseUrl = process.env.VITE_APP_BASE_URL;

  return defineConfig({    
    //base: baseUrl, not work for reload, just add base into index.html
    plugins: [      
      vue(),
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),      
      visualizer({
        emitFile: true,
        filename: "stats.html",
      }) as PluginOption,
      url(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      dedupe: [
        'vue'
      ]
    },
    
    // expose proxy host
    // server: {
    //   host: true,
    //   port: 5173,
    //   proxy: {
    //     //forward to golang webapi
    //     "/api": {
    //       target: `http://${proxy_host}:4500`,
    //       changeOrigin: true,
    //       secure: false,
    //       rewrite: (path) => path.replace(/^\/api/, ""),
    //     },
    //     //forward to postgrest api
    //     "/pgapi": {
    //       target: `http://${proxy_host}:3000`,
    //       changeOrigin: true,
    //       secure: false,
    //       rewrite: (path) => path.replace(/^\/pgapi/, ""),
    //     },
    //     // forward to nginx
    //     "/data": {
    //       target: `http://${proxy_host}`,
    //       changeOrigin: true,
    //       secure: false,
    //       //rewrite: (path) => path.replace(/^\/api/, ""),
    //     },
    //     // forward to nginx
    //     "/images": {
    //       target: `http://${proxy_host}`,
    //       changeOrigin: true,
    //       secure: false,
    //       //rewrite: (path) => path.replace(/^\/api/, ""),
    //     },
    //   },
      // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      // "/socket.io": {
      //   target: "ws://localhost:5173",
      //   ws: true,
      // },
    //},

    // build: {
    //    rollupOptions: {
    //      external: [ "jquery" ]
    //    }
    // }
  })// return defineConfig

});
