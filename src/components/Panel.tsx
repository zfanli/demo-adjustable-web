import React, {
  CSSProperties,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { Icon, Empty, Tooltip } from 'antd'
import { animated as a } from 'react-spring/web.cjs'
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
  const [panelPosition, setPanelPosition] = useState([0, 0])
  const [resizeType, setResizeType] = useState('')
  const [minimizePinned, setMinimizePinned] = useState(false)
  const [maximizePinned, setMaximizePinned] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const sortable = useSelector((state: State) => state.settings.sortable)
  const thisPanel = useSelector((state: State) => state.panels)[props.index]
  const panelMinSize = useSelector(
    (state: State) => state.settings.panelMinSize
  )
  const locale = useSelector((state: State) => state.settings.locale)
  const messageFlag = useSelector((state: State) => state.settings.messageFlag)
  const messageLeaveDelay = useSelector(
    (state: State) => state.settings.messageLeaveDelay
  )
  const pinned = useSelector((state: State) => state.pinned).includes(
    props.trueKey
  )
  const dispatch = useDispatch()

  // For calculate the resize border.
  const windowSize = useSelector((state: State) => state.settings.containerSize)
  const margin = useSelector((state: State) => state.settings.margin)
  const headerHeight = useSelector(
    (state: State) => state.settings.headerHeight
  )

  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Handle panel resize.

  // Resize handlers.
  const RIGHT_TOP = 'right-top',
    RIGHT_BOTTOM = 'right-bottom',
    LEFT_TOP = 'left-top',
    LEFT_BOTTOM = 'left-bottom',
    TOP = 'top',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right'

  const resizeHandlers = [
    RIGHT_TOP,
    RIGHT_BOTTOM,
    LEFT_TOP,
    LEFT_BOTTOM,
    TOP,
    BOTTOM,
    LEFT,
    RIGHT,
  ]

  // Register and unregister dispatcher according the flag.
  useEffect(() => {
    if (panelResizeFlag) {
      const dispatchPanelResizeAction = throttle((e: MouseEvent) => {
        let width = 0,
          height = 0,
          top = 0,
          left = 0

        const clientX =
          e.clientX > windowSize.width
            ? windowSize.width
            : e.clientX < margin
            ? margin
            : e.clientX
        const clientY =
          e.clientY < headerHeight + margin
            ? headerHeight + margin
            : e.clientY > headerHeight + windowSize.height
            ? headerHeight + windowSize.height
            : e.clientY

        const distanceX = clientX - originalXY[0]
        const distanceY = clientY - originalXY[1]

        const { minHeight, minWidth } = panelMinSize

        // Handle each situations.
        switch (resizeType) {
          case RIGHT_BOTTOM:
            // Right bottom corner.
            // For width, moves to left means shorter,
            // for height, moves to top means shorter also.

            width = panelSize[0] + distanceX
            height = panelSize[1] + distanceY

            dispatch(
              handlePanelResize(props.trueKey, [
                width < minWidth ? minWidth : width,
                height < minHeight ? minHeight : height,
                panelPosition[0],
                panelPosition[1],
              ])
            )
            break

          case RIGHT_TOP:
            // Right top corner.
            // Mouse in the right side, but also in the top.
            // Mouse moves to left means width will be shorter,
            // moves to top means height will be longer,
            // and top coordinate should be moved, too.

            top = panelPosition[1] + distanceY
            width = panelSize[0] + distanceX
            height = panelSize[1] - distanceY

            dispatch(
              handlePanelResize(props.trueKey, [
                width < minWidth ? minWidth : width,
                height < minHeight ? minHeight : height,
                panelPosition[0],
                // Top + height - minHeight for keep min height.
                height < minHeight
                  ? panelPosition[1] + panelSize[1] - minHeight
                  : top,
              ])
            )
            break

          case LEFT_BOTTOM:
            // Left bottom corner.
            // Mouse moves to left means width will be longer,
            // and left coordinate should be moved to left also.
            // Moves to top means height will be shorter.

            left = panelPosition[0] + distanceX
            width = panelSize[0] - distanceX
            height = panelSize[1] + distanceY

            dispatch(
              handlePanelResize(props.trueKey, [
                width < minWidth ? minWidth : width,
                height < minHeight ? minHeight : height,
                // Left + width - minWidth for keep min Width.
                width < minWidth
                  ? panelPosition[0] + panelSize[0] - minWidth
                  : left,
                panelPosition[1],
              ])
            )
            break

          case LEFT_TOP:
            // Last one, left top corner.
            // Left means longer width, and left coordinate will be expand.
            // Top means height will be longer, too, the top coordinate will be expand also.

            left = panelPosition[0] + distanceX
            top = panelPosition[1] + distanceY
            width = panelSize[0] - distanceX
            height = panelSize[1] - distanceY

            dispatch(
              handlePanelResize(props.trueKey, [
                width < minWidth ? minWidth : width,
                height < minHeight ? minHeight : height,
                // Left + width - minWidth for keep min Width.
                width < minWidth
                  ? panelPosition[0] + panelSize[0] - minWidth
                  : left,
                // Top + height - minHeight for keep min height.
                height < minHeight
                  ? panelPosition[1] + panelSize[1] - minHeight
                  : top,
              ])
            )
            break

          case TOP:
            // Top border.
            // Top means height's going to be longer,
            // top coordinate should be expand also.

            top = panelPosition[1] + distanceY
            height = panelSize[1] - distanceY

            dispatch(
              handlePanelResize(props.trueKey, [
                panelSize[0],
                height < minHeight ? minHeight : height,
                panelPosition[0],
                // Top + height - minHeight for keep min height.
                height < minHeight
                  ? panelPosition[1] + panelSize[1] - minHeight
                  : top,
              ])
            )
            break

          case BOTTOM:
            // Bottom border.
            // Top means shorter height.

            height = panelSize[1] + distanceY

            dispatch(
              handlePanelResize(props.trueKey, [
                panelSize[0],
                height < minHeight ? minHeight : height,
                panelPosition[0],
                panelPosition[1],
              ])
            )
            break

          case RIGHT:
            // Right border.
            // Left means shorter width.

            width = panelSize[0] + distanceX

            dispatch(
              handlePanelResize(props.trueKey, [
                width < minWidth ? minWidth : width,
                panelSize[1],
                panelPosition[0],
                panelPosition[1],
              ])
            )
            break

          case LEFT:
            // Left border.
            // Left means longer width and left coordinate should be expand.

            left = panelPosition[0] + distanceX
            width = panelSize[0] - distanceX

            dispatch(
              handlePanelResize(props.trueKey, [
                width < minWidth ? minWidth : width,
                panelSize[1],
                width < minWidth
                  ? panelPosition[0] + panelSize[0] - minWidth
                  : left,
                panelPosition[1],
              ])
            )
            break
        }
      }, 40)

      const turnOff = () => setPanelResizeFlag(false)

      window.addEventListener('mousemove', dispatchPanelResizeAction)
      window.addEventListener('mouseup', turnOff)

      return function cleanup() {
        window.removeEventListener('mousemove', dispatchPanelResizeAction)
        window.removeEventListener('mouseup', turnOff)
      }
    }
  }, [
    panelSize,
    dispatch,
    panelResizeFlag,
    props.trueKey,
    originalXY,
    panelPosition,
    resizeType,
    panelMinSize,
    windowSize,
    headerHeight,
    margin,
  ])

  const setCurrentPanelActive = useCallback(
    () => dispatch(handleSwitchActive(props.index)),
    [dispatch, props.index]
  )

  // Register trigger.
  const handleResizeTrigger = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, type: string) => {
      if (!pinned) {
        e.preventDefault()
        setCurrentPanelActive()
        if (panelRef && panelRef.current) {
          setPanelSize([
            panelRef.current.clientWidth,
            panelRef.current.clientHeight,
          ])
        }
        setPanelPosition([thisPanel.left, thisPanel.top])
        setResizeType(type)
        setOriginalXY([e.clientX, e.clientY])
        setPanelResizeFlag(true)
      }
    },
    [setCurrentPanelActive, pinned, thisPanel.left, thisPanel.top]
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

      {resizeHandlers.map((r, i) => (
        <a.div
          key={r}
          className={`${i < 4 ? 'resize-icon' : 'resize-border'} ${r}`}
          style={{ display: sortable ? 'none' : 'inline-block' }}
          onMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            handleResizeTrigger(e, r)
          }
        />
      ))}
    </a.div>
  )
}

export default Panel
