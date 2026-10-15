import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// JS와 CSS를 index.html 안에 넣어서, 빌드 결과를 file:// (삼바)로 열어도 동작하게 한다.
// 그림은 public/images 에 두고 상대 경로(./images/...)로 불러온다.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile({ removeViteModuleLoader: true })],
  build: { copyPublicDir: true },
})
