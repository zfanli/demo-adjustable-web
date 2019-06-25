import { range } from 'lodash'
import { Size, SizeWithPosition, FlatPanel, ExtendSize } from './type'

/**
 * Get current panel size, calculate by current window size.
 * @param size
 * @param margin
 */
function getCurrentPanelSize(size: Size, margin: number) {
  const [maxWidth, maxHeight] = [
    Math.ceil(size.width / 3),
    Math.ceil(size.height / 2),
  ]

  return {
    // Max size is for entire container size (fiction container).
    maxWidth,
    maxHeight,
    // Size for panel itself, without margins.
    width: maxWidth - margin,
    height: maxHeight - margin,
  }
}

/**
 * Packaging panels' sizes.
 * @param windowSize
 * @param margin
 */
function packagePanels(windowSize: Size, margin: number) {
  return range(5).map((_, i) => {
    // Position of the largest one
    if (i === 2) {
      let p = getCurrentPanelSize(windowSize, margin)
      // Double the height
      p.maxHeight = p.maxHeight * 2
      p.height = p.maxHeight - margin
      return p
    } else {
      return getCurrentPanelSize(windowSize, margin)
    }
  })
}

/**
 * Get position by sizes.
 * @param panelSizes
 * @param margin
 * @param keys
 */
function getPositionsBySizes(
  panelSizes: ExtendSize[],
  margin: number,
  keys: string[] = []
) {
  let panels: SizeWithPosition[] = []

  panelSizes.forEach((ps, index) => {
    // Get panel col number.
    // For first row, index is [0, 1, 2], plus 1 to get its col number,
    // for second row, index is [3, 4], minus 2 will get their col number.
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
  panels: FlatPanel[],
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
    const pair = p.split('=')
    coo[pair[0].trim()] = pair[1].trim()
  })
  return coo[key]
}

// ---------------------------- EXPORT END ------------------------------------
// ----------------------------------------------------------------------------
