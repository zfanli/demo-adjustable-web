import { HANDLE_SWITCH_MODAL_FLAG } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleSwitchModalFlag = (state: State, action: BaseAction): State => {
  const flag = action.payload.flag
  return Object.assign({}, state, {
    modalVisible: flag,
  })
}

export default [
  HANDLE_SWITCH_MODAL_FLAG,
  handleSwitchModalFlag,
] as SingleReducer
