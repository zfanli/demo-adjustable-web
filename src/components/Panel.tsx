import React, { CSSProperties, useState } from 'react'
import { Icon, Empty } from 'antd'
import { animated as a } from 'react-spring'

interface Props {
  style: CSSProperties
  title: string
  children: any
  bind: {}
}

const Panel: React.FC<Props> = (props: Props) => {
  const [collapsed, setCollapsed] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [maximized, setMaximized] = useState(false)

  const triggerCollapsed = () => setCollapsed(!collapsed)
  const triggerPinned = () => setPinned(!pinned)
  const triggerMaximized = () => setMaximized(!maximized)

  return (
    <a.div className="panel" style={props.style}>
      <header className="panel-header">
        <div className="panel-title" {...props.bind}>
          {props.title}
        </div>
        <div className="panel-buttons">
          <button onClick={triggerCollapsed}>
            {collapsed ? (
              <Icon type="vertical-align-bottom" />
            ) : (
              <Icon type="vertical-align-top" />
            )}
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
      </div>
    </a.div>
  )
}

export default Panel
