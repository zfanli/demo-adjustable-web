import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTransition, useSprings } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { debounce } from 'lodash'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Panel from '../components/Panel'

import { setSize, setFlatPanels } from '../actions'
import { State, FlatPanel } from '../type'
import { calculatePositions } from '../utils'

import '../css/adjustableView.scss'

const AdjustableView: React.FC = () => {
  // A ref object for fetch size info of content box.
  const av = useRef<HTMLDivElement>(null)

  // Margins.
  const margin = useSelector((state: State) => state.margin)

  // Get initial size.
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

  // Get panel sizes.
  const panelSizes = useSelector((state: State) => state.panelSizes)

  // Panel keys.
  const keys = useSelector((state: State) => state.panelKeys)
  // Get panels position info.
  const flatPanels: FlatPanel[] = calculatePositions(panelSizes, margin, keys)
  // Store for further use.
  dispatch(setFlatPanels(flatPanels))

  // Panel names.
  const panelNames = useSelector((state: State) => state.locale.panels)

  const shadowSize = useSelector(
    (state: State) => state.shadowSizeWhileDragging
  )

  const getStyledPositions = (
    panels: FlatPanel[],
    isSort?: boolean,
    down?: boolean,
    originalIndex?: number,
    delta?: number[]
  ) => (index: number) =>
    down && index === originalIndex && delta
      ? {
          // Dragging styles
          x: panels[index].left + delta[0],
          y: panels[index].top + delta[0],
          scale: 1.1,
          zIndex: 10,
          boxShadow: `0 0 ${shadowSize}px 0 #999`,
          immediate: (name: string) =>
            !isSort && (name === 'zIndex' || name === 'x' || name === 'y'),
        }
      : {
          // Normal styles
          x: panels[index].left,
          y: panels[index].top,
          scale: 1,
          zIndex: 0,
          boxShadow: '0 0 5px 0 #ddd',
          immediate: () => false,
        }

  const [springs, setSprings] = useSprings(
    flatPanels.length,
    getStyledPositions(flatPanels)
  )

  const bind = useGesture(({ args: [originalIndex], down, delta }) => {
    console.log(delta)
    // setSprings(
    //   getStyledPositions(flatPanels, false, down, originalIndex, delta)
    // )
  })

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
          marginBottom: margin,
          marginRight: margin,
        }}
      >
        {transitions.map(({ props, key }, i) => (
          <Panel
            key={key}
            style={props}
            title={panelNames[i]}
            trueKey={keys[i]}
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
