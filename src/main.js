import '@/assets/style.css';
import '@/assets/tailwind.css';
import 'nprogress/nprogress.css';

import { createApp,  } from 'vue';
import App from './App.vue';
import router from './router';
import VeeValidatePlugin from './includes/validation';
import environment from './includes/environment';
import ProgessBar from './includes/progressBar';

ProgessBar(router);
const app = createApp(App);
app.use(router);
app.use(VeeValidatePlugin);
app.use(environment);

app.mount('#app');
