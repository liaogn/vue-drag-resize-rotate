---
layout: home

hero:
  name: vue-drag-resize-rotate
  text: 拖拽 · 缩放 · 旋转
  tagline: 简洁、零依赖的 Vue 3 组件，支持嵌套、锁比例、翻转
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/liaogn/vue-drag-resize-rotate

features:
  - icon: 🎯
    title: 拖拽 / 缩放 / 旋转
    details: 支持 8 触点缩放、单独旋转控件、锁定宽高比、翻转检测，覆盖编辑器场景常见交互
  - icon: 🪄
    title: 任意嵌套
    details: 通过 childrens 递归支持父子级嵌套，子组件操作自动跟随父级旋转坐标系
  - icon: 🎨
    title: CSS 变量主题
    details: 14 个 --vdr-* 变量驱动样式，外层覆写即可换肤，无需打补丁式 override class
  - icon: 📦
    title: 零运行时依赖
    details: 仅依赖 Vue 3，构建产物包含 ESM / UMD / .d.ts，开箱即用
---

<div class="home-demo">
  <div class="home-demo__title">即刻试一试 →</div>
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
