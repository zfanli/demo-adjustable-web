import { HANDLE_SWITCH_MODAL_FLAG } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleSwitchModalFlag = (state: State, action: BaseAction): State => {
  const flag = action.payload.flag
  const title = action.payload.title
  return Object.assign({}, state, {
    modalVisible: flag,
    modal: {
      ...state.modal,
      title,
    },
  })
}

export default [
  HANDLE_SWITCH_MODAL_FLAG,
  handleSwitchModalFlag,
] as SingleReducer
