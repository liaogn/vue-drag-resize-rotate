---
layout: page
sidebar: false
aside: false
editLink: false
lastUpdated: false
---

<section class="home-hero">
  <div class="home-hero__inner">
    <div class="home-hero__copy">
      <h1>vue-drag-resize-rotate</h1>
      <p class="home-hero__tagline">简洁、零依赖的 Vue 3 拖拽 / 缩放 / 旋转组件。</p>
      <div class="home-hero__actions">
        <a class="home-button home-button--brand" href="/vue-drag-resize-rotate/guide/getting-started">快速开始</a>
        <a class="home-button" href="https://github.com/liaogn/vue-drag-resize-rotate">GitHub</a>
      </div>
    </div>
    <ClientOnly>
      <div class="home-demo-board">
        <vdr class="home-demo home-demo--basic" overflow="hidden" :w="320" :h="200" :x="30" :y="200" :r="-5">
          <div class="home-demo__card home-demo__card--basic"></div>
            <vdr overflow="hidden" class="home-demo home-demo--basic" :w="80" :h="80" :x="120" :y="60" :r="30">
              <div class="home-demo__card home-demo__card--nested">nesting</div>
           </vdr>
        </vdr>
      </div>
    </ClientOnly>
  </div>
</section>

<section class="home-info">
  <div class="home-info__header">
    <h2>把编辑器常见的矩形操作封装成一个 Vue 组件。</h2>
  </div>

  <div class="home-info__grid">
    <article>
      <span>01</span>
      <h3>拖拽 / 缩放 / 旋转</h3>
      <p>内置 8 个缩放触点和独立旋转控制，事件回传完整位置、尺寸和角度。</p>
    </article>
    <article>
      <span>02</span>
      <h3>嵌套坐标系</h3>
      <p>通过 childrens 递归渲染子元素，父级旋转后子级操作仍能保持正确坐标。</p>
    </article>
    <article>
      <span>03</span>
      <h3>尺寸限制与锁比例</h3>
      <p>支持 min/max、锁定宽高比和翻转检测，适合画布类产品的边界约束。</p>
    </article>
    <article>
      <span>04</span>
      <h3>零运行时依赖</h3>
      <p>仅依赖 Vue 3，提供 ESM / UMD / 类型声明，主题样式由 CSS 变量驱动。</p>
    </article>
  </div>
</section>

<style>
.VPContent {
  padding-top: var(--vp-nav-height) !important;
}

.VPDoc {
  padding: 0 !important;
}

.VPDoc .container,
.VPDoc .content,
.VPDoc .content-container {
  max-width: none !important;
  padding: 0 !important;
}

.home-hero {
  min-height: calc(100vh - var(--vp-nav-height));
  overflow: hidden;
  background:
    linear-gradient(to right, color-mix(in srgb, var(--vp-c-divider) 70%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--vp-c-divider) 70%, transparent) 1px, transparent 1px),
    radial-gradient(circle at 78% 24%, rgba(45, 183, 245, 0.16), transparent 30%),
    radial-gradient(circle at 18% 82%, rgba(82, 196, 26, 0.09), transparent 32%),
    linear-gradient(180deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 78%);
  background-size: 32px 32px, 32px 32px, auto, auto, auto;
}

.home-hero__inner {
  display: flex;
  gap: 56px;
  width: min(1120px, calc(100% - 48px));
  min-height: calc(100vh - var(--vp-nav-height));
  margin: 0 auto;
  align-items: center;
}

.home-hero__copy {
  position: relative;
  z-index: 2;
  padding-bottom: 48px;
}

.home-hero h1 {
  max-width: 520px;
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: clamp(48px, 6vw, 82px);
  line-height: 1;
  font-weight: 850;
}

.home-hero__tagline {
  max-width: 460px;
  margin: 22px 0 0;
  color: var(--vp-c-text-2);
  font-size: clamp(18px, 2vw, 23px);
  line-height: 1.55;
}

