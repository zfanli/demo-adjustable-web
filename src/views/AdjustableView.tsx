import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTransition } from 'react-spring'
import { debounce, range } from 'lodash'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Panel from '../components/Panel'

import { setSize } from '../actions'
import { State } from '../type'
import {
  calculateMinHeight,
  calculateInitialPanelSize,
  calculatePositions,
} from '../utils'

import '../css/adjustableView.scss'

const AdjustableView: React.FC = () => {
  // A ref object for fetch size info of content box.
  const av = useRef<HTMLDivElement>(null)

  // Margins.
  const margin = useSelector((state: State) => state.margin)

  // Calculate initial size.
  const size = useSelector((state: State) => state.contentBoxSize)
  const dispatch = useDispatch()

  // debug only, remove before build.
  console.log(size)

  // Update size info when the window is resized.
  // Use layout effect because it should determine its size before be showed.
  useEffect(() => {
    // Create handler for resize event.
    const resizeHandler = () => {
      if (av && av.current) {
        const width = av.current.offsetWidth
        const height = av.current.offsetHeight
        dispatch(setSize({ width, height }))
      }
    }

    // Throttle control for optimized performance.
    const handler = debounce(resizeHandler, 200)

    // Listening to resize event.
    window.addEventListener('resize', handler)

    // Call first time for initialize state.
    handler()

    // Clean up listener when this component will be unmounted.
    return function cleanup() {
      window.removeEventListener('resize', handler)
    }
  }, [dispatch])

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
    // Position of the largest one
    if (i === 2) {
      let p = calculateInitialPanelSize(size, margin)
      // Double the height
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

  // Panel keys.
  const keys = useSelector((state: State) => state.panelKeys)
  // Panel names.
  const panelNames = useSelector((state: State) => state.locale.panels)

  // Flatten array and bind keys.
  const flatPanels = panels.flat().map((p, i) => ({
    key: keys[i],
    height: p.height,
    width: p.width,
    left: p.left,
    top: p.top,
  }))

  // Create animation props.
  const transitions = useTransition(flatPanels, panel => panel.key, {
    // From is the state before display.
    from: ({ height, width, top, left }) => ({ height, width, top, left }),
    // This state use to transition from `from` to display.
    enter: ({ height, width, top, left }) => ({ height, width, top, left }),
    // Apply while update ocurred.
    update: ({ height, width, top, left }) => ({ height, width, top, left }),
    // Apply when component is to be unmounted.
    leave: { height: 0, opacity: 0 },
    // Config, adjust tension to change speed.
    config: { mass: 5, tension: 1000, friction: 100 },
    trail: 25,
  })

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
        {transitions.map(({ props, key }, i) => (
          <Panel key={key} style={props} title={panelNames[i]}>
            <div>test</div>
          </Panel>
        ))}
      </div>
      <Footer />
    </>
  )
}

export default AdjustableView
