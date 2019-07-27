import {
  State,
  BaseAction,
  SingleReducer,
  PanelWithPosition,
  Size,
} from '../type'
import { HANDLE_INITIAL_PANELS } from '../actions'
import { mapToPanels, getCurrentPositions } from '../utils'
import handleWindowResize from './handleWindowResize'
import { handleWindowResize as createResizeAction } from '../actions'

const handleInitialPanels = (state: State, action: BaseAction): State => {
  let panels = action.payload.panels as PanelWithPosition[]
  let size = action.payload.size as Size

  if (panels.length !== 5) {
    const { margin, headerHeight, footerHeight } = state.settings
    const defaultSize = {
      width: window.innerWidth - state.settings.margin,
      height: window.innerHeight - headerHeight - footerHeight - margin,
    }
    panels = getCurrentPositions(defaultSize, margin, state.panelKeys)
  }

  // Merge to store.
  const tempState = Object.assign({}, state, {
    panels: mapToPanels(panels, state.panelKeys),
    order: state.settings.sortable ? panels : state.order,
  })

  return handleWindowResize[1](tempState, createResizeAction(size))
}

export default [HANDLE_INITIAL_PANELS, handleInitialPanels] as SingleReducer
