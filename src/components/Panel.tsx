import React, {
  CSSProperties,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { Icon, Empty } from 'antd'
import { animated as a } from 'react-spring'
import { useSelector, useDispatch } from 'react-redux'
import { useSpring } from 'react-spring'
import { State } from '../type'
import { handlePanelResize } from '../actions'

interface Props {
  style: CSSProperties
  title: string
  children: any
  trueKey: string
  bind: {}
}

const Panel: React.FC<Props> = (props: Props) => {
  const [pinned, setPinned] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [panelResizeFlag, setPanelResizeFlag] = useState(false)
  const [originalXY, setOriginalXY] = useState([0, 0])
  const [panelSize, setPanelSize] = useState([0, 0])
  const panelRef = useRef<HTMLDivElement>(null)

  const sortable = useSelector((state: State) => state.settings.sortable)
  const dispatch = useDispatch()

  // --------------------------------------------------------------------------
  // -------------------------- START SECTION ---------------------------------
  // Handle panel resize.

  // Register and unregister dispatcher according the flag.
  useEffect(() => {
    if (panelResizeFlag) {
      const dispatchPanelResizeAction = (e: MouseEvent) => {
        dispatch(
          handlePanelResize(props.trueKey, [
            panelSize[0] + e.clientX - originalXY[0],
            panelSize[1] + e.clientY - originalXY[1],
          ])
        )
      }
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

  // Register trigger.
  const handleResizeTrigger = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (panelRef && panelRef.current) {
        setPanelSize([
          panelRef.current.clientWidth,
          panelRef.current.clientHeight,
        ])
      }
      setOriginalXY([e.clientX, e.clientY])
      setPanelResizeFlag(true)
    },
    []
  )

  // --------------------------- END SECTION ----------------------------------
  // --------------------------------------------------------------------------

  const triggerPinned = () => setPinned(!pinned)
  const triggerMaximized = () => setMaximized(!maximized)

  return (
    <a.div className="panel" style={props.style} ref={panelRef}>
      <header className="panel-header">
        <div className="panel-title" {...props.bind}>
          {props.title}
        </div>
        <div className="panel-buttons">
          <button>
            <Icon type="vertical-align-bottom" />
          </button>
          <button onClick={triggerPinned}>
            {pinned ? (
              <Icon type="pushpin" theme="filled" />
            ) : (
              <Icon type="pushpin" />
            )}
          </button>
          <button onClick={triggerMaximized}>
            {maximized ? <Icon type="shrink" /> : <Icon type="arrows-alt" />}
          </button>
        </div>
      </header>
      <div className="panel-content">
        {props.children ? (
          props.children
        ) : (
          <Empty description="No Data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        <a.div
          className="resize-icon"
          style={{ ...spring, display: sortable ? 'none' : 'inline-block' }}
          onMouseDown={handleResizeTrigger}
        >
          <Icon type="double-right" />
        </a.div>
      </div>
    </a.div>
  )
}

export default Panel
