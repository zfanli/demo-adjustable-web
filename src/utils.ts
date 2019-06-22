import { Size, ExtendSize, SizeWithPosition } from './type'

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
 * @param panelSizes panel size list
 */
export function calculatePositions(
  panelSizes: ExtendSize[],
  margin: number,
  keys: string[]
) {
  let panels: SizeWithPosition[][] = new Array(2)

  panelSizes.forEach((ps, index) => {
    // Get panel col number.
    // For first row, index is [0, 1, 2], plus 1 to get its col number,
    // for second row, index is [3, 4], minus 2 will get their col number.
    const col = index > 2 ? index - 3 : index
    const row = index > 2 ? 1 : 0

    // Initialize array when needed
    if (!panels[col]) {
      panels[col] = []
    }

    panels[col][row] = {
      ...ps,
      left: ps.maxWidth * col + margin,
      top: ps.maxHeight * row + margin,
    }
  })

  return panels.flat().map((p, i) => ({
    key: keys[i],
    height: p.height,
    width: p.width,
    left: p.left,
    top: p.top,
  }))
}
