<template>
  <div class="vdr-demo-stage" ref="limitStageRef">
    <div
      class="vdr-demo-boundary-hint vdr-demo-boundary-hint--orange"
      :style="boundaryHintStyle"
    ></div>
    <vdr
      v-bind="boundedNestedRoot"
      :limit-x="[bound.lx0, bound.lx1]"
      :limit-y="[bound.ly0, bound.ly1]"
      uuid="nest-root"
      overflow="hidden"
      @dragging="updateBoundedNestedRoot"
      @resizing="updateBoundedNestedRoot"
      @rotating="updateBoundedNestedRoot"
      @fliped="updateBoundedNestedRoot"
    >
      <div class="vdr-demo-nested-limit-root-bg"></div>
      <div
        class="vdr-demo-boundary-hint vdr-demo-boundary-hint--cyan"
        :style="nestedChildBoundaryStyle"
      ></div>
      <vdr
        :w="120"
        :h="90"
        :x="30"
        :y="30"
        :r="15"
        :limit-x="[12, 268]"
        :limit-y="[12, 208]"
        uuid="nest-child-a"
        overflow="hidden"
      >
        <div class="vdr-demo-card">child A</div>
      </vdr>
      <vdr
        :w="80"
        :h="80"
        :x="160"
        :y="100"
        :r="-10"
        :lock="true"
        :limit-x="[12, 268]"
        :limit-y="[12, 208]"
        uuid="nest-child-b"
        overflow="hidden"
      >
        <div class="vdr-demo-card vdr-demo-card--alt">child B (lock)</div>
      </vdr>
    </vdr>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import {
  STAGE_HEIGHT,
  STAGE_WIDTH,
  assignPos,
  boundaryStyle,
  centerRectInBoundary,
  getBoundary,
  type PosDataLike,
} from './helpers'

const limitStageRef = ref<HTMLElement | null>(null)
const stageSize = reactive({ width: STAGE_WIDTH, height: STAGE_HEIGHT })
const rootTouched = ref(false)
let stageResizeObserver: ResizeObserver | null = null

const initialBoundary = getBoundary(stageSize.width, stageSize.height)
const bound = reactive({
  lx0: initialBoundary.x0,
  lx1: initialBoundary.x1,
  ly0: initialBoundary.y0,
  ly1: initialBoundary.y1,
})
const boundedNestedRoot = reactive(centerRectInBoundary(280, 220, 0, stageSize.width, stageSize.height))
const boundaryHintStyle = computed(() => boundaryStyle(bound))
const nestedChildBoundaryStyle: CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '12px',
  width: '256px',
  height: '196px',
  pointerEvents: 'none',
}

function updateBoundedNestedRoot(pos: PosDataLike) {
  rootTouched.value = true
  assignPos(boundedNestedRoot, pos)
}

function syncLimitBoundary() {
  const boundary = getBoundary(stageSize.width, stageSize.height)
  bound.lx0 = boundary.x0
  bound.lx1 = boundary.x1
  bound.ly0 = boundary.y0
  bound.ly1 = boundary.y1

  if (!rootTouched.value) {
    Object.assign(
      boundedNestedRoot,
      centerRectInBoundary(280, 220, 0, stageSize.width, stageSize.height)
    )
  }
}

onMounted(() => {
  nextTick(() => {
    if (!limitStageRef.value) return

    const syncStageSize = () => {
      if (!limitStageRef.value) return
      const rect = limitStageRef.value.getBoundingClientRect()
      stageSize.width = Math.round(rect.width)
      stageSize.height = Math.round(rect.height)
    }

    syncStageSize()
    stageResizeObserver = new ResizeObserver(syncStageSize)
    stageResizeObserver.observe(limitStageRef.value)
  })
})

onBeforeUnmount(() => {
  stageResizeObserver?.disconnect()
})

watch(() => [stageSize.width, stageSize.height], syncLimitBoundary, { immediate: true })
</script>
