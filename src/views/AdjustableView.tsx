import React, { useRef, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  useSprings,
  interpolate,
  animated as a,
  useTransition,
} from 'react-spring/web.cjs'
import { useGesture } from 'react-use-gesture'
import { message, Spin } from 'antd'
import { debounce } from 'lodash'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Panel from '../components/Panel'
import InformationList from '../components/InformationList'

import {
  handleWindowResize,
  handlePanelDragging,
  handleSwitchActive,
  handleInitialPanels,
  // handleInitialUnsortedPanels,
} from '../actions'
import { State, PanelWithPosition } from '../type'

import '../css/adjustableView.scss'
import { handleResortWithDebounce } from '../utils'
import Conversation from '../components/Conversation'
import TabBar from '../components/TabBar'
import DynamicMenu from '../components/DynamicMenu'
import FixedMenu from '../components/FixedMenu'
import { getPanels } from '../reducers/utils'
import ModalPanel from '../components/ModalPanel'

const AdjustableView: React.FC = () => {
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Preparations. Get/Set data.

  // A ref object of content box for further use.
  const av = useRef<HTMLDivElement>(null)
  // Margins.
  const margin = useSelector((state: State) => state.settings.margin)
  // Lang.
  // const lang = useSelector((state: State) => state.settings.lang)
  const locale = useSelector((state: State) => state.settings.locale)
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
  const tabs = useSelector((state: State) => state.tabs)
  const minimizedTabs = Object.keys(tabs).filter(k => tabs[k])
  // For modal support.
  const modalVisible = useSelector((state: State) => state.modalVisible)

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
            opacity: 1,
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
            opacity: minimizedTabs.includes(p.key) ? 0 : 1,
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

  // Message for disable dragging.
  const disableMessage = debounce(
    () => message.info(locale.disableDraggingMessage),
    5000,
    {
      leading: true,
      trailing: false,
    }
  )

  const bind = useGesture(
    ({ args: [originalIndex], xy, down, delta, last, event }) => {
      // Disable dragging if any panel is minimized.
      // 'Cause of some unexpected bugs.
      if (sortable && minimizedTabs.length > 0) {
        disableMessage()
        return
      }

      // Preventing text selection caused by dragging.
      !last && event && event.preventDefault()
      // Dispatch current position.
      dispatch(handlePanelDragging(xy, delta, originalIndex, down))
      // Trigger resort if in sortable mode.
      sortable && handleResortWithDebounce(dispatch, xy, originalIndex, down)
      // Set the z-indices if in un-sortable mode and dragging is done.
      !sortable && !down && dispatch(handleSwitchActive(originalIndex))
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
      dispatch(handleWindowResize({ width, height }))
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

  const users = useSelector((state: State) => state.users)
  const applies = useSelector((state: State) => state.applies)
  const activeUser = useSelector((state: State) => state.activeUser)

  const panelChildren = {
    [panelKeys[0]]: (
      <InformationList information={users[activeUser]} trueKey={panelKeys[0]} />
    ),
    [panelKeys[1]]: (
      <InformationList
        information={applies[activeUser]}
        trueKey={panelKeys[1]}
      />
    ),
    [panelKeys[2]]: <FixedMenu />,
    [panelKeys[3]]: <DynamicMenu />,
    [panelKeys[4]]: <Conversation />,
  }

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Retrieve panels.

  const LOADED = 'LOADED'
  const LOADING = 'LOADING'

  const inStyle = { opacity: 1 }
  const outStyle = { opacity: 0 }

  const isLoadingTransition = useTransition(
    [panels.length > 0 ? LOADED : LOADING],
    (k: string) => k,
    {
      from: outStyle,
      leave: outStyle,
      enter: inStyle,
      config: { duration: 100 },
    }
  )

  useEffect(() => {
    if (av && av.current) {
      getPanels(true).then(panels => {
        if (av && av.current) {
          dispatch(
            handleInitialPanels(panels, {
              width: av.current.offsetWidth,
              height: av.current.offsetHeight,
            })
          )
        }
      })
      // getPanels(false).then(panels => {
      //   dispatch(handleInitialUnsortedPanels(panels))
      // })
    }
  }, [dispatch, resizeHandler, av])

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------

  return (
    <>
      <Header />
      <div ref={av} className="av-content" style={contentBoxMargins}>
        {isLoadingTransition.map(({ item, props, key }) =>
          item === LOADING ? (
            <a.div className="content-loading" style={props} key={key}>
              <Spin
                className="loading-icon"
                size="large"
                tip={locale.loading as string}
              />
            </a.div>
          ) : (
            <a.div className="content-loaded" key={key} style={props}>
              {springs.map(({ x, y, scale, ...rest }, i) => (
                <Panel
                  key={i}
                  index={i}
                  trueKey={panelKeys[i]}
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
            </a.div>
          )
        )}
      </div>
      <TabBar handleResize={resizeHandler} />
      <Footer />
      {modalVisible ? <ModalPanel /> : <></>}
    </>
  )
}

export default AdjustableView
