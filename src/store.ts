import { createStore } from 'redux'
import { State, BaseAction } from './type'
import {
  getCurrentPositions,
  handleSizeChange,
  getCookie,
  setCookie,
  handleReset,
} from './utils'
import {
  SET_SIZE,
  SET_DRAGGING_POSITION,
  SET_LOCALE,
  SET_SORTABLE,
  RESET_PANELS_POSITION,
} from './actions'
import { locales } from './locales'
import configFile from './config.json'
import { cloneDeep } from 'lodash'

// ----------------------------------------------------------------------------
// --------------------------- START SECTION ----------------------------------
// Preparation.

// Cast config to any.
const config: any = configFile as any
// define default locale if does not exist
let lang: string = config.defaultLang ? config.defaultLang : 'en'
// Hold margin.
const { margin, headerHeight, footerHeight } = config
// Calculate default size.
const defaultSize = {
  width: window.innerWidth - margin,
  height: window.innerHeight - headerHeight - footerHeight - margin,
}
const initialPanels = getCurrentPositions(defaultSize, margin, config.panelKeys)

// ---------------------------- END SECTION -----------------------------------
// ----------------------------------------------------------------------------
// --------------------------- START SECTION ----------------------------------
// Retrieve data from cookies.

// Get data from cookies.
const langFromCookie = getCookie('lang')

// Set data if exists.
if (langFromCookie) lang = langFromCookie

// Set cookies if not exists.
if (!langFromCookie) setCookie('lang', lang)

// ---------------------------- END SECTION -----------------------------------
// ----------------------------------------------------------------------------
// --------------------------- START SECTION ----------------------------------
// Create initial state.

export const initState: State = {
  lang,
  locale: locales[lang],
  panelKeys: config.panelKeys,
  margin,
  containerSize: defaultSize,
  panels: initialPanels,
  order: cloneDeep(initialPanels),
  shadowSizeWhileDragging: config.shadowSizeWhileDragging,
  sortable: true,
}

// ---------------------------- END SECTION -----------------------------------
// ----------------------------------------------------------------------------
// --------------------------- START SECTION ----------------------------------
// Packaging reducers.

// Alias.
const assign = Object.assign

// Reducers.
export function reducer(state = initState, action: BaseAction): State {
  switch (action.type) {
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // For handle window resize.

    case SET_SIZE:
      const containerSize = action.payload.size
      // Change relative positions and sizes.
      const [resizePanels, resizeOrder] = handleSizeChange(
        state.panels,
        state.order,
        containerSize,
        state.containerSize,
        state.margin,
        state.sortable
      )
      return assign(state, {
        containerSize,
        panels: resizePanels,
        order: resizeOrder,
      })

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // For handle panel dragging.

    case SET_DRAGGING_POSITION:
      const index = action.payload.index
      if (typeof index !== 'undefined') {
        const targetPanel = cloneDeep(state.panels)[index]
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

          const moving = action.payload.moving

          // Reset position in sortable mode for temporarily
          if (!moving && state.sortable) {
            targetPanel.left = targetPanel.tempLeft
            targetPanel.top = targetPanel.tempTop
          }

          // Reset temp position when moving end.
          if (!moving) {
            targetPanel.tempLeft = null
            targetPanel.tempTop = null
          }

          // Make a copy of panels.
          const panels = cloneDeep(state.panels)
          // Set panel's motion.
          panels[index] = targetPanel

          return assign(state, {
            panels,
            animationIndex: index,
            isDraggingDown: moving,
          })
        }
      }
      return state

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // Change locale.

    case SET_LOCALE:
      const locale = action.payload.locale
      setCookie('lang', locale)
      return assign(state, {
        locale: locales[locale],
        lang: locale,
      })

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // Change sortable.

    case SET_SORTABLE:
      const sortable = action.payload.sortable

      // State changes from un-sortable to sortable.
      // All panels should reset their position,
      // and store current position as a backup for further use.
      if (sortable) {
        return assign(state, {
          sortable,
          panels: getCurrentPositions(
            state.containerSize,
            state.margin,
            state.panelKeys
          ),
          panelsBackup: cloneDeep(state.panels),
        })
      } else {
        // State changes from sortable to un-sortable.
        // Use backup position if does exist.
        const panelsBackup = state.panelsBackup
        return assign(state, {
          sortable,
          // Use backup if exists.
          panels: panelsBackup ? panelsBackup : state.panels,
          panelsBackup: null,
        })
      }

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // Reset panels position to initial state.

    case RESET_PANELS_POSITION:
      let [resetPanels, resetOrder] = handleReset(
        state.panels,
        state.order,
        state.containerSize,
        state.margin
      )

      return assign(state, {
        panels: resetPanels,
        order: resetOrder,
      })

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------

    default:
      return state
  }
}

// ---------------------------- END SECTION -----------------------------------
// ----------------------------------------------------------------------------

// export store
export default createStore(
  reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)
