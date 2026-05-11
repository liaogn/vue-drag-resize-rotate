# Slots

The component provides a **default slot** for content. Slot content fills the rectangle and transforms together with the component's size, position, and rotation.

## Basic Usage

```vue
<vdr :w="200" :h="200">
  <div>I am the slot content</div>
</vdr>
```

## Images

```vue
<vdr :w="300" :h="200">
  <img src="/cat.jpg" style="width:100%;height:100%;object-fit:cover" />
</vdr>
```

You can also use the `bg` prop when you only need a background image:

```vue
<vdr :w="300" :h="200" bg="/cat.jpg" />
```

## Nesting Another `vdr`

Place another `<vdr>` in the slot for manual nesting without using `childrens`:

```vue
<vdr :w="320" :h="220" :x="30" :y="30">
  <vdr :w="140" :h="100" :x="40" :y="40">
    <div>child via slot</div>
  </vdr>
</vdr>
```

Use [`childrens`](./nesting) when your data is recursive, such as a tree schema or JSON config. Use slot nesting when each level is written directly in the template.
