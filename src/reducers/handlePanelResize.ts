import { cloneDeep } from 'lodash'
import { State, BaseAction, SingleReducer } from '../type'
import { HANDLE_PANEL_RESIZE } from '../actions'

const handlePanelResize = (state: State, action: BaseAction): State => {
  const panelKey = action.payload.key
  const [resizeWidth, resizeHeight] = action.payload.size
  const forPanelResizeUse = cloneDeep(state.panels)
  forPanelResizeUse.forEach(p => {
    if (p.key === panelKey) {
      p.width = resizeWidth
      p.height = resizeHeight
    }
  })
  return Object.assign({}, state, { panels: forPanelResizeUse })
}

export default [HANDLE_PANEL_RESIZE, handlePanelResize] as SingleReducer
