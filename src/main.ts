import './assets/main.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createApp } from 'vue'

import App from './App.vue'

/* add icons to the library */
library.add(faCheckCircle)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
