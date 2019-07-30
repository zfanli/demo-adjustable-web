import { cloneDeep } from 'lodash'
import { State, BaseAction, SingleReducer } from '../type'
import { HANDLE_PANEL_DRAGGING } from '../actions'
import { mapToPanels } from '../utils'
import { setPanels } from './utils'

const handlePanelDragging = (state: State, action: BaseAction): State => {
  // Get the target index.
  const draggingTargetIndex = action.payload.index
  if (typeof draggingTargetIndex !== 'undefined') {
    const targetPanel = cloneDeep(state.panels)[draggingTargetIndex]
    if (targetPanel) {
      // Save temp position if not exist.
      // The temp position is for store last position.
      // The last position will be needed to calculate the current position
      // out. The temp position should be set to `null` at the end of drag.
      if (!targetPanel.tempLeft || !targetPanel.tempTop) {
        targetPanel.tempLeft = targetPanel.left
        targetPanel.tempTop = targetPanel.top
      }

      // Calculate new position.
      // Always calculate the position with temp position,
      // to avoid unexpected position changes.
      const offset = action.payload.offset
      const resultLeft = targetPanel.tempLeft + offset[0]
      const resultTop = targetPanel.tempTop + offset[1]
      const maxLeft = state.settings.containerSize.width - targetPanel.width
      const minLeft = state.settings.margin
      const maxTop = state.settings.containerSize.height - targetPanel.height
      const minTop = state.settings.margin

      targetPanel.left =
        resultLeft < minLeft
          ? minLeft
          : resultLeft > maxLeft
          ? maxLeft
          : resultLeft
      targetPanel.top =
        resultTop < minTop ? minTop : resultTop > maxTop ? maxTop : resultTop

      const moving = action.payload.moving
      const sortable = state.settings.sortable

      // Make a copy of panels.
      let panels = cloneDeep(state.panels)

      // Reset temp position when moving end.
      if (!moving) {
        targetPanel.tempLeft = null
        targetPanel.tempTop = null
      }

      // Set panels.
      panels[draggingTargetIndex] = targetPanel

      // Reset position in sortable mode for temporarily
      if (!moving && sortable) {
        panels = mapToPanels(state.order, state.panelKeys)
      }

      if (!moving && !sortable) {
        // Save panels to server.
        setPanels(panels, sortable)
      }

      // Merge to store.
      return Object.assign({}, state, {
        panels,
        animationIndex: draggingTargetIndex,
        isDraggingDown: moving,
      })
    }
  }
  return state
}

export default [HANDLE_PANEL_DRAGGING, handlePanelDragging] as SingleReducer
