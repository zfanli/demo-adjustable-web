import { cloneDeep, debounce } from 'lodash'
import { State, BaseAction, SingleReducer } from '../type'
import { HANDLE_PANEL_RESIZE } from '../actions'
import { setPanels } from './utils'

// Control the times of api calls.
const handleSetPanels = debounce(
  (panels, sortable) => setPanels(panels, sortable),
  200,
  { leading: false, trailing: true }
)

const handlePanelResize = (state: State, action: BaseAction): State => {
  const panelKey = action.payload.key
  const [width, height, left, top] = action.payload.size
  const forPanelResizeUse = cloneDeep(state.panels)
  forPanelResizeUse.forEach(p => {
    if (p.key === panelKey) {
      p.width = width
      p.height = height
      p.left = left
      p.top = top
    }
  })

  // Save panels to server.
  handleSetPanels(forPanelResizeUse, state.settings.sortable)

  return Object.assign({}, state, { panels: forPanelResizeUse })
}

export default [HANDLE_PANEL_RESIZE, handlePanelResize] as SingleReducer
