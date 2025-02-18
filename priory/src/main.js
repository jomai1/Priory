import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// For for example Rich Text Editor
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('QuillEditor', QuillEditor)



app.mount('#app')
