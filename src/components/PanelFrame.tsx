import React, { CSSProperties, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { throttle } from 'lodash'
import { FrameSize } from '../type'
import {
  handleFrameResize,
  handleFrameResizeStart,
  handleFrameResizeEnd,
} from '../actions'

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

  const dispatch = useDispatch()

  const [trigger, setTrigger] = useState('')
  const [originXY, setOriginXY] = useState([0, 0])

  useEffect(() => {
    if (trigger !== '') {
      const handler = throttle((e: MouseEvent) => {
        const disX = e.clientX - originXY[0]
        const disY = e.clientY - originXY[1]

        dispatch(handleFrameResize(trigger, [disX, disY]))
      }, 40)

      const off = () => {
        setTrigger('')
        dispatch(handleFrameResizeEnd())
      }

      window.addEventListener('mousemove', handler)
      window.addEventListener('mouseup', off)

      return function cleanup() {
        window.removeEventListener('mousemove', handler)
        window.removeEventListener('mouseup', off)
      }
    } else {
      // Do nothing
      return
    }
  }, [trigger, setTrigger, dispatch, originXY])

  const handleTrigger = (flag: string) => (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault()
    setTrigger(flag)
    setOriginXY([e.clientX, e.clientY])
    dispatch(handleFrameResizeStart())
  }

  const commonStyle: CSSProperties = {
    border: `${margin / 2}px solid red`,
    // For test only.
    zIndex: 999,
  }

  const floor = (n: number) => Math.floor(n)

  const stylingY = (i: number): CSSProperties => ({
    ...commonStyle,
    top: `${margin}px`,
    height: `${floor(size.row[size.row.length - 1] - margin)}px`,
    left: `${floor(size.col[i - 1])}px`,
    display: size.row[i - 1] === size.row[i] ? 'none' : 'block',
  })

  return (
    <div className="panel-frame">
      <div
        style={{
          ...commonStyle,
          left: `${margin}px`,
          width: `${floor(size.col[size.col.length - 1] - margin)}px`,
          top: `${floor(size.row[0])}px`,
        }}
        onMouseDown={handleTrigger(X)}
        className="panel-frame-border panel-frame-x"
      />
      <div
        style={{
          ...stylingY(1),
        }}
        onMouseDown={handleTrigger(Y1)}
        className="panel-frame-border panel-frame-y1"
      />
      <div
        style={{
          ...stylingY(2),
        }}
        onMouseDown={handleTrigger(Y2)}
        className="panel-frame-border panel-frame-y2"
      />
    </div>
  )
}

export default PanelFrame
