<template>
  <div class="page">
    <header class="topbar">
      <h1>vue-drag-resize-rotate · playground</h1>
      <p>核心交互场景与 docs 共享同一套 demo 源</p>
    </header>

    <main class="grid">
      <DemoPreview
        v-for="demo in demos"
        :key="demo.key"
        :title="demo.title"
        :description="demo.description"
        :component="demo.component"
        :source="demo.source"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { demos } from './demos/registry'
import DemoPreview from './demos/DemoPreview.vue'
</script>

<style>
@import './demos/demo.css';

* {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f6f7f9;
}

.page {
  min-height: 100vh;
}

.topbar {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #eaeaea;
}

.topbar h1 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.topbar p {
  margin: 6px 0 0;
  color: #888;
  font-size: 12px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));
  gap: 16px;
  padding: 16px;
}

@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
