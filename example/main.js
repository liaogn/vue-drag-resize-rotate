import Vue from 'vue';
import App from './App.vue';

import VueDragResizeRotate from '../src/index.js';
Vue.use(VueDragResizeRotate);

Vue.config.productionTip = false;

new Vue({ render: (h) => h(App) }).$mount('#app');
