import { HANDLE_SWITCH_USER } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleSwitchUser = (state: State, action: BaseAction): State => {
  const userId = action.payload.id
  return Object.assign({}, state, {
    userId,
    reloadFlag: {},
    watsonSpeech: {
      ...state.watsonSpeech,
      resultKeywords: [],
      conversation: [],
    },
  })
}

export default [HANDLE_SWITCH_USER, handleSwitchUser] as SingleReducer
