import React, { CSSProperties } from 'react'
import { animated as a } from 'react-spring'

interface Props {
  style: CSSProperties
  title: string
  children: any
}

const Panel: React.FC<Props> = (props: Props) => {
  return (
    <a.div className="panel" style={props.style}>
      <header className="panel-header">
        <div className="panel-title">{props.title}</div>
      </header>
      {props.children}
    </a.div>
  )
}

export default Panel
