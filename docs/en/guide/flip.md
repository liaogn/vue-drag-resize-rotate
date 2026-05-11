# Flip

When no minimum size limit is set, dragging a resize handle across the opposite edge flips the element. The component keeps the rectangle operable and emits the `fliped` event.

```vue
<template>
  <vdr :w="160" :h="120" @fliped="onFlip">
    <div>flip me</div>
  </vdr>
</template>

<script setup lang="ts">
function onFlip(pos) {
  console.log(pos.flipSign, pos.r)
}
</script>
```

## `fliped`

`fliped` receives the same `(pos, event)` arguments as the other events. `pos.flipSign` describes the last flip direction:

```ts
type FlipSign = '' | '+' | '-'
```

## Disable Flip

Set minimum dimensions when your product should not allow flipping:

```vue
<vdr :min-width="40" :min-height="40" />
```

See [Flip](/en/examples/flip) for an interactive example.
