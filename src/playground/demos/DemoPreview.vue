<template>
  <section class="vdr-demo-preview">
    <div class="vdr-demo-preview__info">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <div class="vdr-demo-preview__canvas">
      <component :is="component" />
    </div>
    <div class="vdr-demo-preview__bar">
      <button type="button" @click="toggleExpanded">
        {{ expanded ? '收起代码' : '展开代码' }}
      </button>
      <button type="button" @click="copyCode">
        {{ copied ? '已复制' : '复制代码' }}
      </button>
    </div>
    <div v-if="expanded" class="vdr-demo-preview__source">
      <div
        v-if="highlightedSource"
        class="vdr-demo-preview__highlight"
        v-html="highlightedSource"
      ></div>
      <pre v-else><code>{{ source }}</code></pre>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Component } from 'vue'
import { codeToHtml } from 'shiki/bundle/web'

const props = defineProps<{
  title: string
  description: string
  component: Component
  source: string
}>()

const expanded = ref(false)
const copied = ref(false)
const highlightedSource = ref('')
let copiedTimer: number | undefined
let highlightRun = 0

async function copyCode() {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  await navigator.clipboard.writeText(props.source)
  copied.value = true
  if (copiedTimer) window.clearTimeout(copiedTimer)
  copiedTimer = window.setTimeout(() => {
    copied.value = false
  }, 1400)
}

function toggleExpanded() {
  expanded.value = !expanded.value
  if (expanded.value && !highlightedSource.value) {
    highlightSource()
  }
}

async function highlightSource() {
  const runId = ++highlightRun
  highlightedSource.value = ''

  try {
    const html = await codeToHtml(props.source, {
      lang: 'vue',
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    })

    if (runId === highlightRun) {
      highlightedSource.value = html
    }
  } catch {
    if (runId === highlightRun) {
      highlightedSource.value = ''
    }
  }
}

watch(
  () => props.source,
  () => {
    highlightedSource.value = ''
    if (expanded.value) {
      highlightSource()
    }
  }
)
</script>

<style scoped>
.vdr-demo-preview {
  --vdr-demo-border: var(--vp-c-divider, #e2e2e3);
  --vdr-demo-bg: var(--vp-c-bg, #ffffff);
  --vdr-demo-bg-soft: var(--vp-c-bg-soft, #f6f6f7);
  --vdr-demo-text-1: var(--vp-c-text-1, #3c3c43);
  --vdr-demo-text-2: var(--vp-c-text-2, #67676c);
  --vdr-demo-brand: var(--vp-c-brand-1, #3451b2);
  --vdr-demo-code-bg: var(--vp-code-block-bg, #f6f6f7);
  --vdr-demo-code-text: var(--vp-code-block-color, #3c3c43);

  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vdr-demo-border);
  border-radius: 8px;
  background: var(--vdr-demo-bg);
}

.vdr-demo-preview__info {
  padding: 16px 20px 14px;
  border-bottom: 1px solid var(--vdr-demo-border);
}

.vdr-demo-preview__info h3 {
  margin: 0;
  border: 0;
  color: var(--vdr-demo-text-1);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.45;
}

.vdr-demo-preview__info p {
  margin: 8px 0 0;
  color: var(--vdr-demo-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.vdr-demo-preview__canvas {
  padding: 20px;
}

.vdr-demo-preview__bar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid var(--vdr-demo-border);
  background: var(--vdr-demo-bg-soft);
}

.vdr-demo-preview__bar button {
  min-width: 88px;
  height: 32px;
  padding: 0 14px;
  border: 1px solid var(--vdr-demo-border);
  border-radius: 8px;
  background: var(--vdr-demo-bg);
  color: var(--vdr-demo-text-1);
  font-size: 12px;
  line-height: 1.2;
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    color 0.16s ease,
    background-color 0.16s ease;
}

.vdr-demo-preview__bar button:hover {
  border-color: var(--vdr-demo-brand);
  color: var(--vdr-demo-brand);
}

.vdr-demo-preview__source {
  border-top: 1px solid var(--vdr-demo-border);
  background: var(--vdr-demo-code-bg);
}

.vdr-demo-preview__source :deep(.shiki),
.vdr-demo-preview__source pre {
  overflow: auto;
  max-height: 520px;
  margin: 0;
  padding: 16px 20px 20px;
  background: transparent !important;
}

.vdr-demo-preview__source :deep(code),
.vdr-demo-preview__source code {
  color: var(--vdr-demo-code-text);
  font-size: 12px;
  line-height: 1.7;
  font-family: var(
    --vp-font-family-mono,
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Consolas,
    'Liberation Mono',
    monospace
  );
  white-space: pre;
  tab-size: 2;
}
</style>
