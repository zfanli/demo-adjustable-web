import { State, BaseAction, SingleReducer } from '../type'
import { HANDLE_PANEL_PINNED } from '../actions'

const handlePanelPinned = (state: State, action: BaseAction): State => {
  const pinnedKey = state.panels[action.payload.index].key
  const pinnedArray = state.pinned.slice()
  if (pinnedArray.includes(pinnedKey)) {
    pinnedArray.splice(pinnedArray.findIndex(k => k === pinnedKey), 1)
  } else {
    pinnedArray.push(pinnedKey)
  }
  return Object.assign({}, state, { pinned: pinnedArray })
}

export default [HANDLE_PANEL_PINNED, handlePanelPinned] as SingleReducer
