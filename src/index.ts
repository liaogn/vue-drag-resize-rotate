import type { App, Plugin } from 'vue'
import VueDragResizeRotate from './vdr/index.vue'

type SFCWithInstall<T> = T & Plugin

const installable = VueDragResizeRotate as SFCWithInstall<typeof VueDragResizeRotate>

installable.install = (app: App) => {
  app.component(installable.name ?? 'vdr', installable)
}

export { installable as VueDragResizeRotate }
export * from './core'
export default installable
