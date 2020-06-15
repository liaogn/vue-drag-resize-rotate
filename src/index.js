// 导入组件，组件必须声明 name
import VueDragResizeRotate from './vdr/index.vue';

// 为组件添加 install 方法，用于按需引入
VueDragResizeRotate.install = function(Vue) {
  Vue.component(VueDragResizeRotate.name, VueDragResizeRotate);
};

export default VueDragResizeRotate;
