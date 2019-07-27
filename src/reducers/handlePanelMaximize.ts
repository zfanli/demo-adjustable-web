import { cloneDeep } from 'lodash'
import { State, BaseAction, SingleReducer } from '../type'
import { HANDLE_PANEL_MAXIMIZE } from '../actions'
import { mapToPanels } from '../utils'

const handlePanelMaximize = (state: State, action: BaseAction): State => {
  const key = state.panelKeys[action.payload.index]
  const flag = action.payload.maximized
  const sortable = state.settings.sortable
  const panels = sortable ? cloneDeep(state.order) : cloneDeep(state.panels)
  const targetIndex = panels.findIndex(p => p.key === key)
  const target = panels[targetIndex]
  if (target) {
    const margin = state.settings.margin
    const size = state.settings.containerSize

    if (flag) {
      target.tempTop = target.top
      target.tempLeft = target.left
      target.tempHeight = target.height
      target.tempWidth = target.width

      target.top = margin
      target.left = margin
      target.width = size.width - margin * 2
      target.height = size.height - margin
    } else {
      const checkNumber = (s: any) => (s ? s : 0)
      target.top = checkNumber(target.tempTop)
      target.left = checkNumber(target.tempLeft)
      target.height = checkNumber(target.tempHeight) + margin
      target.width = checkNumber(target.tempWidth)
    }

    panels[targetIndex] = target

    return Object.assign({}, state, {
      panels: sortable ? mapToPanels(panels, state.panelKeys) : panels,
      order: sortable ? panels : state.order,
    })
  }
  return state
}

export default [HANDLE_PANEL_MAXIMIZE, handlePanelMaximize] as SingleReducer
