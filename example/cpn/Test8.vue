<template>
  <div class="drawWrap drawWrap_test8">
    <wrapDesc title="min/max尺寸限制" :showData="showData" />
    <vdr
      v-for="rect in rects"
      v-bind="rect"
      :key="rect.uuid"
      @activated="updateShowData"
      @fliped="updateShowData"

      @dragStart="updateShowData"
      @dragging="updateShowData"
      @dragStop="updateShowData"

      @rotateStart="updateShowData"
      @rotating="updateShowData"
      @rotateStop="updateShowData"

      @resizeStart="updateShowData"
      @resizing="updateShowData"
      @resizeStop="updateShowData"
    >
      <p>{{ rect.label }}</p>
    </vdr>
    <div class="codeBox">
      <highlightjs class="myHljs" language="html" :code="codeHTML" />
      <highlightjs class="myHljs" language="javascript" :code="codeJS" />
    </div>
  </div>
</template>

<script>
import testImage from '../img/test_1.jpg';

let codeHTML = `
<vdr
  v-for="rect in rects"
  v-bind="rect"
  :key="rect.uuid"
  @resizing="updateShowData"
  @resizeStop="updateShowData"
/>
`

let codeJS = `
data() {
  return {
    rects: [
      {
        uuid: 'min_max_base',
        w: 180,
        h: 150,
        minWidth: 80,
        minHeight: 80,
        maxWidth: 260,
        maxHeight: 220,
        x: 250,
        y: 120,
        r: 0,
        lock: false,
        active: true,
      },
      {
        uuid: 'min_max_rotate',
        w: 170,
        h: 140,
        minWidth: 70,
        minHeight: 70,
        maxWidth: 250,
        maxHeight: 210,
        x: 470px,
        y: 220,
        r: 30,
        lock: false,
        active: true,
      },
      {
        uuid: 'min_max_lock',
        w: 140,
        h: 100,
        minWidth: 70,
        minHeight: 70,
        maxWidth: 230,
        maxHeight: 180,
        x: 650,
        y: 120,
        r: -20,
        lock: true,
        active: true,
      },
      {
        uuid: 'min_max_nested',
        w: 220,
        h: 180,
        minWidth: 110,
        minHeight: 90,
        maxWidth: 300,
        maxHeight: 240,
        x: 290,
        y: 430,
        r: 15,
        lock: false,
        active: true,
        childrens: [
          {
            uuid: 'min_max_nested_child',
            w: 90,
            h: 80,
            minWidth: 40,
            minHeight: 40,
            maxWidth: 130,
            maxHeight: 120,
            x: 60,
            y: 48,
            r: -25,
            lock: false,
            active: true,
          },
        ],
      },
    ],
  }
}
`

export default {
  name: 'test_8',
  data() {
    return {
      rects: [
        {
          uuid: 'min_max_base',
          label: 'min/max',
          w: 180,
          h: 150,
          minWidth: 80,
          minHeight: 80,
          maxWidth: 260,
          maxHeight: 220,
          x: 250,
          y: 120,
          r: 0,
          z: 99,
          lock: false,
          active: true,
          bg: testImage,
        },
        {
          uuid: 'min_max_rotate',
          label: 'rotate',
          w: 170,
          h: 140,
          minWidth: 70,
          minHeight: 70,
          maxWidth: 250,
          maxHeight: 210,
          x: 470,
          y: 220,
          r: 30,
          z: 99,
          lock: false,
          active: true,
          bg: testImage,
        },
        {
          uuid: 'min_max_lock',
          label: 'lock',
          w: 140,
          h: 100,
          minWidth: 70,
          minHeight: 70,
          maxWidth: 230,
          maxHeight: 180,
          x: 650,
          y: 120,
          r: -20,
          z: 99,
          lock: true,
          active: true,
          bg: testImage,
        },
        {
          uuid: 'min_max_nested',
          label: 'nested',
          w: 220,
          h: 180,
          minWidth: 110,
          minHeight: 90,
          maxWidth: 300,
          maxHeight: 240,
          x: 290,
          y: 430,
          r: 15,
          z: 99,
          lock: false,
          active: true,
          bg: testImage,
          childrens: [
            {
              uuid: 'min_max_nested_child',
              w: 90,
              h: 80,
              minWidth: 40,
              minHeight: 40,
              maxWidth: 130,
              maxHeight: 120,
              x: 60,
              y: 48,
              r: -25,
              z: 100,
              lock: false,
              active: true,
              bg: testImage,
            },
          ],
        },
      ],
      showData: {},
      codeHTML: codeHTML,
      codeJS: codeJS,
    }
  },
  created() {
    this.showData = this.rects[0]
  },
  methods: {
    updateShowData(res) {
      this.showData = res
    },
  },
}
</script>

<style>
.drawWrap_test8 {
  height: 1250px !important;
}
.drawWrap_test8 .vdr {
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.drawWrap_test8 .vdr p {
  padding: 4px 8px;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  background: rgba(0, 0, 0, 0.45);
}
.drawWrap_test8 .codeBox {
  height: 430px;
  bottom: 40px;
}
</style>
