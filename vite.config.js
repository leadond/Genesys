import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Buffer } from 'buffer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This ensures React is properly resolved in production builds
      'react': 'react',
      'react-dom': 'react-dom'
    }
  },
  define: {
    // Polyfill for Buffer which is used by purecloud-platform-client-v2 but not available in browsers
    global: 'globalThis',
    'process.env': {},
    Buffer: [Buffer, 'Buffer']
  },
  build: {
    // Ensure React is properly externalized and not bundled incorrectly
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
})
