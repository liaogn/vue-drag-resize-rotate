<template>
  <div class="vdr-demo-stage">
    <vdr v-bind="nestedRoot" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { centerRect } from './helpers'
import { useDemoLocale } from './i18n'

const locale = useDemoLocale()
const isEn = computed(() => locale?.value === 'en')
const labels = computed(() =>
  isEn.value
    ? { root: 'Parent container', childA: 'Child A', childB: 'Child B' }
    : { root: '父级容器', childA: '子元素 A', childB: '子元素 B' }
)

const nestedRoot = computed(() => ({
  ...centerRect(320, 220),
  uuid: 'root',
  childWrapAttr: { class: 'vdr-demo-fill vdr-demo-fill--root', 'data-label': labels.value.root },
  childrens: [
    {
      w: 140,
      h: 100,
      x: 40,
      y: 40,
      r: 15,
      uuid: 'child-1',
      overflow: 'hidden',
      childWrapAttr: { class: 'vdr-demo-fill vdr-demo-fill--child-a', 'data-label': labels.value.childA },
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
      childWrapAttr: { class: 'vdr-demo-fill vdr-demo-fill--child-b', 'data-label': labels.value.childB },
    },
  ],
}))
</script>
