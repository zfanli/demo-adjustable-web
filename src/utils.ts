/******************************************************************************
 * Utils mainly for deal with panels' size and position.
 *
 * The process flow about position:
 *
 *  (For initial display)
 *  - Get size by window size
 *  - Packaging panels array
 *    - set largest panel flag for convert direction use
 *  - Get position information by panels array
 *    - change direction from column to row
 *    - calculate position by new direction
 *  - Store the result as `panels` and `order` to the state
 *  - Display panels by the `panels` field
 *
 *  (For resort - only in sortable mode)
 *  - Resort event ocurred
 *  - Use `order` field to get the `from` and `to` index
 *  - Get the new order
 *  - Get position information by new order
 *    - ...same process with initial display
 *  - Map sizes and positions from `order` to `panels`
 *  - Update new `panels` and `order` to the state
 *  - Refresh the view
 *
 *  (For window resize)
 *  - Resize event ocurred
 *  - Update size of container
 *  - Update sizes in `order`
 *  - Map sizes from `order` to `panels`
 *    - update to relative position if in un-sortable mode
 *    - update to absolute position if in sortable mode
 *  - Update new `panels` and `order` to the state
 *  - Refresh the view
 *
 *  (For position reset)
 *  - Reset event ocurred
 *  - Reset `order`'s positions
 *  - Map sizes from `order` to `panels`
 *  - Update new `panels` and `order` to the state
 *  - Refresh the view
 *
 *  (*) `panels`'s order is fixed
 *  (*) `order` is a mirror of `panels`, its order can be changed
 *  (*) when `order` is changed, map the changes to `panels` by keys
 *      for re-rendering
 *
 *****************************************************************************/

import { range } from 'lodash'
import { Size, SizeWithPosition, PanelWithPosition, ExtendSize } from './type'

/**
 * Get current panel size, calculate by current window size.
 * @param size
 * @param margin
 * @param large?
 */
function getCurrentPanelSize(size: Size, margin: number, large?: boolean) {
  const [maxWidth, maxHeight] = [
    Math.ceil(size.width / 3),
    Math.ceil(size.height / 2),
  ]

  return {
    // Max size is for entire container size (fiction container).
    maxWidth,
    maxHeight: large ? maxHeight * 2 : maxHeight,
    // Size for panel itself, without margins.
    width: maxWidth - margin,
    height: large ? maxHeight * 2 - margin : maxHeight - margin,
    largest: large,
  }
}

/**
 * Packaging panels' sizes.
 * @param windowSize
 * @param margin
 */
function packagePanels(
  windowSize: Size,
  margin: number,
  largestOne: number = 4
) {
  return range(5).map((_, i) => {
    // There is a largest one default at index 2.
    return getCurrentPanelSize(windowSize, margin, i === largestOne)
  })
}

/**
 * Convert the column direction to row direction by the index of largest one.
 *
 * There are 3 patterns exists, according to the position of largest one.
 * @param largest
 */
function convertToRowDirection(largest: number) {
  switch (largest) {
    case 0:
      // Pattern 1 :
      // [ 0, 1, 3
      //   0, 2, 4 ]
      return [0, 1, 3, 0, 2, 4]
    case 2:
      // Pattern 2 :
      // [ 0, 2, 3
      //   1, 2, 4 ]
      return [0, 2, 3, 1, 2, 4]
    case 4:
    default:
      // Pattern 3 :
      // [ 0, 2, 4
      //   1, 3, 4 ]
      return [0, 2, 4, 1, 3, 4]
  }
}

/**
 * Get position by order.
 *
 * This function does not need to know the order of each panel,
 * it just find the largest one, and determines the pattern,
 * then, gets its position.
 * @param order
 * @param margin
 * @param keys
 */
function getPositionsBySizes(
  order: ExtendSize[],
  margin: number,
  keys: string[] = []
) {
  let panels: SizeWithPosition[] = []

  const largestIndex = order.findIndex(p => p.largest)

  // Convert column direction to row direction.
  const pattern = convertToRowDirection(largestIndex)

  order.forEach((ps, i) => {
    // Map row direction to calculate positions.
    const index = pattern.findIndex(p => p === i)

    // Get panel col number.
    // For first row, index is [0, 1, 2]
    // for second row, index is [3, 4]
    const col = index > 2 ? index - 3 : index
    const row = index > 2 ? 1 : 0

    panels.push({
      ...ps,
      left: ps.maxWidth * col + margin,
      top: ps.maxHeight * row + margin,
    })
  })

  return panels.map((p, i) => ({
    key: keys[i],
    height: p.height,
    width: p.width,
    left: p.left,
    top: p.top,
    largest: p.largest,
  }))
}

