import { State, BaseAction, SingleReducer } from '../type'
import { HANDLE_PANEL_RESORT } from '../actions'
import { handleResort } from '../utils'

const handlePanelResort = (state: State, action: BaseAction): State => {
  // Calculate next panels and order.
  const [resortPanels, resortOrder] = handleResort(
    state.panels,
    state.order,
    action.payload.position,
    action.payload.index,
    action.payload.moving,
    state.settings.margin,
    state.settings.containerSize,
    state.settings.headerHeight
  )
  // Merge to store.
  return Object.assign({}, state, {
    panels: resortPanels,
    order: resortOrder,
  })
}

export default [HANDLE_PANEL_RESORT, handlePanelResort] as SingleReducer
