import { HANDLE_SWITCH_SST_FLAG } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleSwitchSstFlag = (state: State, action: BaseAction): State => {
  const sstFlag = action.payload.sstFlag
  return Object.assign({}, state, {
    settings: { ...state.settings, sstFlag },
  })
}

export default [HANDLE_SWITCH_SST_FLAG, handleSwitchSstFlag] as SingleReducer
