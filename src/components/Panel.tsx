import React, { CSSProperties } from 'react'
import { useSelector } from 'react-redux'
import { animated as a } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { State } from '../type'

interface Props {
  style: CSSProperties
  title: string
  children: any
  trueKey: string
}

const Panel: React.FC<Props> = (props: Props) => {
  // Get info of this panel by true key that past by parent.
  const thisPanel = useSelector((state: State) =>
    state.flatPanels.find(p => p.key === props.trueKey)
  )

  const [[x, y], set] = React.useState([0, 0])
  const bind = useGesture({ onDrag: ({ local }) => set(local) })

  return (
    <a.div
      className="panel"
      style={{ ...props.style, transform: `translate3d(${x}px,${y}px,0)` }}
      {...bind()}
    >
      <header className="panel-header">
        <div className="panel-title">{props.title}</div>
      </header>
      <div>{thisPanel && Object.values(thisPanel).join(',')}</div>
    </a.div>
  )
}

export default Panel
