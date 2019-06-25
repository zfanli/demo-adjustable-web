import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSprings, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { debounce } from 'lodash'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Panel from '../components/Panel'
import InformationList from '../components/InformationList'

import { setSize, setDraggingPosition, turnOffAnimation } from '../actions'
import { State, FlatPanel } from '../type'

import '../css/adjustableView.scss'
import { getFakeDataOfUserInfo } from '../utils'

const AdjustableView: React.FC = () => {
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Preparations. Get/Set data.

  // A ref object of content box for further use.
  const av = useRef<HTMLDivElement>(null)
  // Margins.
  const margin = useSelector((state: State) => state.margin)
  // Lang.
  const lang = useSelector((state: State) => state.lang)
  // Edit content box margins.
  const contentBoxMargins = { marginBottom: margin, marginRight: margin }
  // Dispatcher.
  const dispatch = useDispatch()
  // All panels information for further use.
  const flatPanels = useSelector((state: State) => state.flatPanels)
  // Panel names.
  const panelNames = useSelector((state: State) => state.locale.panels)
  // Panel keys.
  const panelKeys = useSelector((state: State) => state.panelKeys)
  // Styling shadow while in dragging,
  // this shadow size is configured at `config.json`.
  const shadowSize = useSelector(
    (state: State) => state.shadowSizeWhileDragging
  )

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
    panels: FlatPanel[],
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
            scale: 1.05,
            zIndex: 10,
            boxShadow: `0 0 ${shadowSize}px 0 rgba(0,0,0,.3)`,
            width: panels[index].width,
            height: panels[index].height,
            immediate: (name: string) =>
              name === 'zIndex' || name === 'x' || name === 'y',
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

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Generate animation props to move panels smoothly.
  // Initialize with the length of panels' count,
  // and styling as specified styles.

  const [springs, setSprings] = useSprings(
    flatPanels.length,
    getStyledPositions(flatPanels, true)
  )

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Trigger transition animation manually.
  //
  // Trigger animation in these situations:
  //
  //  - Window resized
  //  - Reset button clicked
  //  - Trigger to sortable view
  //
  // There is a `triggerAnimation` flag for handle state changes which should
  // trigger a transition animation.
  //
  // Set it to false after animation is performed.

  const triggerAnimation = useSelector((state: State) => state.triggerAnimation)
  if (triggerAnimation) {
    setSprings(getStyledPositions(flatPanels) as any)
    dispatch(turnOffAnimation())
  }

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Handle mouse dragging.
  // Expose the down state, delta information to make a transition animation,
  // and preventing text selection actions caused by dragging.

  const bind = useGesture(
    ({ args: [originalIndex], down, delta, last, event }) => {
      // Preventing text selection caused by dragging.
      !last && event && event.preventDefault()
      // Dispatch current position.
      dispatch(setDraggingPosition(delta, originalIndex, down))
      // Use current position to move panel smoothly.
      // Cast to any to suppress tiresome type error.
      setSprings(getStyledPositions(flatPanels, down, originalIndex) as any)
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

  useEffect(() => {
    // Create handler for resize event.
    const resizeHandler = () => {
      if (av && av.current) {
        const width = av.current.offsetWidth
        const height = av.current.offsetHeight
        // Store current content box size.
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

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Preparation for panels' content.

  const panelChildren = {
    [panelKeys[0]]: (
      <InformationList information={getFakeDataOfUserInfo(lang, 9)} />
    ),
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
                (x, y, s) => `translate3d(${x}px,${y}px,0) scale(${s})`
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
      <Footer />
    </>
  )
}

export default AdjustableView
