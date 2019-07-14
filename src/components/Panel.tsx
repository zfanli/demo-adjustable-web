import React, { CSSProperties, useState } from 'react'
import { Icon, Empty } from 'antd'
import { animated as a } from 'react-spring'
import { useSelector } from 'react-redux'
import { State } from '../type'
import { useSpring } from 'react-spring/web'

interface Props {
  style: CSSProperties
  title: string
  children: any
  bind: {}
}

const Panel: React.FC<Props> = (props: Props) => {
  const [pinned, setPinned] = useState(false)
  const [maximized, setMaximized] = useState(false)

  const sortable = useSelector((state: State) => state.settings.sortable)

  const spring = useSpring({
    from: {
      // display: sortable ? 'none' : 'inline-block',
      opacity: 0,
    },
    to: {
      // display: !sortable ? 'none' : 'inline-block',
      opacity: sortable ? 0 : 1,
    },
    config: {
      duration: 100,
    },
  })

  const triggerPinned = () => setPinned(!pinned)
  const triggerMaximized = () => setMaximized(!maximized)

  return (
    <a.div className="panel" style={props.style}>
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
        >
          <Icon type="double-right" />
        </a.div>
      </div>
    </a.div>
  )
}

export default Panel
