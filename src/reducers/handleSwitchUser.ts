import { HANDLE_SWITCH_USER } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleSwitchUser = (state: State, action: BaseAction): State => {
  const activeUser = action.payload.id
  return Object.assign({}, state, {
    activeUser,
    watsonSpeech: {
      ...state.watsonSpeech,
      resultKeywords: [],
      conversation: [],
    },
  })
}

export default [HANDLE_SWITCH_USER, handleSwitchUser] as SingleReducer
