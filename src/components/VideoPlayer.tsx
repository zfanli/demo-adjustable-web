import React, { CSSProperties, useRef, useEffect } from 'react'
import { useTransition, animated as a } from 'react-spring'
import { Icon } from 'antd'

interface Props {
  src: string
  visible: boolean
  close: () => void
}

const VideoPlayer: React.FC<Props> = props => {
  const { src, visible, close } = props

  const player = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (player.current) {
      player.current.focus()
    }
  })

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.keyCode === 27 && close()

    window.addEventListener('keydown', handleEsc)

    return function cleanup() {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [close])

  const outStyle: CSSProperties = {
    opacity: 0,
  }

  const inStyle: CSSProperties = {
    opacity: 1,
  }

  const transition = useTransition(visible, null, {
    from: outStyle,
    leave: outStyle,
    enter: inStyle,
    config: { duration: 100 },
  })

  const computedHeight = document.body.offsetHeight * 0.6
  const height = computedHeight > 720 ? 720 : computedHeight

  return (
    <>
      {transition.map(t =>
        t.item ? (
          <a.div key={t.key} style={t.props} className="video-player">
            <div className="video-wrapper">
              <video
                ref={player}
                className="video-js"
                src={src}
                controls
                autoPlay
                height={height}
              ></video>
              <div className="video-close" onClick={close}>
                <Icon type="close-circle" />
              </div>
            </div>
            <a.div className="mask" onClick={close} />
          </a.div>
        ) : null
      )}
    </>
  )
}

export default VideoPlayer
