<template>
  <div class="vdr-demo-stage">
    <vdr
      :w="basic.w"
      :h="basic.h"
      :x="basic.x"
      :y="basic.y"
      :r="basic.r"
      overflow="hidden"
      @dragging="updateBasic"
      @resizing="updateBasic"
      @rotating="updateBasic"
    >
      <div class="vdr-demo-card">drag · resize · rotate</div>
    </vdr>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { assignPos, centerRect, type PosDataLike } from './helpers'

const basic = reactive(centerRect(180, 140))

function updateBasic(pos: PosDataLike) {
  assignPos(basic, pos)
}
</script>
