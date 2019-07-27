import { State, BaseAction, SingleReducer, PanelWithPosition } from '../type'
import { HANDLE_INITIAL_UNSORTED_PANELS } from '../actions'

const handleInitialUnsortedPanels = (
  state: State,
  action: BaseAction
): State => {
  const panels = action.payload.panels as PanelWithPosition[]
  // Merge to store.
  return Object.assign({}, state, {
    panelsBackup: panels.length > 0 ? panels : null,
  })
}

export default [
  HANDLE_INITIAL_UNSORTED_PANELS,
  handleInitialUnsortedPanels,
] as SingleReducer
