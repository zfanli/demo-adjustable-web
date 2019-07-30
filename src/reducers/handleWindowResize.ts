import { State, BaseAction, SingleReducer, PanelWithPosition } from '../type'
import { HANDLE_WINDOW_RESIZE } from '../actions'
import {
  handleSizeChangeForSortable,
  handleSizeChangeForUnsortable,
} from '../utils'

const handleWindowResize = (state: State, action: BaseAction): State => {
  const containerSize = action.payload.size
  // Change relative positions and sizes.
  const panels = state.settings.sortable
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

  panels.forEach((panels: PanelWithPosition[]) =>
    panels.forEach(p => {
      const maxLeft = state.settings.containerSize.width - p.width
      const minLeft = state.settings.margin
      const maxTop = state.settings.containerSize.height - p.height
      const minTop = state.settings.margin

      p.left = p.left < minLeft ? minLeft : p.left > maxLeft ? maxLeft : p.left
      p.top = p.top < minTop ? minTop : p.top > maxTop ? maxTop : p.top
    })
  )

  // const tempSettings
  return Object.assign({}, state, {
    settings: {
      ...state.settings,
      containerSize,
    },
    panels: panels[0],
    order: panels[1],
  })
}

export default [HANDLE_WINDOW_RESIZE, handleWindowResize] as SingleReducer
