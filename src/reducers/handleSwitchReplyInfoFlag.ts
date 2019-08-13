import { HANDLE_SWITCH_REPLY_INPUT_FLAG } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleSwitchReplyInfoFlag = (state: State, action: BaseAction): State => {
  const replyInputFlag = action.payload.flag
  return Object.assign({}, state, {
    settings: {
      ...state.settings,
      replyInputFlag,
    },
  })
}

export default [
  HANDLE_SWITCH_REPLY_INPUT_FLAG,
  handleSwitchReplyInfoFlag,
] as SingleReducer