/**
 * Create test information data.
 *
 * E.g. -> createInformationData('Test', 2)
 *
 * Get:
 *  - (Info 1): Test 1
 *  - (Info 2): Test 2
 * @param base
 * @param count
 */
function createInformationData(base: string, count: number) {
  let result: { [k: string]: string } = {}
  range(count).forEach((_, i) => {
    result[`(Info ${i + 1})`] = `${base} ${i + 1}`
  })
  return result
}

/**
 * Map positions from `order` to `panels`.
 * @param order
 * @param panels
 */
function mapToPanels(order: PanelWithPosition[], panels: PanelWithPosition[]) {
  // Reset `order` to be the same order with panels.
  const op = panels.map(p => {
    return order.find(o => o.key === p.key)
  }) as PanelWithPosition[]
  return panels.map((p, i) => {
    const thisOp = op[i]
    p.width = thisOp.width
    p.height = thisOp.height
    p.left = thisOp.left
    p.top = thisOp.top
    return p
  })
}

// ----------------------------------------------------------------------------
// --------------------------- EXPORT START -----------------------------------

/**
 * Get current positions.
 * @param windowSize
 * @param margin
 * @param keys
 */
export function getCurrentPositions(
  windowSize: Size,
  margin: number,
  keys: string[],
  largestIndex?: number
) {
  const panelSizes = packagePanels(windowSize, margin, largestIndex)
  return getPositionsBySizes(panelSizes, margin, keys)
}

/**
 * Handle position and size changes while window resize.
 * @param panels
 * @param order
 * @param windowSize
 * @param margin
 * @param sortable
 */
export function handleSizeChange(
  panels: PanelWithPosition[],
  order: PanelWithPosition[],
  windowSize: Size,
  lastSize: Size,
  margin: number,
  sortable: boolean
) {
  // Get new positions.
  const newPositions = packagePanels(
    windowSize,
    margin,
    order.findIndex(p => p.largest)
  )
  const heightRatio = windowSize.height / lastSize.height
  const widthRatio = windowSize.width / lastSize.width

  order.forEach((p, i) => {
    const thePosition = newPositions[i]
    p.width = thePosition.width
    p.height = thePosition.height
    p.top *= heightRatio
    p.left *= widthRatio
  })

  const newPanels = mapToPanels(order, panels)

  // Change relative position in un-sortable mode.
  if (!sortable) {
    newPanels.forEach((p, i) => {
      p.top = panels[i].top * heightRatio
      p.left = panels[i].left * widthRatio
    })
  }

  return [newPanels, order]
}

export function handleReset(
  panels: PanelWithPosition[],
  order: PanelWithPosition[],
  windowSize: Size,
  margin: number
) {
  // Get new positions.
  const newPositions = getCurrentPositions(
    windowSize,
    margin,
    [],
    order.findIndex(p => p.largest)
  )
  order.forEach((p, i) => {
    const thePosition = newPositions[i]
    p.width = thePosition.width
    p.height = thePosition.height
    p.top = thePosition.top
    p.left = thePosition.left
  })

  const newPanels = mapToPanels(order, panels)
  return [newPanels, order]
}

/**
 * Set cookie.
 * @param key
 * @param value
 */
export function setCookie(key: string, value: string) {
  document.cookie = `${key}=${value};`
}

/**
 * Get cookie.
 * @param key
 */
export function getCookie(key: string) {
  const cookies = document.cookie
  let coo: { [k: string]: string } = {}
  cookies.split(';').forEach(p => {
    if (p) {
      const pair = p.split('=')
      coo[pair[0].trim()] = pair[1].trim()
    }
  })
  return coo[key]
}

/**
 * Get fake data of user info.
 * @param lang
 * @param length
 */
export function getFakeDataOfUserInfo(lang: string, length: number) {
  let base: string
  if (lang === 'jp') {
    base = 'テストユーザー情報テストテスト'
  } else {
    base = 'Test User Information. Test Test.'
  }
  return createInformationData(base, length)
}

/**
 * Get fake data of reply info.
 * @param lang
 * @param length
 */
export function getFakeDataOfReplyInfo(lang: string, length: number) {
  let base: string
  if (lang === 'jp') {
    base = 'テスト応対情報テストテストテスト'
  } else {
    base = 'Test Reply Information. Test Test.'
  }
  return createInformationData(base, length)
}

// ---------------------------- EXPORT END ------------------------------------
// ----------------------------------------------------------------------------
