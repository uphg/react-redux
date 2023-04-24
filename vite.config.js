import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   watch: {
      
  //     // ignored: ['!**/node_modules/your-package-name/**'],
  //   },
  // },
  plugins: [react()],
})
