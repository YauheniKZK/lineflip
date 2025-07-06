import { createApp } from 'vue';
import './assets/style.css';
import App from './App.vue';
import router from '@/router/index';
import { createPinia } from 'pinia';
// import { Config } from './config';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.mount('#app');
