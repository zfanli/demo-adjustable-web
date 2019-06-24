import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSprings, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { debounce } from 'lodash'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Panel from '../components/Panel'

import { setSize, setDraggingPosition } from '../actions'
import { State, FlatPanel } from '../type'

import '../css/adjustableView.scss'

const AdjustableView: React.FC = () => {
  // A ref object for fetch size info of content box.
  const av = useRef<HTMLDivElement>(null)

  // Margins.
  const margin = useSelector((state: State) => state.margin)
  // Dispatcher.
  const dispatch = useDispatch()

  // Get panels position info.
  const flatPanels: FlatPanel[] = useSelector(
    (state: State) => state.flatPanels
  )

  // Panel names.
  const panelNames = useSelector((state: State) => state.locale.panels)
  // Styling shadow while in dragging, this shadow size is configured at `config.json`.
  const shadowSize = useSelector(
    (state: State) => state.shadowSizeWhileDragging
  )

  // Function to get current positions of each panel, and styling moving action.
  function getStyledPositions(
    // For get position from, directly from store.
    panels: FlatPanel[],
    // For sortable support, moving animations should apply while sorting.
    isSort?: boolean,
    // Is now dragging? For fires dragging animations.
    down?: boolean,
    // For identify which panel is in dragging.
    originalIndex?: number
    // Return function: (index: number) => ({ props }) for setSprings use.
  ) {
    return (index: number) =>
      down && index === originalIndex
        ? {
            // Dragging styles
            x: panels[index].left,
            y: panels[index].top,
            scale: 1.1,
            zIndex: 10,
            boxShadow: `0 0 ${shadowSize}px 0 rgba(0,0,0,.3)`,
            width: panels[index].width,
            height: panels[index].height,
            immediate: (name: string) =>
              !isSort && (name === 'zIndex' || name === 'x' || name === 'y'),
            config: { mass: 5, tension: 1000, friction: 100 },
            trail: 25,
          }
        : {
            // Normal styles
            x: panels[index].left,
            y: panels[index].top,
            scale: 1,
            zIndex: 0,
            boxShadow: '0 0 5px 0 rgba(0,0,0,.1)',
            width: panels[index].width,
            height: panels[index].height,
            immediate: () => false,
            config: { mass: 5, tension: 1000, friction: 100 },
            trail: 25,
          }
  }

  // Generate animation props to move panels smoothly.
  const [springs, setSprings] = useSprings(
    flatPanels.length,
    getStyledPositions(flatPanels, true)
  )

  const bind = useGesture(
    ({ args: [originalIndex], down, delta, last, event }) => {
      // Prevent text selection while dragging.
      !last && event && event.preventDefault()
      // Dispatch dragging event to calculate current position.
      dispatch(setDraggingPosition(delta, originalIndex, down))
      // Use current position to move panel smoothly.
      setSprings(getStyledPositions(
        flatPanels,
        false,
        down,
        originalIndex
      ) as any) // cast to any to suppress tiresome ts type error
    },
    // Configure to enable operation on event directly.
    { event: { capture: true, passive: false } }
  )

  function updateSprings() {
    setSprings(getStyledPositions(flatPanels, true) as any)
  }

  // Update size info when the window is resized.
  // Use layout effect because it should determine its size before be showed.
  useEffect(() => {
    // Create handler for resize event.
    const resizeHandler = () => {
      if (av && av.current) {
        const width = av.current.offsetWidth
        const height = av.current.offsetHeight
        dispatch(setSize({ width, height }))
        updateSprings()
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

  return (
    <>
      <Header />
      <div
        ref={av}
        className="av-content"
        style={{
          marginBottom: margin,
          marginRight: margin,
        }}
      >
        {springs.map(({ x, y, scale, ...rest }, i) => (
          <Panel
            key={i}
            style={{
              transform: interpolate(
                [x, y, scale],
                (x, y, s) => `translate3d(${x}px,${y}px,0) scale(${s})`
              ),
              ...rest,
            }}
            title={panelNames[i]}
            bind={bind(i)}
          >
            <div>test</div>
          </Panel>
        ))}
      </div>
      <Footer />
    </>
  )
}

export default AdjustableView