.home-hero__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.home-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 18px;
  border-radius: 7px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  color: var(--vp-c-text-1);
  font-weight: 700;
  text-decoration: none !important;
}

.home-button--brand {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: #fff;
}

.home-demo-board {
  position: relative;
  height: 640px;
  min-width: 0;
}

.home-demo-board::before {
  content: '';
  position: absolute;
  inset: 48px -110px 20px 40px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(45, 183, 245, 0.14), transparent 68%);
  pointer-events: none;
}

.home-demo__card {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.4;
  text-align: center;
  user-select: none;
  box-shadow: 0 18px 42px rgba(45, 102, 213, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.home-demo__card--basic {
  background: linear-gradient(135deg, #2db7f5 0%, #5b8def 48%, #722ed1 100%);
}

.home-demo__card--nested {
  background: linear-gradient(135deg, #1f2937 0%, #2563eb 100%);
}

.home-demo-board .home-demo--nested .vdr {
  background: linear-gradient(135deg, #f97316 0%, #facc15 100%);
  box-shadow: 0 12px 28px rgba(249, 115, 22, 0.22);
}

.home-info {
  width: min(1120px, calc(100% - 48px));
  min-height: calc(100vh - var(--vp-nav-height));
  margin: 0 auto;
  padding: 80px 0 96px;
}

.home-info__header {
  max-width: 760px;
}

.home-info__header p {
  margin: 0 0 10px;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 800;
}

.home-info__header h2 {
  margin: 0;
  border: 0;
  padding: 0;
  color: var(--vp-c-text-1);
  font-size: clamp(30px, 4vw, 52px);
  line-height: 1.12;
  font-weight: 850;
}

.home-info__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 48px;
}

.home-info__grid article {
  min-height: 188px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.home-info__grid span,
.home-quickstart span {
  display: block;
  margin-bottom: 10px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 800;
}

.home-info__grid h3 {
  margin: 0 0 10px;
  color: var(--vp-c-text-1);
  font-size: 18px;
  font-weight: 800;
}

.home-info__grid p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.75;
}

.home-quickstart {
  display: grid;
  grid-template-columns: minmax(0, 0.78fr) minmax(0, 1.22fr);
  gap: 16px;
  margin-top: 28px;
}

.home-quickstart > div {
  min-width: 0;
}

.home-quickstart span {
  color: var(--vp-c-text-2);
}

.home-code {
  min-height: 72px;
  padding: 14px;
  overflow: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.65;
  white-space: nowrap;
}

.home-code--multi {
  min-height: 118px;
}

@media (max-width: 960px) {
  .home-hero {
    min-height: 980px;
  }

  .home-hero__inner {
    display: block;
    min-height: 980px;
    padding-top: 64px;
  }

  .home-demo-board {
    height: 560px;
    margin-top: 36px;
  }

  .home-demo-board .home-demo:nth-child(1) {
    transform: translate3d(20px, 20px, 0) rotateZ(-5deg) !important;
  }

  .home-demo-board .home-demo:nth-child(2) {
    transform: translate3d(230px, 260px, 0) rotateZ(6deg) !important;
  }

  .home-info__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .home-hero {
    min-height: 900px;
  }

  .home-hero__inner,
  .home-info {
    width: min(100% - 32px, 1120px);
  }

  .home-hero__inner {
    min-height: 900px;
    padding-top: 48px;
  }

  .home-demo-board {
    height: 520px;
    margin-top: 28px;
  }

  .home-demo-board .home-demo:nth-child(1) {
    transform: translate3d(2px, 16px, 0) rotateZ(-5deg) !important;
  }

  .home-demo-board .home-demo:nth-child(2) {
    transform: translate3d(28px, 260px, 0) rotateZ(6deg) !important;
  }

  .home-info {
    padding-top: 56px;
  }

  .home-info__grid,
  .home-quickstart {
    grid-template-columns: 1fr;
  }
}
</style>
