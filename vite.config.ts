import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

const gitprocess = require('child_process')

const LoadCommitDate = gitprocess
  .execSync('git log -1 --date=format:"%Y/%m/%d %H:%M:%S" --format="%ad"')
  .toString()

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  return {
    plugins: [reactRefresh()],
    define: {
      "__APP_VERSION__": JSON.stringify(LoadCommitDate)
    }
  }
})
