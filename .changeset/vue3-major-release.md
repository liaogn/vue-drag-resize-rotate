---
"@liaogn/vue-drag-resize-rotate": major
---

Release the Vue 3 version of `@liaogn/vue-drag-resize-rotate`.

This is a major upgrade from the previous Vue 2 implementation. Vue 2 users should continue using the `1.x` releases; the legacy Vue 2 code has been archived in the `legacy/` directory for reference.

Breaking changes:

- Require Vue 3 via the `vue@^3.3.0` peer dependency and support Vue 3 plugin installation with `createApp().use()`.
- Replace the old Vue 2 build pipeline with Vite, TypeScript, ESM/CJS outputs, generated type declarations, and explicit package exports.
- Require consumers to import the package stylesheet explicitly with `@liaogn/vue-drag-resize-rotate/style.css`.
- Replace the Vue 2 cursor extension hooks based on `Vue.prototype`, mixins, or `extends` with the `stick-hover-render` prop.
- Move visual customization to CSS variables instead of relying on overriding internal class styles directly.

Additional updates:

- Refactor geometry, drag, resize, rotate, flip, cursor, and DOM helpers into a framework-independent `core/` layer.
- Add TypeScript definitions for component props, events, helpers, and plugin exports.
- Add bilingual VitePress documentation, interactive examples, and migration guidance for the Vue 3 release.
