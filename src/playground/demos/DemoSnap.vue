<template>
  <div class="vdr-demo-stage vdr-demo-snap-stage">
    <div class="vdr-demo-stage-tools vdr-demo-toggles">
      <label><input type="checkbox" v-model="snapEnabled" /> snap</label>
      <label><input type="checkbox" v-model="gridEnabled" /> grid</label>
      <label><input type="checkbox" v-model="customLinesEnabled" /> custom lines</label>
      <label><input type="checkbox" v-model="rotateSnapEnabled" /> rotate 15deg</label>
      <button type="button" @click="reset">reset</button>
    </div>

    <div
      v-for="line in visibleCustomLines"
      :key="line.key"
      :class="['vdr-demo-snap-custom-line', `vdr-demo-snap-custom-line--${line.axis}`]"
      :style="line.style"
    ></div>

    <div
      v-for="guide in snapGuides"
      :key="`${guide.axis}-${guide.value}-${guide.start}-${guide.end}`"
      :class="['vdr-demo-snap-guide', `vdr-demo-snap-guide--${guide.axis}`]"
      :style="guideStyle(guide)"
    ></div>

    <vdr
      v-for="item in passiveRects"
      :key="item.uuid"
      v-bind="item"
      :active="false"
      :draggable="false"
      :resizeable="false"
      :rotateable="false"
      activeable
    >
      <div class="vdr-demo-card vdr-demo-card--muted">{{ item.label }}</div>
    </vdr>

    <vdr
      :key="activeKey"
      :w="activeRect.w"
      :h="activeRect.h"
      :x="activeRect.x"
      :y="activeRect.y"
      :r="activeRect.r"
      :snap="snapEnabled"
      :snap-threshold="8"
      :snap-targets="['parent', 'siblings']"
      :snap-lines="snapLines"
      :grid="gridSize"
      :rotate-snap="rotateSnapEnabled ? 15 : 0"
      :rotate-snap-threshold="4"
      @dragging="updateActive"
      @resizing="updateActive"
      @rotating="updateActive"
      @snapping="updateGuides"
    >
      <div class="vdr-demo-card vdr-demo-card--success">drag me</div>
    </vdr>

    <div class="vdr-demo-snap-readout">
      x {{ fmt(activeRect.x) }} · y {{ fmt(activeRect.y) }} · r {{ fmt(activeRect.r) }}deg
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { assignPos, fmt, type PosDataLike } from './helpers'
import type { SnapGuide, SnapLineInput } from '../../core'

const initialActiveRect = { w: 112, h: 82, x: 44, y: 72, r: -8 }
const activeRect = reactive({ ...initialActiveRect })
const activeKey = ref(0)
const snapEnabled = ref(true)
const gridEnabled = ref(true)
const customLinesEnabled = ref(true)
const rotateSnapEnabled = ref(true)
const snapGuides = ref<SnapGuide[]>([])

const customLines: SnapLineInput[] = [{ x: 210 }, { y: 250 }]
const snapLines = computed(() => (customLinesEnabled.value ? customLines : undefined))
const gridSize = computed<[number, number] | null>(() => (gridEnabled.value ? [32, 32] : null))

const passiveRects = [
  { uuid: 'snap-a', w: 120, h: 90, x: 260, y: 56, r: 12, label: 'sibling A' },
  { uuid: 'snap-b', w: 104, h: 120, x: 112, y: 228, r: -18, label: 'sibling B' },
]

const visibleCustomLines = computed(() => {
  if (!customLinesEnabled.value) return []
  return customLines.flatMap((line, index) => {
    const lines: {
      key: string
      axis: 'x' | 'y'
      style: Record<string, string>
    }[] = []
    if (typeof line.x === 'number') {
      lines.push({ key: `${index}-x`, axis: 'x', style: { left: `${line.x}px` } })
    }
    if (typeof line.y === 'number') {
      lines.push({ key: `${index}-y`, axis: 'y', style: { top: `${line.y}px` } })
    }
    return lines
  })
})

function updateActive(pos: PosDataLike) {
  assignPos(activeRect, pos)
}

function updateGuides(payload: { guides: SnapGuide[] }) {
  snapGuides.value = payload.guides
}

function guideStyle(guide: SnapGuide) {
  if (guide.axis === 'x') {
    return {
      left: `${guide.value}px`,
      top: `${guide.start}px`,
      height: `${guide.end - guide.start}px`,
    }
  }
  return {
    top: `${guide.value}px`,
    left: `${guide.start}px`,
    width: `${guide.end - guide.start}px`,
  }
}

function reset() {
  Object.assign(activeRect, initialActiveRect)
  snapGuides.value = []
  activeKey.value++
}
</script>
