import { HANDLE_MODAL_INITIALIZE } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleModalInitialize = (state: State, action: BaseAction): State => {
  const { height, width, top, left } = action.payload as { [k: string]: number }
  return Object.assign({}, state, {
    modal: {
      ...state.modal,
      panel: {
        ...state.modal.panel,
        height,
        width,
        top,
        left,
      },
    },
  })
}

export default [HANDLE_MODAL_INITIALIZE, handleModalInitialize] as SingleReducer
