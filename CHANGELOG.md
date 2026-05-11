# Changelog

## 2.0.0

### Major Changes

- 943c129: Release the Vue 3 version of `@liaogn/vue-drag-resize-rotate`.

  This is a major upgrade from the previous Vue 2 implementation. Vue 2 users should continue using the `1.x` releases. The final Vue 2 release is `v1.2.0`, and the Vue 2 source is available from the `v2` branch; the legacy implementation is also kept in the `legacy/` directory for reference.

  Breaking changes:

  - Require Vue 3 via the `vue@^3.3.0` peer dependency and support Vue 3 plugin installation with `createApp().use()`.
  - Replace the old Vue 2 build pipeline with Vite, TypeScript, ESM/CJS outputs, generated type declarations, and explicit package exports.
  - Require consumers to import the package stylesheet explicitly with `@liaogn/vue-drag-resize-rotate/style.css`.
  - Replace the Vue 2 cursor extension hooks based on `Vue.prototype`, mixins, or `extends` with the `stick-hover-render` prop.
  - Move visual customization to CSS variables instead of relying on overriding internal class styles directly.

  Additional updates:

  - Refactor the geometry, drag, resize, rotate, flip, cursor, and DOM helpers into a framework-independent `core/` layer.
  - Add TypeScript support and generated type definitions for component props, events, helpers, and plugin exports.
  - Fix abnormal dragging when slot content has its own rotation angle.
  - Fix the z-index layering between resize/rotate handles and rectangle border lines.
  - Add `limit-x` / `limit-y` position limits for constraining drag, resize, and rotate within a parent coordinate range.
  - Add `min-width` / `min-height` / `max-width` / `max-height` size limits for resize interactions.
  - Rebuild the documentation and examples with bilingual VitePress guides and interactive demos.

## 1.2.0 and earlier

The `1.x` releases are based on Vue 2. The final Vue 2 release is [`v1.2.0`](https://github.com/liaogn/vue-drag-resize-rotate/releases/tag/v1.2.0), and the Vue 2 source is available from the [`v2` branch](https://github.com/liaogn/vue-drag-resize-rotate/tree/v2).
