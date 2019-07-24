import { cloneDeep } from 'lodash'
import { State, BaseAction, SingleReducer } from '../type'
import { HANDLE_RESET_ACTION } from '../actions'
import { getCurrentPositions } from '../utils'

const handlePanelReset = (state: State, action: BaseAction): State => {
  // Calculate initial position.
  const resetPanels = getCurrentPositions(
    state.settings.containerSize,
    state.settings.margin,
    state.panelKeys
  )
  // Merge to store.
  return Object.assign({}, state, {
    panels: resetPanels,
    order: cloneDeep(resetPanels),
  })
}

export default [HANDLE_RESET_ACTION, handlePanelReset] as SingleReducer
