<template>
  <div class="vdr-demo-stage">
    <vdr v-bind="nestedRoot" />
  </div>
</template>

<script setup lang="ts">
import { centerRect } from './helpers'

const nestedRoot = {
  ...centerRect(320, 220),
  uuid: 'root',
  childWrapAttr: { class: 'vdr-demo-fill vdr-demo-fill--root', 'data-label': '父级容器' },
  childrens: [
    {
      w: 140,
      h: 100,
      x: 40,
      y: 40,
      r: 15,
      uuid: 'child-1',
      overflow: 'hidden',
      childWrapAttr: { class: 'vdr-demo-fill vdr-demo-fill--child-a', 'data-label': '子元素 A' },
    },
    {
      w: 90,
      h: 90,
      x: 190,
      y: 100,
      r: -10,
      lock: true,
      uuid: 'child-2',
      overflow: 'hidden',
      childWrapAttr: { class: 'vdr-demo-fill vdr-demo-fill--child-b', 'data-label': '子元素 B' },
    },
  ],
}
</script>
