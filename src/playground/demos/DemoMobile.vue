<template>
  <div
    class="vdr-demo-stage vdr-demo-mobile-stage"
    ref="stageRef"
    data-testid="mobile-demo"
  >
    <div class="vdr-demo-stage-tools vdr-demo-mobile-tools">
      <button type="button" @click="resetMobile">reset</button>
      <output
        class="vdr-demo-mobile-readout"
        data-testid="mobile-readout"
        :data-x="mobile.x"
        :data-y="mobile.y"
        :data-w="mobile.w"
        :data-h="mobile.h"
        :data-r="mobile.r"
        :data-lx0="limit.x0"
        :data-lx1="limit.x1"
        :data-ly0="limit.y0"
        :data-ly1="limit.y1"
      >
        x {{ fmt(mobile.x) }} · y {{ fmt(mobile.y) }} · w {{ fmt(mobile.w) }} ·
        h {{ fmt(mobile.h) }} · r {{ fmt(mobile.r) }}
      </output>
    </div>
    <div class="vdr-demo-mobile-boundary" :style="boundaryHintStyle"></div>
    <vdr
      :key="mobileKey"
      :w="mobile.w"
      :h="mobile.h"
      :x="mobile.x"
      :y="mobile.y"
      :r="mobile.r"
      :min-width="64"
      :min-height="56"
      :max-width="220"
      :max-height="180"
      :limit-x="[limit.x0, limit.x1]"
      :limit-y="[limit.y0, limit.y1]"
      overflow="hidden"
      @dragging="updateMobile"
      @dragStop="updateMobile"
      @resizing="updateMobile"
      @resizeStop="updateMobile"
      @rotating="updateMobile"
      @rotateStop="updateMobile"
      @fliped="updateMobile"
    >
      <div class="vdr-demo-card vdr-demo-mobile-card" data-testid="mobile-card">
        touch · drag · resize · rotate
      </div>
    </vdr>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { assignPos, fmt, type PosDataLike } from './helpers'

const MOBILE_STAGE_WIDTH = 320
const MOBILE_STAGE_HEIGHT = 520
const MOBILE_BOUNDARY_MARGIN = 14

const stageRef = ref<HTMLElement | null>(null)
const stageSize = reactive({ width: MOBILE_STAGE_WIDTH, height: MOBILE_STAGE_HEIGHT })
const mobileTouched = ref(false)
const mobileKey = ref(0)
let stageResizeObserver: ResizeObserver | null = null

function getMobileRect(width = stageSize.width, height = stageSize.height) {
  const w = 120
  const h = 96
  return {
    w,
    h,
    x: Math.round((width - w) / 2),
    y: Math.round((height - h) / 2 + 48),
    r: 12,
  }
}

const mobile = reactive(getMobileRect())
const limit = computed(() => ({
  x0: MOBILE_BOUNDARY_MARGIN,
  x1: Math.max(MOBILE_BOUNDARY_MARGIN, stageSize.width - MOBILE_BOUNDARY_MARGIN),
  y0: MOBILE_BOUNDARY_MARGIN,
  y1: Math.max(MOBILE_BOUNDARY_MARGIN, stageSize.height - MOBILE_BOUNDARY_MARGIN),
}))
const boundaryHintStyle = computed(() => ({
  left: `${limit.value.x0}px`,
  top: `${limit.value.y0}px`,
  width: `${limit.value.x1 - limit.value.x0}px`,
  height: `${limit.value.y1 - limit.value.y0}px`,
}))

function updateMobile(pos: PosDataLike) {
  mobileTouched.value = true
  assignPos(mobile, pos)
}

function resetMobile() {
  Object.assign(mobile, getMobileRect())
  mobileTouched.value = false
  mobileKey.value++
}

onMounted(() => {
  nextTick(() => {
    if (!stageRef.value) return

    const syncStageSize = () => {
      if (!stageRef.value) return
      const rect = stageRef.value.getBoundingClientRect()
      stageSize.width = Math.round(rect.width)
      stageSize.height = Math.round(rect.height)
    }

    syncStageSize()
    stageResizeObserver = new ResizeObserver(syncStageSize)
    stageResizeObserver.observe(stageRef.value)
  })
})

onBeforeUnmount(() => {
  stageResizeObserver?.disconnect()
})

watch(
  () => [stageSize.width, stageSize.height],
  () => {
    if (mobileTouched.value) return
    Object.assign(mobile, getMobileRect())
    mobileKey.value++
  }
)
</script>
