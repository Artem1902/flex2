import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from "pinia";
import router from "./router/index.js";
import MainLayout from "./layouts/MainLayout.vue";

const pinia = createPinia()
const app = createApp(App)

app.component('MainLayout', MainLayout)

app.use(pinia).use(router).mount('#app')
