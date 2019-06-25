import { createStore } from 'redux'
import { State, BaseAction } from './type'
import {
  getCurrentPositions,
  handleSizeChange,
  getCookie,
  setCookie,
} from './utils'
import {
  SET_SIZE,
  SET_DRAGGING_POSITION,
  SET_LOCALE,
  SET_SORTABLE,
} from './actions'
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

// Create initial state.
const initState: State = {
  locale: locales[lang],
  panelKeys: config.panelKeys,
  margin: margin,
  contentBoxSize: defaultSize,
  flatPanels: getCurrentPositions(defaultSize, margin, config.panelKeys),
  shadowSizeWhileDragging: config.shadowSizeWhileDragging,
  sortable: true,
}

// ----------------------------------------------------------------------------
// --------------------------- START SECTION ----------------------------------
// Retrieve data from cookies.

// Get data from cookies.
const langFromCookie = getCookie('lang')

// Set data if exists.
if (langFromCookie) initState.locale = locales[langFromCookie]

// Set cookies if not exists.
if (!langFromCookie) setCookie('lang', lang)

// ---------------------------- END SECTION -----------------------------------
// ----------------------------------------------------------------------------

// Alias.
const assign = Object.assign

// Reducers.
function reducer(state = initState, action: BaseAction): State {
  switch (action.type) {
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // For handle window resize.

    case SET_SIZE:
      const contentBoxSize = action.payload.size
      // Change relative positions and sizes.
      const flatPanels = handleSizeChange(
        state.flatPanels,
        contentBoxSize,
        state.contentBoxSize,
        state.margin
      )
      return assign(state, { contentBoxSize, flatPanels })

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // For handle panel dragging.

    case SET_DRAGGING_POSITION:
      const index = action.payload.index
      if (typeof index !== 'undefined') {
        const targetPanel = state.flatPanels[index]
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
          const p = action.payload.position
          targetPanel.left = targetPanel.tempLeft + p[0]
          targetPanel.top = targetPanel.tempTop + p[1]

          // Make a copy of flatPanels.
          const flatPanels = state.flatPanels.slice()
          // Set panel's motion.
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

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // Change locale.

    case SET_LOCALE:
      const locale = locales[action.payload.locale]
      setCookie('lang', action.payload.locale)
      return assign(state, { locale })

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // Change sortable.

    case SET_SORTABLE:
      const sortable = action.payload.sortable
      setCookie('sortable', sortable)
      return assign(state, { sortable })

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------

    default:
      return state
  }
}

// export store
export default createStore(reducer)
