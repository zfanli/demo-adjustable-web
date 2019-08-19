import React, { CSSProperties, useState, useEffect, MouseEvent } from 'react'
import { FrameSize } from '../type'

import config from '../config/config.json'

const panelFrameBorderWidth = config.panelFrameBorderWidth as number

// Constants.
const Y1 = 'Y1'
const Y2 = 'Y2'
const X = 'X'

interface Props {
  size: FrameSize
  margin: number
}

const PanelFrame: React.FC<Props> = props => {
  const { size, margin } = props

  const [trigger, setTrigger] = useState('')

  useEffect(() => {
    if (trigger === X) {
      // Bind event listeners.
    } else if (trigger === Y1) {
      // Do something
    } else if (trigger === Y2) {
      // Do something
    } else {
      // Do nothing
      return
    }

    return function cleanup() {
      // Do some clean up things.
    }
  }, [trigger])

  const handleTrigger = (flag: string) => (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setTrigger(flag)
  }

  const sum = (a: number, b: number) => a + b

  const commonStyle: CSSProperties = {
    border: `${panelFrameBorderWidth}px solid red`,
    // For test only.
    zIndex: 999,
  }

  const stylingY = (i: number): CSSProperties => ({
    ...commonStyle,
    top: `${margin}px`,
    height: `${size.row.reduce(sum) - margin}px`,
    left: `${size.col.slice(0, i).reduce(sum) +
      margin / 2 -
      panelFrameBorderWidth}px`,
  })

  return (
    <div className="panel-frame">
      <div
        style={{
          ...commonStyle,
          left: `${margin}px`,
          width: `${size.col.reduce(sum) - margin}px`,
          top: `${size.row[0] + margin / 2 - panelFrameBorderWidth}px`,
        }}
        onClick={handleTrigger(X)}
        className="panel-frame-border panel-frame-x"
      />
      <div
        style={{
          ...stylingY(1),
        }}
        onClick={handleTrigger(Y1)}
        className="panel-frame-border panel-frame-y1"
      />
      <div
        style={{
          ...stylingY(2),
        }}
        onClick={handleTrigger(Y2)}
        className="panel-frame-border panel-frame-y2"
      />
    </div>
  )
}

export default PanelFrame
