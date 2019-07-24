import { State, BaseAction, SingleReducer } from '../type'
import { HANDLE_WINDOW_RESIZE } from '../actions'
import {
  handleSizeChangeForSortable,
  handleSizeChangeForUnsortable,
} from '../utils'

const handleWindowResize = (state: State, action: BaseAction): State => {
  const containerSize = action.payload.size
  // Change relative positions and sizes.
  const [resizePanels, resizeOrder] = state.settings.sortable
    ? handleSizeChangeForSortable(
        state.panels,
        state.order,
        containerSize,
        state.settings.margin,
        Object.keys(state.tabs).filter(k => state.tabs[k])
      )
    : handleSizeChangeForUnsortable(
        state.panels,
        state.order,
        containerSize,
        state.settings.containerSize
      )
  // const tempSettings
  return Object.assign({}, state, {
    settings: {
      ...state.settings,
      containerSize,
    },
    panels: resizePanels,
    order: resizeOrder,
  })
}

export default [HANDLE_WINDOW_RESIZE, handleWindowResize] as SingleReducer
