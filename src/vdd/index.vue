<template>
  <div :class="{ 'vdr-active': active && activeable, 'vdr-not-active': !activeable }" :style="style" @click.stop @mousedown.stop.prevent="bodyDown($event)" class="vdr">
    <!-- 控件 -->
    <template v-if="active && activeable">
      <!-- 缩放控件 -->
      <span :class="`vdr-stick-${stick}`" :key="stickIndex" :style="{ width: `${stickSize}px`, height: `${stickSize}px` }" @mousedown.stop.prevent="stickDown($event, stick)" class="vdr-stick" v-for="(stick, stickIndex) in sticks"></span>
      <!-- 旋转控件 -->
      <div :style="{ width: `${stickSize * 1.5}px`, height: `${stickSize * 1.5}px` }" @mousedown.stop.prevent="rotateDown($event)" class="vdr-stick vdr-rotate">
        <span @mousedown.stop.prevent class="vdr-stick-line"></span>
      </div>
    </template>

    <!-- 插槽 -->
    <div :bg="bg" class="vdr-slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// 宽高最小值
const MINSIZE = 10;

// 旋转坐标点缓存
let pointA = {};
let pointB = {};
let pointC = {};

export default {
  name: 'VueDragResizeRotate',
  props: {
    d: {
      type: Boolean,
      default: true,
    },
    bg: {
      type: String,
      default: '',
    },
    lock: {
      type: Boolean,
      default: false,
    },
    w: {
      type: Number,
      default: 100,
      validator: function(val) {
        return val >= 0;
      },
    },
    h: {
      type: Number,
      default: 100,
      validator: function(val) {
        return val >= 0;
      },
    },
    x: {
      type: Number,
      default: 0,
      validator: function(val) {
        return typeof val === 'number';
      },
    },
    y: {
      type: Number,
      default: 0,
      validator: function(val) {
        return typeof val === 'number';
      },
    },
    z: {
      type: [String, Number],
      default: 'auto',
    },
    r: {
      type: Number,
      default: 0,
    },
    sticks: {
      type: Array,
      default: function() {
        return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];
      },
    },
    stickSize: {
      type: Number,
      default: 10,
    },
    active: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: true,
    },
    resizeable: {
      type: Boolean,
      default: true,
    },
    rotateable: {
      type: Boolean,
      default: true,
    },
    activeable: {
      type: Boolean,
      default: true,
    },
    borderSize: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      whRatio: 0,
      width: this.w,
      height: this.h,
      zIndex: this.z,
      left: this.x,
      top: this.y,
      bottom: 0,
      right: 0,
      rotate: this.r,
    };
  },
  computed: {
    style() {
      return {
        zIndex: this.zIndex,
        top: `${this.top}px`,
        left: `${this.left}px`,
        width: `${this.width}px`,
        height: `${this.height}px`,
        transform: `rotateZ(${Math.round(this.rotate)}deg)`,
      };
    },
    posData() {
      return {
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height,
        rotate: Math.round(this.rotate),
      };
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    // 销毁前移除事件
    document.documentElement.removeEventListener('mousemove', this.move);
    document.documentElement.removeEventListener('mouseup', this.up);
  },
  methods: {
    // 初始化
    init() {
      // 缩放控件类型初始化
      this.currentStick = '';

      // 元素宽高比例初始化
      this.whRatio = this.width / this.height;

      // 父级信息初始化
      this.parentElement = this.$el.parentNode;
      this.parentWidth = this.parentElement.clientWidth;
      this.parentHeight = this.parentElement.clientHeight;

      // 元素bottom、right初始化
      this.bottom = this.parentHeight - this.height - this.top;
      this.right = this.parentWidth - this.width - this.left;

      // 鼠标、元素位置信息初始化
      this.bodyStartPos = {
        mx: 0,
        my: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      };

      document.documentElement.addEventListener('mousemove', this.move);
      document.documentElement.addEventListener('mouseup', this.up);
    },
    //元素本身的mousedown事件回调函数
    bodyDown(ev) {
      if (!this.activeable) return;
      this.bodyDrag = true;
      // 记录开始鼠标位置
      this.bodyStartPos.mx = ev.pageX;
      this.bodyStartPos.my = ev.pageY;
      // 记录开始元素位置
      this.bodyStartPos.left = this.left;
      this.bodyStartPos.top = this.top;
      this.activeable && this.$emit('activated', this.posData);
    },
    // 元素本身的mousemove事件回调函数
    bodyMove(ev) {
      // 起始位置信息
      const { mx, my, left, top } = this.bodyStartPos;
      // 位移向量
      const vector = { x: ev.pageX - mx, y: ev.pageY - my };
      // 更新位置信息
      this.left = left + vector.x;
      this.top = top + vector.y;
      // 触发拖拽事件
      this.$emit('dragging', this.posData);
    },

    //缩放控件的mousedown事件回调函数
    stickDown(ev, stick) {
      if (!this.activeable) return;
      this.stickDrag = true;
      // 记录当前拖拽的stick
      this.currentStick = stick;

      // 记录开始时鼠标位置
      this.bodyStartPos.mx = ev.pageX;
      this.bodyStartPos.my = ev.pageY;

      // 计算开始时元素right、bottom位置信息
      this.right = this.parentWidth - this.width - this.left;
      this.bottom = this.parentHeight - this.height - this.top;

      // 记录开始时元素位置
      this.bodyStartPos.left = this.left;
      this.bodyStartPos.top = this.top;
      this.bodyStartPos.bottom = this.bottom;
      this.bodyStartPos.right = this.right;
    },
    // 缩放控件的mousemove事件回调函数
    stickMove(ev) {
      // 当前空间类型
      let currentStick = this.currentStick;
      // 起始位置信息
      const { mx, my, top, left, bottom, right } = this.bodyStartPos;

      // 位移向量
      const vector = { x: ev.pageX - mx, y: ev.pageY - my };

      // 如果比例锁定，将非m控件替代为m控件计算
      if (this.lock && !currentStick.match('m')) {
        currentStick = `${currentStick[0]}m`;
      }

      // 根据当前控件类型更新位置信息
      currentStick[0] == 't' && (this.top = top + vector.y);
      currentStick[0] == 'b' && (this.bottom = bottom - vector.y);
      currentStick[1] == 'l' && (this.left = left + vector.x);
      currentStick[1] == 'r' && (this.right = right - vector.x);

      // 触发缩放事件
      this.$emit('resizing', this.posData);
    },

    // 旋转控件的mousedown事件回调函数
    rotateDown(ev) {
      if (!this.activeable) return;
      // 旋转目标，即当前需要进行旋转的元素
      const target = ev.target.parentNode;
      // 获取目标位置大小信息，用于计算旋转元素的中心点
      const ract = target.getBoundingClientRect();
      const { left, top, width, height } = ract;
      this.rotateDrag = true;
      // 开始点
      pointB = { X: ev.clientX, Y: ev.clientY };
      // 中点
      pointA = { X: left + width / 2, Y: top + height / 2 };
    },
    // 旋转控件的mousemove事件回调函数
    rotateMove(ev) {
      // 记录结束点
      pointC = { X: ev.clientX, Y: ev.clientY };
      // AB、AC向量
      const AB = { X: pointB.X - pointA.X, Y: pointB.Y - pointA.Y };
      const AC = { X: pointC.X - pointA.X, Y: pointC.Y - pointA.Y };

      // AB与AC叉乘，根据右手定则：direct小于零逆时针旋转，大于零顺时针旋转
      const direct = AB.X * AC.Y - AB.Y * AC.X;

      // AB、AC向量的模
      const AB_dx = pointA.X - pointB.X;
      const AC_dx = pointA.X - pointC.X;
      const AB_dy = pointA.Y - pointB.Y;
      const AC_dy = pointA.Y - pointC.Y;
      const lengthAB = Math.sqrt(AB_dx * AB_dx + AB_dy * AB_dy);
      const lengthAC = Math.sqrt(AC_dx * AC_dx + AC_dy * AC_dy);

      // 向量点乘，公式： A*B = x1*x2 + y1*y2
      const product = AB.X * AC.X + AB.Y * AC.Y;

      // 两个向量之间的夹角的计算公式 ：a * b = |a| * |b| * cosθ
      // 公式转换 θ = Math.acos(a * b /( |a| * |b| )); （θ为弧度）
      const rad = Math.acos(product / (lengthAB * lengthAC));
      const angle = (rad / Math.PI) * 180 || 0;

      // 根据旋转方向加减角度
      this.rotate = direct < 0 ? this.rotate - angle : this.rotate + angle;

      // 触发事件
      this.$emit('rotating', this.posData);

      //  更新起点
      pointB = { X: ev.clientX, Y: ev.clientY };
    },

    // mousemove事件回调函数
    move(ev) {
      if (this.draggable && this.bodyDrag) {
        this.bodyMove(ev);
      }
      if (this.resizeable && this.stickDrag) {
        this.stickMove(ev);
      }
      if (this.rotateable && this.rotateDrag) {
        this.rotateMove(ev);
      }
    },
    // mousemup事件回调函数
    up() {
      // 拖拽停止
      if (this.draggable && this.bodyDrag) {
        this.bodyDrag = false;
        this.$emit('dragStop', this.posData);
      }
      // 缩放停止
      if (this.resizeable && this.stickDrag) {
        this.stickDrag = false;
        this.$emit('resizeStop', this.posData);
      }
      // 旋转停止
      if (this.rotateable && this.rotateDrag) {
        this.rotateDrag = false;
        this.$emit('rotateStop', this.posData);
      }
      // 更新宽高比例
      this.whRatio = this.width / this.height;
    },
  },
  watch: {
    left(value) {
      // body处于拖动状态时，不重新计算宽高
      if (this.bodyDrag) return;
      this.width = this.parentWidth - value - this.right;
      if (this.lock) {
        this.height = this.width / this.whRatio;
      } else {
        this.height = this.parentHeight - this.top - this.bottom;
      }
    },
    top(value) {
      // body处于拖动状态时，不重新计算宽高
      if (this.bodyDrag) return;
      this.height = this.parentHeight - value - this.bottom;
      if (this.lock) {
        this.width = this.height * this.whRatio;
        // 如果操作的是左边缩放控件，则重新计算left，以右边为参照
        if (this.currentStick.match('l')) {
          this.left = this.parentWidth - this.right - this.width;
        }
      } else {
        this.width = this.parentWidth - this.left - this.right;
      }
    },
    right(value) {
      // body处于拖动状态时，不重新计算宽高
      if (this.bodyDrag) return;
      this.width = this.parentWidth - this.left - value;
      if (this.lock) {
        this.height = this.width / this.whRatio;
      } else {
        this.height = this.parentHeight - this.top - this.bottom;
      }
    },
    bottom(value) {
      // body处于拖动状态时，不重新计算宽高
      if (this.bodyDrag) return;
      this.height = this.parentHeight - this.top - value;
      if (this.lock) {
        this.width = this.height * this.whRatio;
        // 如果操作的是左边缩放控件，则重新计算left，以右边为参照
        if (this.currentStick.match('l')) {
          this.left = this.parentWidth - this.right - this.width;
        }
      } else {
        this.width = this.parentWidth - this.left - this.right;
      }
    },
    width(newVal) {
      if (newVal < MINSIZE) {
        this.width = MINSIZE;
        if (this.lock) {
          this.height = Math.round(MINSIZE / this.whRatio);
        }
      }
    },
    height(newVal) {
      if (newVal < MINSIZE) {
        this.height = MINSIZE;
        if (this.lock) {
          this.width = Math.round(MINSIZE * this.whRatio);
        }
      }
    },
    w(value) {
      if (value <= 0 || isNaN(value) || value == null) {
        this.width = 0;
        this.height = 0;
        return;
      }
      this.width = value;
      if (this.lock) {
        this.height = Math.round(value / (this.w / this.h));
      }
      this.whRatio = this.width / this.height;
    },
    h(value) {
      if (value <= 0 || isNaN(value) || value == null) {
        this.width = 0;
        this.height = 0;
        return;
      }
      this.height = value;
      if (this.lock) {
        this.width = Math.round(value * (this.w / this.h));
      }
      this.whRatio = this.width / this.height;
    },
    x(value) {
      this.left = value;
      this.right = this.parentWidth - this.w - value;
    },
    y(value) {
      this.top = value;
      this.bottom = this.parentHeight - this.h - value;
    },
    z(value) {
      this.zIndex = value;
    },
    r(value) {
      this.rotate = value;
    },
    // 锁更新，记录当前组件内data宽高比例
    lock(value) {
      if (value) {
        this.whRatio = this.width / this.height;
      }
    },
  },
};
</script>
