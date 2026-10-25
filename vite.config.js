import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// JS와 CSS를 index.html 안에 넣는다. 그림은 public/images 에 두고 상대 경로(./images/...)로 불러온다.
// 갤러리 데이터는 API 서버(server/)에서 받는다. 개발 중에는 /api 요청을 API 서버로 넘긴다.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile({ removeViteModuleLoader: true })],
  build: { copyPublicDir: true },
  server: {
    proxy: { '/api': `http://localhost:${process.env.PORT ?? 3001}` },
  },
})
