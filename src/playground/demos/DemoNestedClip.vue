<template>
  <div class="vdr-demo-stage">
    <vdr v-bind="nestedClipped" />
  </div>
</template>

<script setup lang="ts">
import { centerRect } from './helpers'

const nestedClipped = {
  ...centerRect(320, 220),
  uuid: 'clip-root',
  childWrapAttr: {
    class: 'vdr-demo-fill vdr-demo-fill--clip-root',
    'data-label': '裁剪父级',
  },
  overflow: 'hidden',
  childrens: [
    {
      w: 200,
      h: 160,
      x: 60,
      y: 30,
      r: 20,
      overflow: 'hidden',
      uuid: 'clip-child',
      childWrapAttr: {
        class: 'vdr-demo-fill vdr-demo-fill--clip-child',
        'data-label': '被裁剪的子元素',
      },
    },
  ],
}
</script>
