import React, { useRef, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSprings, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { debounce } from 'lodash'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Panel from '../components/Panel'
import InformationList from '../components/InformationList'

import { setSize, handleDragging, setActivePanel } from '../actions'
import { State, PanelWithPosition } from '../type'

import '../css/adjustableView.scss'
import {
  getFakeDataOfUserInfo,
  getFakeDataOfReplyInfo,
  handleResortWithDebounce,
} from '../utils'
import Conversation from '../components/Conversation'
import TabBar from '../components/TabBar'

const AdjustableView: React.FC = () => {
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Preparations. Get/Set data.

  // A ref object of content box for further use.
  const av = useRef<HTMLDivElement>(null)
  // Margins.
  const margin = useSelector((state: State) => state.settings.margin)
  // Lang.
  const lang = useSelector((state: State) => state.settings.lang)
  // Edit content box margins.
  const contentBoxMargins = { marginBottom: margin, marginRight: margin }
  // Dispatcher.
  const dispatch = useDispatch()
  // All panels information for further use.
  const panels = useSelector((state: State) => state.panels)
  // Panel indices.
  const zIndices = useSelector((state: State) => state.zIndices)
  // Panel names.
  const panelNames = useSelector((state: State) => state.settings.locale.panels)
  // Panel keys.
  const panelKeys = useSelector((state: State) => state.panelKeys)
  // Styling shadow while in dragging,
  // this shadow size is configured at `config.json`.
  const shadowSize = useSelector(
    (state: State) => state.settings.shadowSizeWhileDragging
  )
  // For animation.
  const animationIndex = useSelector((state: State) => state.animationIndex)
  const isDraggingDown = useSelector((state: State) => state.isDraggingDown)
  const sortable = useSelector((state: State) => state.settings.sortable)

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Function to get current positions of each panel, and styling moving action.
  // For setting transition animations of each panel.
  // This function sets different transitions for panel which is moving or not.
  // While panel is moving, the position is changed immediately, otherwise
  // a transition is triggered.

  function getStyledPositions(
    // For get position from, directly from store.
    panels: PanelWithPosition[],
    // Control indices.
    currentIndices: number[],
    // Is now dragging? For fires dragging animations.
    down?: boolean,
    // For identify which panel is in dragging.
    originalIndex?: number
    // Return function: (index: number) => ({ props }) for setSprings use.
  ) {
    return panels.map((p, index) =>
      down && originalIndex === index
        ? {
            // Dragging styles
            x: p.left,
            y: p.top,
            scale: 1.05,
            zIndex: 100,
            boxShadow: `0 0 ${shadowSize}px 0 rgba(0,0,0,.3)`,
            width: p.width,
            height: p.height,
            immediate: (name: string) =>
              name === 'zIndex' || name === 'x' || name === 'y',
            config: { mass: 5, tension: 1000, friction: 100 },
            trail: 25,
          }
        : {
            // Normal styles
            x: p.left,
            y: p.top,
            scale: 1,
            zIndex: (currentIndices[index] + 1) * 10,
            boxShadow: '0 0 5px 0 rgba(0,0,0,.1)',
            width: p.width,
            height: p.height,
            immediate: (name: string) => name === 'zIndex',
            config: { mass: 5, tension: 1000, friction: 100 },
            trail: 25,
          }
    )
  }

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Generate animation props to move panels smoothly.
  // Initialize with the length of panels' count,
  // and styling as specified styles.

  const springs = useSprings(
    panels.length,
    getStyledPositions(panels, zIndices, isDraggingDown, animationIndex)
  )

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Handle mouse dragging.
  //
  // Expose the down state, mouse position, delta position to make a
  // transition animation, and preventing text selection actions caused by
  // dragging.

  const bind = useGesture(
    ({ args: [originalIndex], xy, down, delta, last, event }) => {
      // Preventing text selection caused by dragging.
      !last && event && event.preventDefault()
      // Dispatch current position.
      dispatch(handleDragging(xy, delta, originalIndex, down))
      // Trigger resort if in sortable mode.
      sortable && handleResortWithDebounce(dispatch, xy, originalIndex, down)
      // Set the z-indices if in un-sortable mode and dragging is done.
      !sortable && !down && dispatch(setActivePanel(originalIndex))
    },
    // Configure to enable operation on event directly.
    { event: { capture: true, passive: false } }
  )

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Change relative position and size when window size changes.
  // It should be executed only once when the component is mounted, and clean
  // up when it is unmounted.
  //
  // But because dispatch is used, it must be listed as a dependency in the
  // list to see if it needs to be updated.
  // Fortunately it won't change, which means there is no potential impact that
  // can lead to an unexpected re-rendering.

  // Create handler for resize event.
  const resizeHandler = useCallback(() => {
    if (av && av.current) {
      const width = av.current.offsetWidth
      const height = av.current.offsetHeight
      // Store current content box size.
      dispatch(setSize({ width, height }))
    }
  }, [dispatch, av])

  useEffect(() => {
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
  }, [resizeHandler])

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Preparation for panels' content.

  const panelChildren = {
    [panelKeys[0]]: (
      <InformationList information={getFakeDataOfUserInfo(lang, 9)} />
    ),
    [panelKeys[1]]: (
      <InformationList information={getFakeDataOfReplyInfo(lang, 16)} />
    ),
    [panelKeys[4]]: <Conversation />,
  }

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------
  return (
    <>
      <Header />
      <div ref={av} className="av-content" style={contentBoxMargins}>
        {springs.map(({ x, y, scale, ...rest }, i) => (
          <Panel
            key={i}
            style={{
              transform: interpolate(
                [x, y, scale],
                (x: any, y: any, s: any) =>
                  `translate3d(${x}px,${y}px,0) scale(${s})`
              ),
              ...rest,
            }}
            title={panelNames[i]}
            bind={bind(i)}
          >
            {panelChildren[panelKeys[i]]}
          </Panel>
        ))}
      </div>
      <TabBar handleResize={resizeHandler} />
      <Footer />
    </>
  )
}

export default AdjustableView
