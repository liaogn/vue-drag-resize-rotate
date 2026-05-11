<template>
  <div class="vdr-demo-stage">
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
import type { CSSProperties } from 'vue'
import { boundaryStyle, centerRectInBoundary, getBoundary } from './helpers'

const initialBoundary = getBoundary()
const bound = {
  lx0: initialBoundary.x0,
  lx1: initialBoundary.x1,
  ly0: initialBoundary.y0,
  ly1: initialBoundary.y1,
}
const boundedNestedRoot = centerRectInBoundary(280, 220)
const boundaryHintStyle = boundaryStyle(bound)
const nestedChildBoundaryStyle: CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '12px',
  width: '256px',
  height: '196px',
  pointerEvents: 'none',
}
</script>
