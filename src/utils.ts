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
 * Get position by sizes.
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
  keys?: string[]
) {
  const panelSizes = packagePanels(windowSize, margin)
  return getPositionsBySizes(panelSizes, margin, keys)
}

/**
 * Handle position and size changes while window resize.
 * @param panels
 * @param windowSize
 * @param margin
 */
export function handleSizeChange(
  panels: PanelWithPosition[],
  windowSize: Size,
  lastSize: Size,
  margin: number
) {
  const newPositions = packagePanels(windowSize, margin)

  const heightRatio = windowSize.height / lastSize.height
  const widthRatio = windowSize.width / lastSize.width

  // Change relative positions and sizes.
  panels.forEach((panel, index) => {
    panel.width = newPositions[index].width
    panel.height = newPositions[index].height
    panel.top *= heightRatio
    panel.left *= widthRatio
  })

  return panels
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
