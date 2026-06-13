<template>
  <div class="vdr-demo-stage vdr-demo-scale-stage">
    <div class="vdr-demo-stage-tools vdr-demo-toggles">
      <label><input type="checkbox" v-model="scaleAware" /> scale-aware</label>
      <button type="button" @click="reset">reset</button>
    </div>

    <div class="vdr-demo-scale-canvas">
      <!-- 单层：验证基础 scale 拖拽 / 缩放 -->
      <vdr
        :key="activeKey"
        :w="activeRect.w"
        :h="activeRect.h"
        :x="activeRect.x"
        :y="activeRect.y"
        :scale="scaleAware ? 0.6 : 1"
        @dragging="updateActive"
        @resizing="updateActive"
        @rotating="updateActive"
      >
        <div class="vdr-demo-card vdr-demo-card--success">drag me</div>
      </vdr>

      <!-- 嵌套：父 vdr 仅作定位容器，子 vdr 可交互。
           验证 scale 归一化与父子坐标系换算的组合（子缩放走 stickMove，依赖 parentInfo）。 -->
      <vdr
        :key="`parent-${activeKey}`"
        :w="parentRect.w"
        :h="parentRect.h"
        :x="parentRect.x"
        :y="parentRect.y"
        :scale="scaleAware ? 0.6 : 1"
        :active="false"
        :activeable="false"
        :draggable="false"
        :resizeable="false"
        :rotateable="false"
      >
        <vdr
          :w="childRect.w"
          :h="childRect.h"
          :x="childRect.x"
          :y="childRect.y"
          :scale="scaleAware ? 0.6 : 1"
          @dragging="updateChild"
          @resizing="updateChild"
        >
          <div class="vdr-demo-card vdr-demo-card--nested">nested</div>
        </vdr>
      </vdr>
    </div>

    <div
      class="vdr-demo-scale-readout"
      data-testid="scale-readout"
      :data-x="activeRect.x"
      :data-y="activeRect.y"
      :data-w="activeRect.w"
      :data-h="activeRect.h"
    >
      x {{ fmt(activeRect.x) }} · y {{ fmt(activeRect.y) }} · w {{ fmt(activeRect.w) }} · h
      {{ fmt(activeRect.h) }}
    </div>
    <div
      class="vdr-demo-scale-child-readout"
      data-testid="scale-child-readout"
      :data-x="childRect.x"
      :data-y="childRect.y"
      :data-w="childRect.w"
      :data-h="childRect.h"
    >
      child x {{ fmt(childRect.x) }} · y {{ fmt(childRect.y) }} · w {{ fmt(childRect.w) }} · h
      {{ fmt(childRect.h) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { assignPos, fmt, type PosDataLike } from './helpers'

const initialActiveRect = { w: 120, h: 90, x: 40, y: 40, r: 0 }
// 父 vdr 仅作定位容器（不旋转、不可交互）；子 vdr 在其内部可拖拽/缩放
const initialParentRect = { w: 180, h: 170, x: 200, y: 150, r: 0 }
const initialChildRect = { w: 90, h: 70, x: 30, y: 30, r: 0 }

const activeRect = reactive({ ...initialActiveRect })
const parentRect = reactive({ ...initialParentRect })
const childRect = reactive({ ...initialChildRect })
const activeKey = ref(0)
const scaleAware = ref(true)

function updateActive(pos: PosDataLike) {
  assignPos(activeRect, pos)
}

function updateChild(pos: PosDataLike) {
  assignPos(childRect, pos)
}

function reset() {
  Object.assign(activeRect, initialActiveRect)
  Object.assign(parentRect, initialParentRect)
  Object.assign(childRect, initialChildRect)
  activeKey.value++
}
</script>
