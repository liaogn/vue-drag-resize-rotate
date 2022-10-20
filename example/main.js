import Vue from 'vue';
import App from './App.vue';
import vdr from '../src/index.js';
import Desc from './cpn/Desc.vue'


// vdr.extends = {
//   methods:{
//     stickHoverRender(cursorRotate){
//         return `<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32" >
//           <path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="white" stroke="brown" style="transform:rotate(${cursorRotate}deg);transform-origin: 16px 16px"></path>
//         </svg>`
//     }
//   }
// }

// Vue.prototype.$stickHoverRender = (cursorRotate)=>{
//   return `<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32" >
//   <path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="white" stroke="brown" style="transform:rotate(${cursorRotate}deg);transform-origin: 16px 16px"></path>
//   </svg>`
// }

console.log(vdr)
// 安装插件，修改组件名字：VueDragResizeRotate.name = 'vdr';
Vue.use(vdr);

// eslint-disable-next-line no-undef
Vue.use(hljs.vuePlugin);

Vue.config.productionTip = false;

Vue.component('wrapDesc',Desc)

new Vue({ render: (h) => h(App) }).$mount('#app');
