import React from 'react'
import Panel from './Panel'
import { useDispatch } from 'react-redux'
import { handleSwitchModalFlag } from '../actions'

const ModalPanel: React.FC = () => {
  const maxHeight = window.innerHeight * 0.6
  const maxWidth = window.innerWidth * 0.6
  const top = window.innerHeight / 2 - maxHeight / 2
  const left = window.innerWidth / 2 - maxWidth / 2
  const styled: React.CSSProperties = {
    maxHeight,
    maxWidth,
    overflow: 'auto',
    position: 'absolute',
    height: maxHeight,
    width: maxWidth,
    zIndex: 9999,
    top,
    left,
  }

  const dispatch = useDispatch()

  const closeModal = () => dispatch(handleSwitchModalFlag(false))

  return (
    <>
      <Panel
        title="test modal"
        style={{ ...styled }}
        bind={{}}
        index={0}
        trueKey=""
        modal
      >
        1
      </Panel>
      <div className="modal-mask" onClick={closeModal}></div>
    </>
  )
}

export default ModalPanel
