---
layout: home

hero:
  name: vue-drag-resize-rotate
  text: Drag · Resize · Rotate
  tagline: A simple, zero-dependency Vue 3 component with nesting, aspect-lock, and flipping support
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/getting-started
    - theme: alt
      text: Examples
      link: /en/examples/basic
    - theme: alt
      text: View on GitHub
      link: https://github.com/liaogn/vue-drag-resize-rotate

features:
  - icon: 🎯
    title: Drag / Resize / Rotate
    details: 8-stick resize, dedicated rotation handle, aspect-lock, flip detection — all the editor essentials
  - icon: 🪄
    title: Recursive nesting
    details: Use childrens to nest instances; child operations follow parent's rotated coordinate system automatically
  - icon: 🎨
    title: Themed via CSS variables
    details: 14 --vdr-* variables drive every visual; override at the consumer side — no class hacks needed
  - icon: 📦
    title: Zero runtime deps
    details: Only Vue 3 as peer dep. Ships ESM / UMD / .d.ts out of the box
---

<div class="home-demo">
  <div class="home-demo__title">Try it →</div>
  <ClientOnly>
    <div class="home-demo__stage">
      <vdr :w="220" :h="140" :x="120" :y="60" :r="-6">
        <div class="home-demo__card">drag · resize · rotate</div>
      </vdr>
    </div>
  </ClientOnly>
</div>

<style>
.home-demo {
  max-width: 960px;
  margin: 64px auto 96px;
  padding: 0 24px;
}
.home-demo__title {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
  letter-spacing: 0.02em;
}
.home-demo__stage {
  position: relative;
  height: 360px;
  border-radius: 12px;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 0%, rgba(45, 183, 245, 0.12), transparent 50%),
    radial-gradient(circle at 80% 100%, rgba(114, 46, 209, 0.10), transparent 55%),
    linear-gradient(180deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 100%);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.home-demo__stage::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, var(--vp-c-divider) 1px, transparent 1px),
    linear-gradient(to bottom, var(--vp-c-divider) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.35;
  pointer-events: none;
}
.home-demo__card {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #fff;
  user-select: none;
  background: linear-gradient(135deg, #2db7f5 0%, #5b8def 50%, #722ed1 100%);
  border-radius: 8px;
  box-shadow:
    0 12px 28px rgba(45, 102, 213, 0.28),
    0 4px 8px rgba(45, 102, 213, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
</style>
