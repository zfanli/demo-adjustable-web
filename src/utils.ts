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

import { range, cloneDeep, debounce } from 'lodash'
import { Size, SizeWithPosition, PanelWithPosition, ExtendSize } from './type'
import { handleResortAction } from './actions'

/**
 * Get current panel size, calculate by current window size.
 * @param size
 * @param margin
 * @param large?
 */
export function getCurrentPanelSize(
  size: Size,
  margin: number,
  large?: boolean
) {
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
    largest: !!large,
  }
}

/**
 * Packaging panels' sizes.
 * @param windowSize
 * @param margin
 */
export function packagePanels(
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
export function convertToRowDirection(largest: number) {
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
 * @param panelSizes
 * @param margin
 * @param keys
 */
export function getPositionsBySizes(
  panelSizes: ExtendSize[],
  margin: number,
  keys: string[] = []
) {
  const tempOrder = panelSizes
  let tempPanels: SizeWithPosition[] = []

  const largestIndex = tempOrder.findIndex(p => p.largest)

  // Convert column direction to row direction.
  const pattern = convertToRowDirection(largestIndex)

  tempOrder.forEach((ps, i) => {
    // Map row direction to calculate positions.
    const index = pattern.findIndex(p => p === i)

    // Get panel col number.
    // For first row, index is [0, 1, 2]
    // for second row, index is [3, 4]
    const col = index > 2 ? index - 3 : index
    const row = index > 2 ? 1 : 0

    tempPanels.push({
      ...ps,
      left: ps.maxWidth * col + margin,
      top: ps.maxHeight * row + margin,
    })
  })

  return tempPanels.map((p, i) => ({
    key: keys[i] ? keys[i] : '',
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
export function createInformationData(base: string, count: number) {
  let result: { [k: string]: string } = {}
  range(count).forEach((_, i) => {
    result[`(Info ${i + 1})`] = `${base} ${i + 1}`
  })
  return result
}

// ----------------------------------------------------------------------------
// --------------------------- EXPORT START -----------------------------------

/**
 * Handle resort.
 * @param order
 * @param position
 * @param key
 */
export function handleResort(
  panels: PanelWithPosition[],
  order: PanelWithPosition[],
  position: number[],
  index: number,
  moving: boolean,
  margin: number,
  size: Size,
  offsetHeight: number
) {
  // Variables.
  const [x, y] = position
  const tempOrder = cloneDeep(order)
  const key = panels[index].key
  const fromIndex = tempOrder.findIndex(p => p.key === key)
  // Get to index.
  let toIndex = tempOrder.findIndex(({ left, top, width, height }) => {
    // x is ok, but y is calculated from the top of the page,
    // includes the header, so we have to set a offset to get it correctly
    return (
      x > left &&
      x < left + width &&
      y > top + offsetHeight &&
      y < top + height + offsetHeight
    )
  })

  // Do nothing if `toIndex` is invalid.
  if (toIndex < 0) return [panels, order]

  // Get flags for check is the from or to panel is the largest.
  const isFromLargest = tempOrder[fromIndex].largest
  const isToLargest = tempOrder[toIndex].largest
  // Map to index if the from panel is the largest.
  if (isFromLargest) {
    // Set `to` to 2 if the to index is in [1, 2] and `from` is 0
    if (fromIndex === 0 && toIndex === 1) toIndex = 2
    // Set `to` to 2 if the to index is in [2, 3] and `from` is 4
    else if (fromIndex === 4 && toIndex === 3) toIndex = 2
    // Set `to` to 0 if the to index is in [0, 1]
    else if (toIndex === 1) toIndex = 0
    // Set `to` to 4 if the to index is in [3, 4]
    else if (toIndex === 3) toIndex = 4
  }
  if (!isToLargest && toIndex >= 0 && toIndex !== fromIndex) {
    // Get origin index of the largest one.
    const largestIndex = tempOrder.findIndex(p => p.largest)
    const temp = tempOrder.splice(fromIndex, 1)
    tempOrder.splice(toIndex, 0, ...temp)
    // Reset the largest one's position if `from` is not the one.
    if (!isFromLargest) {
      // Get the new order of the largest one.
      const newLargestIndex = tempOrder.findIndex(p => p.largest)
      // If order changed, reset it.
      if (largestIndex !== newLargestIndex) {
        const copy = tempOrder[newLargestIndex]
        tempOrder.splice(newLargestIndex, 1)
        tempOrder.splice(largestIndex, 0, copy)
      }
    }
  }

  const newPosition = getCurrentPositions(
    size,
    margin,
    [],
    tempOrder.findIndex(p => p.largest)
  )

  newPosition.forEach((p, i) => {
    const o = tempOrder[i]
    o.left = p.left
    o.top = p.top
  })

  const tempPanels = mapToPanels(tempOrder, panels)

  // Capture current moving panel.
  const movingPanel = panels[index]

  if (moving) {
    tempPanels[index] = movingPanel
  }

  return [tempPanels, tempOrder]
}

/**
 * Bind debounce to resort handler, by dispatch an action.
 */
export const handleResortWithDebounce = debounce(
  (dispatch, position: number[], index: number, moving: boolean) =>
    moving && dispatch(handleResortAction(position, index, moving)),
  50
)

/**
 * Map positions from `order` to `panels`.
 * @param order
 * @param panels
 */
export function mapToPanels(
  order: PanelWithPosition[],
  panels: PanelWithPosition[]
) {
  const tempOrder = order
  const tempPanels = cloneDeep(panels)
  // Convert `order` to the same order with panels.
  const op = tempPanels.map(p => {
    return tempOrder.find(o => o.key === p.key)
  }) as PanelWithPosition[]

  return tempPanels.map((p, i) => {
    const thisOp = op[i]
    p.width = thisOp.width
    p.height = thisOp.height
    p.left = thisOp.left
    p.top = thisOp.top
    return p
  })
}

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
 * @param minimizeFlag optional
 */
export function handleSizeChangeForSortable(
  panels: PanelWithPosition[],
  order: PanelWithPosition[],
  windowSize: Size,
  margin: number,
  minimizeFlag: string[] = []
) {
  // Get new positions.
  const newPositions = getCurrentPositions(
    windowSize,
    margin,
    [],
    order.findIndex(p => p.largest)
  )
  const tempOrder = cloneDeep(order)

  const minimizedIndex = tempOrder.findIndex(p => minimizeFlag.includes(p.key))

  const nearPanels = [
    tempOrder[minimizedIndex - 1] && tempOrder[minimizedIndex - 1].key,
    tempOrder[minimizedIndex + 1] && tempOrder[minimizedIndex + 1].key,
  ]

  tempOrder.forEach((p, i) => {
    const thePosition = newPositions[i]
    if (!minimizeFlag.includes(p.key)) {
      p.width = thePosition.width
      p.height = thePosition.height
      p.top = thePosition.top
      p.left = thePosition.left
    } else {
      p.tempWidth = thePosition.width
      p.tempHeight = thePosition.height
      p.tempTop = thePosition.top
      p.tempLeft = thePosition.left
    }
  })

  const newPanels = mapToPanels(tempOrder, panels)

  return [newPanels, tempOrder]
}

/**
 * Handle position and size changes while window resize.
 * @param panels
 * @param order
 * @param windowSize
 * @param margin
 */
export function handleSizeChangeForUnsortable(
  panels: PanelWithPosition[],
  order: PanelWithPosition[],
  windowSize: Size,
  lastSize: Size
  // minimizeFlag?: boolean
) {
  const heightRatio = windowSize.height / lastSize.height
  const widthRatio = windowSize.width / lastSize.width

  const tempPanels = cloneDeep(panels)

  tempPanels.forEach(p => {
    p.width *= widthRatio
    p.height *= heightRatio
    p.top *= heightRatio
    p.left *= widthRatio
  })

  return [tempPanels, order]
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
