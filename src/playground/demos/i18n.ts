import { inject, type InjectionKey, type Ref } from 'vue'

export type DemoLocale = 'zh' | 'en'

export const demoLocaleKey: InjectionKey<Ref<DemoLocale>> = Symbol('demoLocale')

export function useDemoLocale() {
  return inject(demoLocaleKey, undefined)
}

export function isEnglish(locale: DemoLocale) {
  return locale === 'en'
}
