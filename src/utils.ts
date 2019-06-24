import { range } from 'lodash'
import { Size, SizeWithPosition } from './type'

/**
 * Calculate min-height of content box.
 * @param width box width
 */
export function calculateMinHeight(width: number) {
  return { minHeight: width / 3 }
}

/**
 * Calculate base size of panel.
 * @param size content box size
 */
export function calculateInitialPanelSize(size: Size, margin: number) {
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
 * Calculate positions of all panels.
 */
export function calculatePositions(
  windowSize: Size,
  margin: number,
  keys: string[]
) {
  const panelSizes = range(5).map((_, i) => {
    // Position of the largest one
    if (i === 2) {
      let p = calculateInitialPanelSize(windowSize, margin)
      // Double the height
      p.maxHeight = p.maxHeight * 2
      p.height = p.maxHeight - margin
      return p
    } else {
      return calculateInitialPanelSize(windowSize, margin)
    }
  })

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
