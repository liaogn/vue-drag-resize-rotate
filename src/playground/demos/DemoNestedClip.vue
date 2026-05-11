<template>
  <div class="vdr-demo-stage">
    <vdr v-bind="nestedClipped" />
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
    ? { root: 'Clipping parent', child: 'Clipped child' }
    : { root: '裁剪父级', child: '被裁剪的子元素' }
)

const nestedClipped = computed(() => ({
  ...centerRect(320, 220),
  uuid: 'clip-root',
  childWrapAttr: {
    class: 'vdr-demo-fill vdr-demo-fill--clip-root',
    'data-label': labels.value.root,
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
        'data-label': labels.value.child,
      },
    },
  ],
}))
</script>
