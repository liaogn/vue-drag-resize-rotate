<template>
  <div class="vdr-demo-stage" ref="limitStageRef">
    <div class="vdr-demo-stage-tools vdr-demo-toggles">
      <label v-for="mode in boundModes" :key="mode.value">
        <input type="radio" name="bound-demo-mode" :value="mode.value" v-model="boundMode" />
        <span>{{ mode.label }}</span>
      </label>
      <label><input type="checkbox" v-model="bound.lock" /> lock</label>
      <button type="button" @click="resetBound">reset</button>
    </div>
    <div
      :class="[
        'vdr-demo-boundary-hint',
        boundMode === 'minmax'
          ? 'vdr-demo-boundary-hint--cyan'
          : 'vdr-demo-boundary-hint--orange',
      ]"
      :style="boundaryHintStyle"
    ></div>
    <vdr
      :key="boundKey"
      v-bind="boundSizeProps"
      :w="boundPos.w"
      :h="boundPos.h"
      :x="boundPos.x"
      :y="boundPos.y"
      :r="boundPos.r"
      :lock="bound.lock"
      :limit-x="[bound.lx0, bound.lx1]"
      :limit-y="[bound.ly0, bound.ly1]"
      overflow="hidden"
      @dragging="updateBound"
      @resizing="updateBound"
      @rotating="updateBound"
      @fliped="updateBound"
    >
      <div :class="['vdr-demo-card', boundMode === 'minmax' ? 'vdr-demo-card--alt' : '']">
        {{ boundMode === 'minmax' ? 'bounded + min/max' : 'bounded · drag / resize / rotate / flip' }}
      </div>
    </vdr>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import {
  STAGE_HEIGHT,
  STAGE_WIDTH,
  assignPos,
  boundaryStyle,
  centerRectInBoundary,
  getBoundary,
  type PosDataLike,
} from './helpers'

type BoundMode = 'limit' | 'minmax'

const limitStageRef = ref<HTMLElement | null>(null)
const stageSize = reactive({ width: STAGE_WIDTH, height: STAGE_HEIGHT })
const boundTouched = ref(false)
let stageResizeObserver: ResizeObserver | null = null

const boundMode = ref<BoundMode>('limit')
const boundModes: { value: BoundMode; label: string }[] = [
  { value: 'limit', label: 'limit' },
  { value: 'minmax', label: 'min/max' },
]
const boundSizeProps = computed(() =>
  boundMode.value === 'minmax'
    ? { minWidth: 60, minHeight: 60, maxWidth: 240, maxHeight: 200 }
    : {}
)

function getBoundRect(mode: BoundMode, width = stageSize.width, height = stageSize.height) {
  return mode === 'minmax'
    ? centerRectInBoundary(140, 110, 10, width, height)
    : centerRectInBoundary(120, 100, 20, width, height)
}

const boundPos = reactive(getBoundRect(boundMode.value))
const initialBoundary = getBoundary()
const bound = reactive({
  lx0: initialBoundary.x0,
  lx1: initialBoundary.x1,
  ly0: initialBoundary.y0,
  ly1: initialBoundary.y1,
  lock: false,
})
const boundKey = ref(0)
const boundaryHintStyle = computed(() => boundaryStyle(bound))

function updateBound(pos: PosDataLike) {
  boundTouched.value = true
  assignPos(boundPos, pos)
}

function resetBound() {
  Object.assign(boundPos, getBoundRect(boundMode.value))
  boundTouched.value = false
  bound.lock = false
  boundKey.value++
}

function syncLimitBoundary() {
  const boundary = getBoundary(stageSize.width, stageSize.height)
  bound.lx0 = boundary.x0
  bound.lx1 = boundary.x1
  bound.ly0 = boundary.y0
  bound.ly1 = boundary.y1
  if (!boundTouched.value) {
    Object.assign(boundPos, getBoundRect(boundMode.value, stageSize.width, stageSize.height))
    boundKey.value++
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
watch(boundMode, () => resetBound())
</script>
