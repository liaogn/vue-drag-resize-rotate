import { expect, test, type Locator, type Page } from '@playwright/test'

interface Point {
  x: number
  y: number
}

interface MobileState {
  x: number
  y: number
  w: number
  h: number
  r: number
  lx0: number
  lx1: number
  ly0: number
  ly1: number
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

async function readState(page: Page): Promise<MobileState> {
  const readout = page.getByTestId('mobile-readout')
  const attr = async (name: keyof MobileState) => {
    const value = await readout.getAttribute(`data-${name}`)
    return Number(value)
  }

  return {
    x: await attr('x'),
    y: await attr('y'),
    w: await attr('w'),
    h: await attr('h'),
    r: await attr('r'),
    lx0: await attr('lx0'),
    lx1: await attr('lx1'),
    ly0: await attr('ly0'),
    ly1: await attr('ly1'),
  }
}

async function dragPointer(
  page: Page,
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

function rotatedPoint(point: Point, origin: Point, rotate: number): Point {
  const x = point.x - origin.x
  const y = point.y - origin.y
  const rad = (rotate * Math.PI) / 180
  return {
    x: x * Math.cos(rad) + y * Math.sin(rad) + origin.x,
    y: y * Math.cos(rad) - x * Math.sin(rad) + origin.y,
  }
}

function expectInsideLimits(state: MobileState) {
  const cx = state.x + state.w / 2
  const cy = state.y + state.h / 2
  const points = [
    { x: state.x, y: state.y },
    { x: state.x + state.w, y: state.y },
    { x: state.x + state.w, y: state.y + state.h },
    { x: state.x, y: state.y + state.h },
  ].map((point) => rotatedPoint(point, { x: cx, y: cy }, -state.r))

  expect(Math.min(...points.map((point) => point.x))).toBeGreaterThanOrEqual(state.lx0 - 2)
  expect(Math.max(...points.map((point) => point.x))).toBeLessThanOrEqual(state.lx1 + 2)
  expect(Math.min(...points.map((point) => point.y))).toBeGreaterThanOrEqual(state.ly0 - 2)
  expect(Math.max(...points.map((point) => point.y))).toBeLessThanOrEqual(state.ly1 + 2)
}

test('mobile demo supports single-pointer drag, resize, rotate, and cancel recovery', async ({
  page,
}) => {
  await page.goto('/')

  const demo = page.getByTestId('mobile-demo')
  const card = demo.getByTestId('mobile-card')
  const resizeHandle = demo.locator('.vdr-stick-br')
  const rotateHandle = demo.locator('.vdr-angle')
  await demo.scrollIntoViewIfNeeded()
  await expect(card).toBeVisible()

  const initial = await readState(page)
  const dragStart = await centerOf(card)
  await dragPointer(
    page,
    card,
    dragStart,
    { x: dragStart.x + 36, y: dragStart.y - 24 },
    11
  )
  await expect.poll(async () => (await readState(page)).x).toBeGreaterThan(initial.x + 20)
  const afterDrag = await readState(page)
  expect(afterDrag.y).toBeLessThan(initial.y - 10)
  expectInsideLimits(afterDrag)

  const resizeStart = await centerOf(resizeHandle)
  await dragPointer(
    page,
    resizeHandle,
    resizeStart,
    { x: resizeStart.x + 42, y: resizeStart.y + 36 },
    12
  )
  await expect.poll(async () => (await readState(page)).w).toBeGreaterThan(afterDrag.w + 20)
  const afterResize = await readState(page)
  expect(afterResize.h).toBeGreaterThan(afterDrag.h + 12)
  expectInsideLimits(afterResize)

  const rotateStart = await centerOf(rotateHandle)
  await dragPointer(
    page,
    rotateHandle,
    rotateStart,
    { x: rotateStart.x + 60, y: rotateStart.y + 42 },
    13
  )
  await expect
    .poll(async () => Math.abs((await readState(page)).r - afterResize.r))
    .toBeGreaterThan(5)

  const cancelStart = await centerOf(card)
  await card.dispatchEvent('pointerdown', pointerInit(cancelStart, 14, 1))
  await page
    .locator('html')
    .dispatchEvent(
      'pointermove',
      pointerInit({ x: cancelStart.x + 20, y: cancelStart.y + 12 }, 14, 1)
    )
  await card.dispatchEvent(
    'pointercancel',
    pointerInit({ x: cancelStart.x + 20, y: cancelStart.y + 12 }, 14, 0)
  )

  const afterCancel = await readState(page)
  const recoveryStart = await centerOf(card)
  await dragPointer(
    page,
    card,
    recoveryStart,
    { x: recoveryStart.x - 28, y: recoveryStart.y },
    15
  )
  await expect.poll(async () => (await readState(page)).x).toBeLessThan(afterCancel.x - 15)
})

test('pointercancel rolls back position to pre-interaction state', async ({ page }) => {
  await page.goto('/')

  const demo = page.getByTestId('mobile-demo')
  const card = demo.getByTestId('mobile-card')
  await demo.scrollIntoViewIfNeeded()
  await expect(card).toBeVisible()

  const before = await readState(page)
  const start = await centerOf(card)

  await card.dispatchEvent('pointerdown', pointerInit(start, 20, 1))
  await page
    .locator('html')
    .dispatchEvent(
      'pointermove',
      pointerInit({ x: start.x + 50, y: start.y + 40 }, 20, 1)
    )

  await card.dispatchEvent(
    'pointercancel',
    pointerInit({ x: start.x + 50, y: start.y + 40 }, 20, 0)
  )

  const after = await readState(page)
  expect(after.x).toBeCloseTo(before.x, 0)
  expect(after.y).toBeCloseTo(before.y, 0)
  expect(after.w).toBeCloseTo(before.w, 0)
  expect(after.h).toBeCloseTo(before.h, 0)
})

test('second pointer is ignored during active interaction', async ({ page }) => {
  await page.goto('/')

  const demo = page.getByTestId('mobile-demo')
  const card = demo.getByTestId('mobile-card')
  await demo.scrollIntoViewIfNeeded()
  await expect(card).toBeVisible()

  const start = await centerOf(card)

  // First pointer starts drag
  await card.dispatchEvent('pointerdown', pointerInit(start, 30, 1))
  await page
    .locator('html')
    .dispatchEvent(
      'pointermove',
      pointerInit({ x: start.x + 30, y: start.y }, 30, 1)
    )

  const duringFirst = await readState(page)

  // Second pointer tries to start — should be ignored
  await card.dispatchEvent(
    'pointerdown',
    {
      ...pointerInit({ x: start.x, y: start.y + 50 }, 31, 1),
      isPrimary: false,
    }
  )
  await page
    .locator('html')
    .dispatchEvent(
      'pointermove',
      {
        ...pointerInit({ x: start.x, y: start.y + 100 }, 31, 1),
        isPrimary: false,
      }
    )

  const afterSecond = await readState(page)
  expect(afterSecond.x).toBeCloseTo(duringFirst.x, 0)
  expect(afterSecond.y).toBeCloseTo(duringFirst.y, 0)

  // Clean up first pointer
  await page
    .locator('html')
    .dispatchEvent('pointerup', pointerInit({ x: start.x + 30, y: start.y }, 30, 0))
})

test('resize cancel rolls back dimensions', async ({ page }) => {
  await page.goto('/')

  const demo = page.getByTestId('mobile-demo')
  const card = demo.getByTestId('mobile-card')
  const resizeHandle = demo.locator('.vdr-stick-br')
  await demo.scrollIntoViewIfNeeded()
  await expect(card).toBeVisible()

  // Activate the element first
  const cardCenter = await centerOf(card)
  await dragPointer(page, card, cardCenter, { x: cardCenter.x + 1, y: cardCenter.y }, 40)

  const before = await readState(page)
  const resizeStart = await centerOf(resizeHandle)

  await resizeHandle.dispatchEvent('pointerdown', pointerInit(resizeStart, 41, 1))
  await page
    .locator('html')
    .dispatchEvent(
      'pointermove',
      pointerInit({ x: resizeStart.x + 40, y: resizeStart.y + 30 }, 41, 1)
    )

  // Verify resize happened
  const duringResize = await readState(page)
  expect(duringResize.w).toBeGreaterThan(before.w)

  // Cancel should roll back
  await resizeHandle.dispatchEvent(
    'pointercancel',
    pointerInit({ x: resizeStart.x + 40, y: resizeStart.y + 30 }, 41, 0)
  )

  const after = await readState(page)
  expect(after.w).toBeCloseTo(before.w, 0)
  expect(after.h).toBeCloseTo(before.h, 0)
})
