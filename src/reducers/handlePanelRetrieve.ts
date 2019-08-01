import { cloneDeep } from 'lodash'
import { State, BaseAction, SingleReducer } from '../type'
import { mapToPanels } from '../utils'
import handleWindowResize from './handleWindowResize'
import {
  HANDLE_PANEL_RETRIEVE,
  handleWindowResize as createResizeAction,
} from '../actions'

const handlePanelRetrieve = (state: State, action: BaseAction): State => {
  const retrieveKey = state.panelKeys[action.payload.index]
  const retrievePanels = state.settings.sortable
    ? cloneDeep(state.order)
    : cloneDeep(state.panels)
  const retrieveTarget = retrievePanels.find(p => p.key === retrieveKey)

  if (retrieveTarget) {
    const retrieveTabs = cloneDeep(state.tabs)

    const {
      tempMinTop,
      tempMinLeft,
      tempMinWidth,
      tempMinHeight,
    } = retrieveTarget

    if (tempMinTop && tempMinLeft && tempMinWidth && tempMinHeight) {
      retrieveTarget.top = tempMinTop
      retrieveTarget.left = tempMinLeft
      retrieveTarget.width = tempMinWidth
      retrieveTarget.height = tempMinHeight
      retrieveTarget.tempMinTop = undefined
      retrieveTarget.tempMinLeft = undefined
      retrieveTarget.tempMinWidth = undefined
      retrieveTarget.tempMinHeight = undefined
    }

    // if (state.settings.sortable) {
    retrieveTabs[retrieveTarget.key] = false
    // }

    if (state.settings.sortable) {
      const retrieveIndex = state.order.findIndex(p => p.key === retrieveKey)

      const nearPanels = [
        state.order[retrieveIndex - 1] && state.order[retrieveIndex - 1].key,
        state.order[retrieveIndex + 1] && state.order[retrieveIndex + 1].key,
      ]

      retrievePanels.forEach(p => {
        if (
          nearPanels.includes(p.key) &&
          p.left === tempMinLeft &&
          tempMinHeight
        ) {
          p.top =
            tempMinTop === state.settings.margin
              ? tempMinTop + tempMinHeight + state.settings.margin
              : p.top
          p.height = tempMinHeight
        }
      })
    }

    const tempState = Object.assign({}, state, {
      panels: state.settings.sortable
        ? mapToPanels(retrievePanels, state.panelKeys)
        : retrievePanels,
      order: state.settings.sortable ? retrievePanels : state.order,
      tabs: retrieveTabs,
    })

    if (
      state.settings.sortable &&
      Object.keys(state.tabs).filter(k => state.tabs[k]).length === 1
    ) {
      return handleWindowResize[1](
        tempState,
        createResizeAction({
          height:
            window.innerHeight -
            state.settings.headerHeight -
            state.settings.footerHeight -
            state.settings.margin,
          width: window.innerWidth - state.settings.margin,
        })
      )
    }

    return tempState
  }
  return state
}

export default [HANDLE_PANEL_RETRIEVE, handlePanelRetrieve] as SingleReducer
