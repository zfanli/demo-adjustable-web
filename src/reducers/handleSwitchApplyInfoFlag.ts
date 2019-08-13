import { HANDLE_SWITCH_APPLY_INPUT_FLAG } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleSwitchApplyInfoFlag = (state: State, action: BaseAction): State => {
  const applyInputFlag = action.payload.flag
  return Object.assign({}, state, {
    settings: {
      ...state.settings,
      applyInputFlag,
    },
  })
}

export default [
  HANDLE_SWITCH_APPLY_INPUT_FLAG,
  handleSwitchApplyInfoFlag,
] as SingleReducer
