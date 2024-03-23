import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')

// window.environment.isDevelopment().then((isDevelopment) => {
//   if (isDevelopment) {
//     const existingMetaTag = document.querySelector('[http-equiv="Content-Security-Policy"]')
//     if (existingMetaTag) {
//       // Modify the content (add or update directives)
//       existingMetaTag.content =
//         "default-src 'self'; script-src-elem 'self' http://localhost:8098/ unsafe-eval; style-src 'self' 'unsafe-inline'; img-src 'self' data:"
//       //"script-src-elem 'self' https://example.com"
//       console.log('Updated CSP meta tag content.')
//       existingMetaTag.remove()
//       document.head.appendChild(existingMetaTag)
//       //Add script for Vue Development Tools
//       const devtoolsScript = document.createElement('script')
//       devtoolsScript.src = 'http://localhost:8098'
//       document.head.appendChild(devtoolsScript)
//     } else {
//       console.log('No existing CSP meta tag found.')
//     }
//   }
// })
