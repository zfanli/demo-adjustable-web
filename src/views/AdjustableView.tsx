import React, { useRef, useState, useEffect } from 'react'
import { throttle, range } from 'lodash'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Panel from '../components/Panel'

import '../css/adjustableView.scss'

interface Size {
  width: number
  height: number
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
  return {
    width: Math.floor(size.width / 3) - margin * 2,
    height: Math.floor(size.height / 2) - margin * 2,
  }
}

/**
 * Calculate positions of all panels.
 * @param panelSizes panel size list
 */
function calculatePositions(panelSizes: Size[], margin: number) {
  return panelSizes.map((ps, index) => {
    const col = index > 2 ? index - 2 : index + 1
    const row = index > 2 ? 2 : 1
    return {
      left: ps.width * (col - 1) + margin * col,
      top: ps.height * (row - 1) + margin * row,
    }
  })
}

const AdjustableView: React.FC = () => {
  // Create a ref object for fetch size info.
  const av = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  console.log(size)

  // Update size info when the window is resized.
  useEffect(() => {
    // Create handler for resize event
    const resizeHandler = () => {
      if (av && av.current) {
        const width = av.current.clientWidth
        const height = av.current.clientHeight
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

  // Initial panel sizes.
  const margin = 5
  const panels = range(5).map(() => calculateInitialPanelSize(size, margin))
  const panelPositions = calculatePositions(panels, margin)

  return (
    <>
      <Header />
      <div
        ref={av}
        className="av-content"
        style={calculateMinHeight(size.width)}
      >
        {panels.map((s, i) => (
          <Panel key={i} style={{ ...s, ...panelPositions[i] }} />
        ))}
      </div>
      <Footer />
    </>
  )
}

export default AdjustableView
