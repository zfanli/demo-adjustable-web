import { createStore } from 'redux'
import { State, BaseAction } from './type'
import { calculatePositions } from './utils'
import { SET_SIZE, SET_DRAGGING_POSITION } from './actions'
import { locales } from './locales'
import config from './config.json'

// define default locale if does not exist
const lang: string = config.defaultLang ? config.defaultLang : 'en'

// Hold margin.
const { margin, headerHeight, footerHeight } = config
// Calculate default size.
const defaultSize = {
  width: window.innerWidth - margin,
  height: window.innerHeight - headerHeight - footerHeight - margin,
}

/**
 * Create initial state
 */
const initState: State = {
  locale: locales[lang],
  panelKeys: config.panelKeys,
  margin: margin,
  contentBoxSize: defaultSize,
  flatPanels: calculatePositions(defaultSize, margin, config.panelKeys),
  shadowSizeWhileDragging: config.shadowSizeWhileDragging,
}

// Alias.
const assign = Object.assign

/**
 * Reducers.
 */
function reducer(state = initState, action: BaseAction): State {
  switch (action.type) {
    // For handle window resize.
    case SET_SIZE:
      const contentBoxSize = action.payload.size
      const flatPanels = calculatePositions(
        contentBoxSize,
        state.margin,
        state.panelKeys
      )
      return assign(state, { contentBoxSize, flatPanels })

    // For handle panel dragging.
    case SET_DRAGGING_POSITION:
      const index = action.payload.index
      if (typeof index !== 'undefined') {
        const targetPanel = state.flatPanels[index]
        if (targetPanel) {
          // Save temp position when does not exist.
          // Temp position is for store last position,
          // while dragging is happening,
          // it will need the last position to calculate the current position out.
          // The temp position should be set to `null` if dragging is end.
          // Because when next dragging is happening,
          // the temp position is expect to be null to initialize with target panel's position.
          if (!targetPanel.tempLeft || !targetPanel.tempTop) {
            targetPanel.tempLeft = targetPanel.left
            targetPanel.tempTop = targetPanel.top
          }

          // Calculate new position.
          // Always calculate the position with temp position,
          // to avoid unexpected motion.
          const p = action.payload.position
          targetPanel.left = targetPanel.tempLeft + p[0]
          targetPanel.top = targetPanel.tempTop + p[1]

          // Make a copy of flatPanels.
          const flatPanels = state.flatPanels.slice()
          // Set moving panel.
          flatPanels[index] = targetPanel

          // Reset temp position when moving end.
          if (!action.payload.moving) {
            targetPanel.tempLeft = null
            targetPanel.tempTop = null
          }

          return assign(state, { flatPanels })
        }
      }
      return state

    default:
      return state
  }
}

// export store
export default createStore(reducer)
