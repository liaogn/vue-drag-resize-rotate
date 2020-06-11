<template>
  <div
    :class="{ 'vdr-active': active && activeable, 'vdr-not-active': !activeable }"
    :style="style"
    @click.stop
    @mousedown.stop.prevent="bodyDown($event)"
    class="vdr"
    ref="vdr"
  >
    <!-- 控件 -->
    <template v-if="active && activeable">
      <!-- 缩放控件 -->
      <span
        :class="`vdr-stick-${stick}`"
        :key="stickIndex"
        :style="{zIndex:activeStick==stickIndex?10:9}"
        @mousedown.stop.prevent="stickDown($event, stick,stickIndex)"
        class="vdr-stick"
        v-for="(stick, stickIndex) in sticks"
      ></span>
      <!-- 旋转控件 -->
      <template v-if="rotateable">
        <span class="vdr-stick-rotate-line"></span>
        <span @mousedown.stop.prevent="rotateDown($event)" class="vdr-stick vdr-rotate"></span>
      </template>
    </template>

    <!-- 插槽 -->
    <div :bg="bg" class="vdr-slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// 宽高最小值
const MINSIZE = 0;

// 旋转坐标点缓存
let pointA = {};
let pointB = {};
let pointC = {};

export default {
  name: "VueDragResizeRotate",
  props: {
    d: {
      type: Boolean,
      default: true
    },
    bg: {
      type: String,
      default: ""
    },
    lock: {
      type: Boolean,
      default: false
    },
    w: {
      type: Number,
      default: 100,
      validator: function(val) {
        return val >= 0;
      }
    },
    h: {
      type: Number,
      default: 100,
      validator: function(val) {
        return val >= 0;
      }
    },
    x: {
      type: Number,
      default: 0,
      validator: function(val) {
        return typeof val === "number";
      }
    },
    y: {
      type: Number,
      default: 0,
      validator: function(val) {
        return typeof val === "number";
      }
    },
    z: {
      type: [String, Number],
      default: "auto"
    },
    r: {
      type: Number,
      default: 0
    },
    sticks: {
      type: Array,
      default: function() {
        return ["tl", "tm", "tr", "mr", "br", "bm", "bl", "ml"];
      }
    },
    stickSize: {
      type: Number,
      default: 10
    },
    active: {
      type: Boolean,
      default: true
    },
    draggable: {
      type: Boolean,
      default: true
    },
    resizeable: {
      type: Boolean,
      default: true
    },
    rotateable: {
      type: Boolean,
      default: true
    },
    activeable: {
      type: Boolean,
      default: true
    },
    borderSize: {
      type: Number,
      default: 2
    },
    widthRange: {
      type: Array
    },
    heightRange: {
      type: Array
    }
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
      activeStick: -1
    };
  },
  computed: {
    style() {
      const rotate = `rotateZ(${Math.round(this.rotate)}deg)`;
      const translate = `translateX(${this.left}px) translateY(${this.top}px)`;
      return {
        zIndex: this.zIndex,
        width: `${this.width}px`,
        height: `${this.height}px`,
        transform: `${translate} ${rotate}`
      };
    },
    posData() {
      return {
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height,
        rotate: Math.round(this.rotate)
      };
    },
    // x的最小偏移值
    minOffsetLeft() {
      // console.log(this.minWidth);
      return this.parentWidth - this.right - this.minWidth;
    },
    maxOffsetLeft() {
      // console.log(this.minWidth);
      return this.parentWidth - this.right - this.maxWidth;
    },
    // y的最小偏移值
    minOffsetTop() {
      return this.parentHeight - this.bottom - this.minHeight;
    },
    maxOffsetTop() {
      return this.parentHeight - this.bottom - this.maxHeight;
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    // 销毁前移除事件
    document.documentElement.removeEventListener("mousemove", this.move);
    document.documentElement.removeEventListener("mouseup", this.up);
  },
  methods: {
    // 计算最小宽
    calcMinWidth() {
      const min = Math.min.apply(null, this.widthRange);
      if (min < 0 || (min >= 0 && min >= this.width)) return 0;
      return min || 0;
    },
    // 计算最大宽
    calcMaxWidth() {
      const max = Math.max.apply(null, this.widthRange);
      if (max <= 0 || (max > 0 && max < this.width)) return Infinity;
      return max || Infinity;
    },
    // 计算最小高
    calcMinHeight() {
      let min = Math.min.apply(null, this.heightRange);
      if (min < 0 || (min >= 0 && min >= this.height)) min = 0;
      if (this.lock) {
        if (this.widthRange) {
          return this.minWidth / this.whRatio;
        } else if (this.widthRange == null && this.heightRange) {
          this.minWidth = min * this.whRatio;
        }
      }
      return min || 0;
    },
    // 计算最大高
    calcMaxHeight() {
      let max = Math.max.apply(null, this.heightRange);
      if (max <= 0 || (max > 0 && max < this.height)) max = Infinity;
      if (this.lock) {
        if (this.widthRange) {
          return this.maxWidth / this.whRatio;
        } else if (this.widthRange == null && this.heightRange) {
          this.maxWidth = max * this.whRatio;
        }
      }
      return max || Infinity;
    },
    // 范围值初始
    setLimitValue() {
      this.minWidth = this.calcMinWidth();
      this.maxWidth = this.calcMaxWidth();
      this.minHeight = this.calcMinHeight();
      this.maxHeight = this.calcMaxHeight();
    },
    // 初始化
    init() {
      // 缩放控件类型初始化
      this.currentStick = "";

      // 元素宽高比例初始化
      this.whRatio = this.width / this.height;

      // 父级信息初始化
      this.parentElement = this.$el.parentNode;
      this.parentWidth = this.parentElement.clientWidth;
      this.parentHeight = this.parentElement.clientHeight;

      // 元素bottom、right初始化
      this.bottom = this.parentHeight - this.height - this.top;
      this.right = this.parentWidth - this.width - this.left;

      // 范围值初始化
      this.setLimitValue();

      // 鼠标、元素位置信息初始化
      this.bodyStartPos = {
        mx: 0,
        my: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      };

      document.documentElement.addEventListener("mousemove", this.move);
      document.documentElement.addEventListener("mouseup", this.up);
    },
    //元素本身的mousedown事件回调函数
    bodyDown(ev) {
      if (!this.activeable) return;
      this.bodyDrag = true;
      // 记录开始鼠标位置
      this.bodyStartPos.mx = ev.clientX;
      this.bodyStartPos.my = ev.clientY;
      // 记录开始元素位置
      this.bodyStartPos.left = this.left;
      this.bodyStartPos.top = this.top;
      this.activeable && this.$emit("activated", this.posData);
    },
    // 元素本身的mousemove事件回调函数
    bodyMove(ev) {
      // 起始位置信息
      const { mx, my, left, top } = this.bodyStartPos;
      // 位移向量
      const vector = { x: ev.clientX - mx, y: ev.clientY - my };
      // 更新位置信息
      this.left = left + vector.x;
      this.top = top + vector.y;
      // 触发拖拽事件
      this.$emit("dragging", this.posData);
    },

    //缩放控件的mousedown事件回调函数
    stickDown(ev, stick, index) {
      if (!this.activeable) return;

      this.stickDrag = true;
      this.activeStick = index;
      // 记录当前拖拽的stick
      this.currentStick = stick;

      // 记录开始时鼠标位置
      this.bodyStartPos.mx = ev.clientX;
      this.bodyStartPos.my = ev.clientY;

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
      const vector = { x: ev.clientX - mx, y: ev.clientY - my };

      // 如果比例锁定，将非m控件替代为m控件计算
      if (this.lock && !currentStick.match("m")) {
        currentStick = `${currentStick[0]}m`;
      }

      // 根据当前控件类型更新位置信息
      currentStick[0] == "t" && (this.top = top + vector.y);
      currentStick[0] == "b" && (this.bottom = bottom - vector.y);

      currentStick[1] == "l" && (this.left = left + vector.x);
      currentStick[1] == "r" && (this.right = right - vector.x);

      // 触发缩放事件
      this.$emit("resizing", this.posData);
    },

    // 旋转控件的mousedown事件回调函数
    rotateDown(ev) {
      if (!this.activeable) return;
      // 当前元素
      const vdr = this.$refs.vdr;
      // 当前元素位置大小信息，用于计算旋转元素的中心点
      const rect = vdr.getBoundingClientRect();
      const { left, top, width, height } = rect;
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
      // Math.acos的参数范围[-1, 1] ,返回值[-PI, PI],其余值返回 NAN
      const rad = Math.acos(product / (lengthAB * lengthAC));
      const angle = (rad / Math.PI) * 180 || 0;

      // 根据旋转方向加减角度
      this.rotate = direct < 0 ? this.rotate - angle : this.rotate + angle;

      // 触发事件
      this.$emit("rotating", this.posData);

      // 更新起点
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
        this.$emit("dragStop", this.posData);
      }
      // 缩放停止
      if (this.resizeable && this.stickDrag) {
        this.stickDrag = false;
        this.$emit("resizeStop", this.posData);
      }
      // 旋转停止
      if (this.rotateable && this.rotateDrag) {
        this.rotateDrag = false;
        this.$emit("rotateStop", this.posData);
      }
      // 更新宽高比例，当宽高其中一个为0时，不更新比例
      if (this.width > 0 && this.height > 0) {
        this.whRatio = this.width / this.height;
      }
    }
  },
  watch: {
    left(value) {
      // body处于拖动状态时，不重新计算宽高
      if (this.bodyDrag) return;

      // 更新宽度、宽度范围校验
      if (value > this.minOffsetLeft) this.left = this.minOffsetLeft;
      if (value < this.maxOffsetLeft) this.left = this.maxOffsetLeft;
      this.width = this.parentWidth - this.left - this.right;

      // 处理锁定状态
      if (this.lock) {
        this.height = this.width / this.whRatio;
      }
    },
    top(value) {
      // body处于拖动状态时，不重新计算宽高
      if (this.bodyDrag) return;

      // 更新高度、最小高度检测
      if (value > this.minOffsetTop) this.top = this.minOffsetTop;
      if (value < this.maxOffsetTop) this.top = this.maxOffsetTop;
      this.height = this.parentHeight - this.top - this.bottom;

      // 处理锁定状态
      if (this.lock) {
        this.width = this.height * this.whRatio;
        // 如果操作的是左边缩放控件，则重新计算left，以右边为参照
        if (this.currentStick.match("l")) {
          this.left = this.parentWidth - this.right - this.width;
        }
      }
    },
    right(value) {
      // body处于拖动状态时，不重新计算宽高
      if (this.bodyDrag) return;

      // 更新宽度、宽度范围校验
      let width = this.parentWidth - value - this.left;
      width = width < this.minWidth ? this.minWidth : width;
      width = width > this.maxWidth ? this.maxWidth : width;
      this.width = width;

      if (this.lock) {
        this.height = this.width / this.whRatio;
      }
    },
    bottom(value) {
      // body处于拖动状态时，不重新计算宽高
      if (this.bodyDrag) return;

      // 更新高度、最小高度检测
      let height = this.parentHeight - value - this.top;
      height = height < this.minHeight ? this.minHeight : height;
      height = height > this.maxHeight ? this.maxHeight : height;
      this.height = height;
      // 处理锁定状态
      if (this.lock) {
        this.width = this.height * this.whRatio;
        // 如果操作的是左边缩放控件，则重新计算left，以右边为参照
        if (this.currentStick.match("l")) {
          this.left = this.parentWidth - this.right - this.width;
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
    lock(value) {
      if (value) {
        this.whRatio = this.width / this.height;
        this.setLimitValue();
      }
    }
  }
};
</script>
