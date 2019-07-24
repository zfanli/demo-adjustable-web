import { SET_MESSAGE_FLAG } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleSwitchMessageFlag = (state: State, action: BaseAction): State => {
  const messageFlag = action.payload.messageFlag
  return Object.assign({}, state, {
    settings: { ...state.settings, messageFlag },
  })
}

export default [SET_MESSAGE_FLAG, handleSwitchMessageFlag] as SingleReducer
