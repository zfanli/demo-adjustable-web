import React, { useLayoutEffect } from 'react'
import Panel from './Panel'
import { useDispatch, useSelector } from 'react-redux'
import {
  handleSwitchModalFlag,
  handleModalDragging,
  handleModalInitialize,
} from '../actions'
import { useGesture } from 'react-use-gesture'
import { State } from '../type'

const ModalPanel: React.FC = () => {
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    const height = window.innerHeight * 0.6
    const width = window.innerWidth * 0.6
    const top = window.innerHeight / 2 - height / 2
    const left = window.innerWidth / 2 - width / 2

    dispatch(handleModalInitialize(height, width, top, left))
  }, [dispatch])

  const { height, width, top, left } = useSelector(
    (state: State) => state.modal.panel
  )

  const styled: React.CSSProperties = {
    overflow: 'auto',
    position: 'absolute',
    height,
    width,
    zIndex: 9999,
    top,
    left,
  }

  const closeModal = () => dispatch(handleSwitchModalFlag(false))

  const bind = useGesture(
    ({ down, delta, last, event }) => {
      // Preventing text selection caused by dragging.
      !last && event && event.preventDefault()
      // Dispatch current position.
      dispatch(handleModalDragging(delta, down))
    },
    // Configure to enable operation on event directly.
    { event: { capture: true, passive: false } }
  )

  return (
    <>
      <Panel
        title="test modal"
        style={{ ...styled }}
        bind={bind()}
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
