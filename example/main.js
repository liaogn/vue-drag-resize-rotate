import Vue from 'vue';
import App from './App.vue';
import vdr from '../src/index.js';
import Desc from './cpn/Desc.vue'

// 安装插件
Vue.use(vdr);

// eslint-disable-next-line no-undef
Vue.use(hljs.vuePlugin);

Vue.config.productionTip = false;

Vue.component('wrapDesc',Desc)

new Vue({ render: (h) => h(App) }).$mount('#app');
