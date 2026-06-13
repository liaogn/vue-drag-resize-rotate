import { expect, test, type Locator } from '@playwright/test'

// The playground renders every demo as a card at "/" (no per-demo routing).
// Each demo is keyed in registry.ts; the scale demo (key "scale", DemoScale.vue)
// renders a `.vdr-demo-scale-stage` containing a `.vdr-demo-scale-canvas` that is
// CSS-transformed with `transform: scale(0.6)` and a vdr with `:scale="0.6"`.
// We locate the demo by its stage class and read local geometry from the demo
// readouts, which mirror the component's reactive rect state.

const SCALE = 0.6

interface Point {
  x: number
  y: number
}

interface RectState extends Point {
  w: number
  h: number
}

function pointerInit(point: Point, pointerId: number, buttons: number) {
  return {
    bubbles: true,
    cancelable: true,
    composed: true,
    pointerId,
    pointerType: 'touch',
    isPrimary: true,
    clientX: point.x,
    clientY: point.y,
    pageX: point.x,
    pageY: point.y,
    screenX: point.x,
    screenY: point.y,
    button: 0,
    buttons,
    width: 20,
    height: 20,
    pressure: buttons ? 0.5 : 0,
  }
}

async function centerOf(locator: Locator): Promise<Point> {
  const box = await locator.boundingBox()
  if (!box) throw new Error('Missing bounding box')
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  }
}

// Synthetic pointer drag, mirroring tests/mobile.spec.ts: dispatch on the target
// (events bubble to the documentElement listeners vdr attaches for move/up).
async function dragPointer(
  target: Locator,
  start: Point,
  end: Point,
  pointerId: number
) {
  await target.dispatchEvent('pointerdown', pointerInit(start, pointerId, 1))
  await target.dispatchEvent(
    'pointermove',
    pointerInit(
      {
        x: start.x + (end.x - start.x) / 2,
        y: start.y + (end.y - start.y) / 2,
      },
      pointerId,
      1
    )
  )
  await target.dispatchEvent('pointermove', pointerInit(end, pointerId, 1))
  await target.dispatchEvent('pointerup', pointerInit(end, pointerId, 0))
}

async function readRectState(readout: Locator): Promise<RectState> {
  const attr = async (name: keyof RectState) => {
    const value = await readout.getAttribute(`data-${name}`)
    if (value === null) throw new Error(`Missing data-${name}`)
    return Number(value)
  }

  return {
    x: await attr('x'),
    y: await attr('y'),
    w: await attr('w'),
    h: await attr('h'),
  }
}

function closestVdr(card: Locator): Locator {
  return card.locator(
    'xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " vdr ")][1]'
  )
}

function expectDelta(actual: number, before: number, expectedDelta: number, tolerance = 4) {
  expect(Math.abs(actual - before - expectedDelta)).toBeLessThanOrEqual(tolerance)
}

test('dragging inside a transform:scale(0.6) canvas moves the element by screen distance / scale', async ({
  page,
}) => {
  await page.goto('/')

  const demo = page.locator('.vdr-demo-scale-stage')
  // The card text "drag me" is shared with the snap demo, so scope to this stage.
  const card = demo.locator('.vdr-demo-card--success')
  const readout = demo.getByTestId('scale-readout')
  await demo.scrollIntoViewIfNeeded()
  await expect(card).toBeVisible()

  const initial = await readRectState(readout)

  // Known SCREEN displacement applied on the (visually scaled) vdr body.
  const SCREEN_DX = 30
  const SCREEN_DY = 24
  const start = await centerOf(card)
  await dragPointer(
    card,
    start,
    { x: start.x + SCREEN_DX, y: start.y + SCREEN_DY },
    51
  )

  // Core correctness property: with scale-aware coordinates, a screen drag of D px
  // moves the element D / scale local px.
  const expectedDx = SCREEN_DX / SCALE // 50
  const expectedDy = SCREEN_DY / SCALE // 40

  await expect
    .poll(async () => (await readRectState(readout)).x - initial.x)
    .toBeGreaterThan(expectedDx - 6)

  const after = await readRectState(readout)
  expectDelta(after.x, initial.x, expectedDx)
  expectDelta(after.y, initial.y, expectedDy)
})

test('resizing with br inside a transform:scale(0.6) canvas grows by screen distance / scale', async ({
  page,
}) => {
  await page.goto('/')

  const demo = page.locator('.vdr-demo-scale-stage')
  const card = demo.locator('.vdr-demo-card--success')
  const readout = demo.getByTestId('scale-readout')
  await demo.scrollIntoViewIfNeeded()
  await expect(card).toBeVisible()

  const initial = await readRectState(readout)
  const handle = closestVdr(card).locator('.vdr-stick-br')

  const SCREEN_DX = 24
  const SCREEN_DY = 18
  const start = await centerOf(handle)
  await dragPointer(
    handle,
    start,
    { x: start.x + SCREEN_DX, y: start.y + SCREEN_DY },
    52
  )

  const expectedDw = SCREEN_DX / SCALE // 40
  const expectedDh = SCREEN_DY / SCALE // 30

  await expect
    .poll(async () => (await readRectState(readout)).w - initial.w)
    .toBeGreaterThan(expectedDw - 6)

  const after = await readRectState(readout)
  expectDelta(after.w, initial.w, expectedDw)
  expectDelta(after.h, initial.h, expectedDh)
})

test('nested child br resize uses scaled geometry from parentInfo', async ({ page }) => {
  await page.goto('/')

  const demo = page.locator('.vdr-demo-scale-stage')
  const childCard = demo.locator('.vdr-demo-card--nested')
  const readout = demo.getByTestId('scale-child-readout')
  await demo.scrollIntoViewIfNeeded()
  await expect(childCard).toBeVisible()

  const initial = await readRectState(readout)
  const handle = closestVdr(childCard).locator('.vdr-stick-br')

  const SCREEN_DX = 18
  const SCREEN_DY = 15
  const start = await centerOf(handle)
  await dragPointer(
    handle,
    start,
    { x: start.x + SCREEN_DX, y: start.y + SCREEN_DY },
    53
  )

  const expectedDw = SCREEN_DX / SCALE // 30
  const expectedDh = SCREEN_DY / SCALE // 25

  await expect
    .poll(async () => (await readRectState(readout)).w - initial.w)
    .toBeGreaterThan(expectedDw - 6)

  const after = await readRectState(readout)
  expectDelta(after.w, initial.w, expectedDw)
  expectDelta(after.h, initial.h, expectedDh)
})
