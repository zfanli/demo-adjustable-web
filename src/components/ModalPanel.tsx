import React, { useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGesture } from 'react-use-gesture'
import { Icon } from 'antd'
import {
  handleSwitchModalFlag,
  handleModalDragging,
  handleModalInitialize,
} from '../actions'
import Panel from './Panel'
import { Modal, Locale } from '../type'

interface Props {
  modal: Modal
  panelMinSize: { minHeight: number; minWidth: number }
  locale: Locale
  messageFlag: boolean
  messageLeaveDelay: number
}

const ModalPanel: React.FC<Props> = props => {
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    const height = window.innerHeight * 0.6
    const width = window.innerWidth * 0.6
    const top = window.innerHeight / 2 - height / 2
    const left = window.innerWidth / 2 - width / 2

    dispatch(handleModalInitialize(height, width, top, left))
  }, [dispatch])

  const { modal, panelMinSize, locale, messageFlag, messageLeaveDelay } = props

  const { height, width, top, left } = modal.panel

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
        style={{ ...styled, boxShadow: 'none' }}
        bind={bind()}
        modal={{ panel: modal.panel }}
        messageFlag={messageFlag}
        messageLeaveDelay={messageLeaveDelay}
        panelMinSize={panelMinSize}
        locale={locale}
        hideHeaderButton
        header={
          <button className="close" onClick={closeModal}>
            <Icon type="close" />
          </button>
        }
      >
        1
      </Panel>
      <div className="modal-mask" onClick={closeModal}></div>
    </>
  )
}

export default ModalPanel
