import React, { CSSProperties, useState } from 'react'
import { useSelector } from 'react-redux'
import { animated as a, useSpring, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { State } from '../type'

interface Props {
  style: CSSProperties
  title: string
  children: any
  trueKey: string
  bind: {}
}

const Panel: React.FC<Props> = (props: Props) => {
  // Get info of this panel by true key that past by parent.
  const thisPanel = useSelector((state: State) =>
    state.flatPanels.find(p => p.key === props.trueKey)
  )
  // Handle motions.
  const [[x1, y1], setLocal] = useState([0, 0])
  const [down, setDown] = useState(false)
  const bind = useGesture(
    {
      onDrag: ({ event, last, local, down }) => {
        // Expose mouse points.
        setLocal(local)
        // Expose down state.
        setDown(down)
        // Prevent text selection during dragging.
        !last && event && event.preventDefault()
      },
    },
    { event: { capture: true, passive: false } }
  )

  const shadowSize = useSelector(
    (state: State) => state.shadowSizeWhileDragging
  )

  const { s2, shadow, x2, y2 } = useSpring({
    s2: down ? 1.05 : 1,
    shadow: down ? `0 0 ${shadowSize}px 0 #999` : '0 0 5px 0 #ddd',
    x2: thisPanel && thisPanel.left + x1,
    y2: thisPanel && thisPanel.top + y1,
    immediate: name => down && (name === 'x2' || name === 'y2'),
    config: { mass: 1, tension: 1000, friction: 30 },
  })

  return (
    <a.div
      className="panel"
      style={{
        ...props.style,
        transform: interpolate([s2], s => ` scale(${s})`),
        top: interpolate([y2], y => `${y}px`),
        left: interpolate([x2], x => `${x}px`),
        boxShadow: shadow,
      }}
    >
      <header className="panel-header" {...bind()}>
        <div className="panel-title">{props.title}</div>
      </header>
      {props.children}
    </a.div>
  )
}

export default Panel
