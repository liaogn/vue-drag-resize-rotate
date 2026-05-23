import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  return {
    plugins: [
      vue(),
      isLib &&
        dts({
          include: ['src/core', 'src/vdr', 'src/index.ts'],
          exclude: ['src/playground/**', 'legacy/**'],
          rollupTypes: true,
          insertTypesEntry: true,
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    ...(isLib
      ? {
          build: {
            lib: {
              entry: resolve(__dirname, 'src/index.ts'),
              name: 'VueDragResizeRotate',
              fileName: (format) => (format === 'es' ? 'index.js' : 'index.umd.cjs'),
              cssFileName: 'style',
              formats: ['es', 'umd'] as const,
            },
            sourcemap: true,
            rollupOptions: {
              external: ['vue'],
              output: {
                exports: 'named',
                globals: { vue: 'Vue' },
              },
            },
          },
        }
      : {
          server: {
            port: 5173,
            open: mode !== 'test',
          },
        }),
  }
})
