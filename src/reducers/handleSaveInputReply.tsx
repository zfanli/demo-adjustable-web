import { HANDLE_SAVE_INPUT_REPLY } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleSaveInputReply = (state: State, action: BaseAction): State => {
  const reply = action.payload.reply
  return Object.assign({}, state, {
    inputReplyHolder: reply,
  })
}

export default [HANDLE_SAVE_INPUT_REPLY, handleSaveInputReply] as SingleReducer
