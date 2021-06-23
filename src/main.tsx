import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)


console.log(`app version: ${window.__APP_VERSION__}`)