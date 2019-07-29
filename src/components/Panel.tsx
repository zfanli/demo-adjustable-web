import React, {
  CSSProperties,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { Icon, Empty, Tooltip } from 'antd'
import { animated as a, useSpring } from 'react-spring/web.cjs'
import { useSelector, useDispatch } from 'react-redux'
import { State } from '../type'
import {
  handlePanelResize,
  handleSwitchActive,
  handlePanelMinimize,
  handlePanelPinned,
  handlePanelRetrieve,
  handlePanelMaximize,
} from '../actions'
import { throttle, range } from 'lodash'

interface Props {
  style: CSSProperties
  title: string
  children: any
  index: number
  trueKey: string
  bind: {}
}

const Panel: React.FC<Props> = (props: Props) => {
  const [maximized, setMaximized] = useState(false)
  const [panelResizeFlag, setPanelResizeFlag] = useState(false)
  const [originalXY, setOriginalXY] = useState([0, 0])
  const [panelSize, setPanelSize] = useState([0, 0])
  const [minimizePinned, setMinimizePinned] = useState(false)
  const [maximizePinned, setMaximizePinned] = useState(false)
  const [resizePinned, setResizePinned] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const sortable = useSelector((state: State) => state.settings.sortable)
  const locale = useSelector((state: State) => state.settings.locale)
  const messageFlag = useSelector((state: State) => state.settings.messageFlag)
  const messageLeaveDelay = useSelector(
    (state: State) => state.settings.messageLeaveDelay
  )
  const pinned = useSelector((state: State) => state.pinned).includes(
    props.trueKey
  )
  const dispatch = useDispatch()

  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Handle panel resize.

  // Register and unregister dispatcher according the flag.
  useEffect(() => {
    if (panelResizeFlag) {
      const dispatchPanelResizeAction = throttle((e: MouseEvent) => {
        const x = panelSize[0] + e.clientX - originalXY[0]
        const y = panelSize[1] + e.clientY - originalXY[1]
        dispatch(
          handlePanelResize(props.trueKey, [
            x < 240 ? 240 : x,
            y < 160 ? 160 : y,
          ])
        )
      }, 40)
      const turnOff = () => setPanelResizeFlag(false)

      window.addEventListener('mousemove', dispatchPanelResizeAction)
      window.addEventListener('mouseup', turnOff)

      return function cleanup() {
        window.removeEventListener('mousemove', dispatchPanelResizeAction)
        window.removeEventListener('mouseup', turnOff)
      }
    }
  }, [panelSize, dispatch, panelResizeFlag, props.trueKey, originalXY])

  // Resize icon showing styles.
  const spring = useSpring({
    from: { opacity: 0 },
    to: { opacity: sortable ? 0 : 1 },
    config: { duration: 100 },
  })

  const setCurrentPanelActive = useCallback(
    () => dispatch(handleSwitchActive(props.index)),
    [dispatch, props.index]
  )

  // Register trigger.
  const handleResizeTrigger = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!pinned) {
        setCurrentPanelActive()
        e.preventDefault()
        if (panelRef && panelRef.current) {
          setPanelSize([
            panelRef.current.clientWidth,
            panelRef.current.clientHeight,
          ])
        }
        setOriginalXY([e.clientX, e.clientY])
        setPanelResizeFlag(true)
      } else {
        if (messageFlag) {
          setResizePinned(true)
          setTimeout(() => setResizePinned(false), messageLeaveDelay)
        }
      }
    },
    [setCurrentPanelActive, messageFlag, messageLeaveDelay, pinned]
  )

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Handle button click.

  const handleMinimize = () => {
    !pinned && dispatch(handlePanelMinimize(props.index))
    // Show a message tells that this panel was pinned.
    if (pinned && messageFlag) {
      setMinimizePinned(true)
      setTimeout(() => setMinimizePinned(false), messageLeaveDelay)
    }
  }

  const triggerPinned = () => dispatch(handlePanelPinned(props.index))

  const triggerMaximized = () => {
    if (!pinned) {
      setMaximized(!maximized)

      range(5).forEach(
        i =>
          i !== props.index &&
          dispatch(maximized ? handlePanelRetrieve(i) : handlePanelMinimize(i))
      )

      // Maximize panel for now.
      dispatch(handlePanelMaximize(props.index, !maximized))
    }
    // Show a message tells that this panel was pinned.
    if (pinned && messageFlag) {
      setMaximizePinned(true)
      setTimeout(() => setMaximizePinned(false), messageLeaveDelay)
    }
  }

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------

  // Trigger dragging gesture only when the panel is not be pinned.
  const bound = pinned ? {} : props.bind

  return (
    <a.div
      className="panel"
      style={props.style}
      ref={panelRef}
      onClick={setCurrentPanelActive}
    >
      <header className="panel-header">
        <div className={`panel-title ${pinned ? 'disabled' : ''}`} {...bound}>
          {props.title}
        </div>
        <div className="panel-buttons">
          <Tooltip
            trigger="click"
            title={locale['panelWasPinned']}
            visible={minimizePinned}
          >
            <button className="minimize" onClick={handleMinimize}>
              <Icon type="vertical-right" />
            </button>
          </Tooltip>
          <button onClick={triggerPinned}>
            {pinned ? (
              <Icon type="pushpin" theme="filled" />
            ) : (
              <Icon type="pushpin" />
            )}
          </button>
          <Tooltip
            trigger="click"
            title={locale['panelWasPinned']}
            visible={maximizePinned}
          >
            <button onClick={triggerMaximized}>
              {maximized ? <Icon type="shrink" /> : <Icon type="arrows-alt" />}
            </button>
          </Tooltip>
        </div>
      </header>
      <div className="panel-content">
        {props.children ? (
          props.children
        ) : (
          <Empty description="No Data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
      <Tooltip
        trigger="click"
        title={locale['panelWasPinned']}
        visible={resizePinned}
      >
        <a.div
          className="resize-icon"
          style={{ ...spring, display: sortable ? 'none' : 'inline-block' }}
          onMouseDown={handleResizeTrigger}
        />
      </Tooltip>
    </a.div>
  )
}

export default Panel
