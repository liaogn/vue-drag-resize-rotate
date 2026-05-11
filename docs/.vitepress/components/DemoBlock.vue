<template>
  <DemoPreview
    v-if="demo"
    :title="demo.title"
    :description="demo.description"
    :component="demo.component"
    :source="demo.source"
    :locale="locale"
  />
  <p v-else class="demo-block__missing">Demo not found: {{ demoKey }}</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import DemoPreview from '../../../src/playground/demos/DemoPreview.vue'
import { getDemo } from '../../../src/playground/demos/registry'
import type { DemoLocale } from '../../../src/playground/demos/i18n'

const props = defineProps<{
  demoKey: string
}>()

const { lang } = useData()
const locale = computed<DemoLocale>(() => (lang.value.startsWith('en') ? 'en' : 'zh'))
const demo = computed(() => getDemo(props.demoKey, locale.value))
</script>

<style scoped>
.demo-block__missing {
  margin: 0;
  padding: 16px;
  border: 1px solid var(--vp-c-danger-soft);
  border-radius: 8px;
  color: var(--vp-c-danger-1);
  background: var(--vp-c-danger-soft);
}
</style>
