import { cloneDeep } from 'lodash'
import { HANDLE_PANEL_MINIMIZE } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'
import { mapToPanels } from '../utils'

const handlePanelMinimize = (state: State, action: BaseAction): State => {
  const minimizeKey = state.panelKeys[action.payload.index]
  const minimizePanels = state.settings.sortable
    ? cloneDeep(state.order)
    : cloneDeep(state.panels)
  const minimizeTarget = minimizePanels.find(p => p.key === minimizeKey)
  if (minimizeTarget) {
    const minimizeTabs = cloneDeep(state.tabs)

    const { width, height, left, top } = minimizeTarget

    minimizeTarget.tempWidth = width
    minimizeTarget.tempHeight = height
    minimizeTarget.tempLeft = left
    minimizeTarget.tempTop = top
    minimizeTarget.top = height + top
    minimizeTarget.left = width / 2 + left
    minimizeTarget.height = 0
    minimizeTarget.width = 0

    // if (state.settings.sortable) {
    minimizeTabs[minimizeTarget.key] = true
    // }

    if (state.settings.sortable) {
      const minimizedIndex = state.order.findIndex(p => p.key === minimizeKey)

      const nearPanels = [
        state.order[minimizedIndex - 1] && state.order[minimizedIndex - 1].key,
        state.order[minimizedIndex + 1] && state.order[minimizedIndex + 1].key,
      ]

      minimizePanels.forEach(p => {
        if (nearPanels.includes(p.key) && p.left === minimizeTarget.tempLeft) {
          if (minimizeTarget.tempTop) {
            p.top =
              p.top < minimizeTarget.tempTop ? p.top : minimizeTarget.tempTop
            p.height = p.height * 2 + state.settings.margin
          }
        }
      })
    }

    return Object.assign({}, state, {
      panels: state.settings.sortable
        ? mapToPanels(minimizePanels, state.panelKeys)
        : minimizePanels,
      order: state.settings.sortable ? minimizePanels : state.order,
      tabs: minimizeTabs,
    })
  }
  return state
}

export default [HANDLE_PANEL_MINIMIZE, handlePanelMinimize] as SingleReducer
