import React, { useRef, useState, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { animated as a, useTransition } from 'react-spring'
import { throttle, range } from 'lodash'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Panel from '../components/Panel'

import '../css/adjustableView.scss'
import { State } from '../type'

/**
 * Base for store element size info.
 */
interface Size {
  width: number
  height: number
}

/**
 * Base for store panel size info.
 */
interface ExtendSize extends Size {
  maxWidth: number
  maxHeight: number
}

/**
 * Advanced type for store panel size info and position.
 */
interface SizeWithPosition extends ExtendSize {
  left: number
  top: number
}

/**
 * Calculate min-height of content box.
 * @param width box width
 */
function calculateMinHeight(width: number) {
  return { minHeight: width / 3 }
}

/**
 * Calculate base size of panel.
 * @param size content box size
 */
function calculateInitialPanelSize(size: Size, margin: number) {
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
function calculatePositions(panelSizes: ExtendSize[], margin: number) {
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

  return panels
}

const AdjustableView: React.FC = () => {
  /**
   * A ref object for fetch size info of content box.
   */
  const av = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  // debug only, remove before build.
  console.log(size)

  // Update size info when the window is resized.
  // Use layout effect because it should determine its size before be showed.
  useLayoutEffect(() => {
    // Create handler for resize event.
    const resizeHandler = () => {
      if (av && av.current) {
        const width = av.current.offsetWidth
        const height = av.current.offsetHeight
        setSize({ width, height })
      }
    }
    // Throttle control for optimized performance.
    const handler = throttle(resizeHandler, 200)
    // Listening to resize event.
    window.addEventListener('resize', handler)

    // Call first time for initialize state.
    handler()

    // Clean up listener when this component will be unmounted.
    return function cleanup() {
      window.removeEventListener('resize', handler)
    }
  }, [])

  /**
   * Set margins.
   *
   * Margin to control whitespace between each panel,
   * but note, each panel will only apply top and left margins,
   * for convenience, the content box will apply bottom and right margins.
   *
   * const [margin, setMargin] = useState(10) // not needed now
   */
  const margin = 10

  /**
   * Initial panel size,
   * 5 panels in total, list in a 2x3 grid,
   * 4 of them are the same size, rest 1 is double size (height only),
   * just like: [<normal>, <normal>, <large>, <normal>, <normal>].
   *
   * Layout as:
   * ```
   * <normal1>  <normal2>  <large3 part1>
   * <normal4>  <normal5>  <large3 part2>
   * ```
   */
  const initialPanels = range(5).map((_, i) => {
    if (i === 2) {
      let p = calculateInitialPanelSize(size, margin)
      p.maxHeight = p.maxHeight * 2
      p.height = p.maxHeight - margin
      return p
    } else {
      return calculateInitialPanelSize(size, margin)
    }
  })

  /**
   * Finial panels' info array,
   * a 2d array, include cols and rows number in the indices,
   * each item contains info of its
   * height, width, top, left and maxHeight, maxWidth.
   */
  const panels = calculatePositions(initialPanels, margin)

  /**
   * Panel keys.
   */
  const keys = useSelector((state: State) => state.panelKeys)

  return (
    <>
      <Header />
      <div
        ref={av}
        className="av-content"
        style={{
          ...calculateMinHeight(size.width),
          marginBottom: margin,
          marginRight: margin,
        }}
      >
        {panels.flat().map((s, i) => (
          <Panel key={keys[i]} style={s}>
            {keys[i]}
          </Panel>
        ))}
      </div>
      <Footer />
    </>
  )
}

export default AdjustableView
