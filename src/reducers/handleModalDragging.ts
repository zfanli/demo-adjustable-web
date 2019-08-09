import { HANDLE_MODAL_DRAGGING } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'
import { cloneDeep } from 'lodash'

const handleModalDragging = (state: State, action: BaseAction): State => {
  const { offset, moving } = action.payload as {
    offset: number[]
    moving: boolean
  }

  const panel = cloneDeep(state.modal.panel)
  if (!panel.tempLeft || !panel.tempTop) {
    panel.tempLeft = panel.left
    panel.tempTop = panel.top
  }

  panel.left = panel.tempLeft + offset[0]
  panel.top = panel.tempTop + offset[1]

  if (!moving) {
    panel.tempLeft = undefined
    panel.tempTop = undefined
  }

  return Object.assign({}, state, {
    modal: {
      ...state.modal,
      panel,
    },
  })
}

export default [HANDLE_MODAL_DRAGGING, handleModalDragging] as SingleReducer
