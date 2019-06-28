import { createStore } from 'redux'
import { State, BaseAction } from './type'
import {
  getCurrentPositions,
  handleSizeChange,
  getCookie,
  setCookie,
  mapToPanels,
  handleResort,
} from './utils'
import {
  SET_SIZE,
  HANDLE_DRAGGING,
  SET_LOCALE,
  SET_SORTABLE,
  HANDLE_RESET_ACTION,
  HANDLE_RESORT_ACTION,
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
  headerHeight: config.headerHeight,
  footerHeight: config.footerHeight,
}

// ---------------------------- END SECTION -----------------------------------
// ----------------------------------------------------------------------------
// --------------------------- START SECTION ----------------------------------
// Packaging reducers.

// Alias.
const assignWithNewObject = (...args: any[]) => Object.assign({}, ...args)

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
      return assignWithNewObject(state, {
        containerSize,
        panels: resizePanels,
        order: resizeOrder,
      })

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // For handle panel dragging.

    case HANDLE_DRAGGING:
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
          const offset = action.payload.offset
          targetPanel.left = targetPanel.tempLeft + offset[0]
          targetPanel.top = targetPanel.tempTop + offset[1]

          const moving = action.payload.moving
          const sortable = state.sortable

          // Make a copy of panels.
          let panels = cloneDeep(state.panels)

          // Reset temp position when moving end.
          if (!moving) {
            targetPanel.tempLeft = null
            targetPanel.tempTop = null
          }

          // Set panels.
          panels[index] = targetPanel

          // Reset position in sortable mode for temporarily
          if (!moving && sortable) {
            panels = mapToPanels(state.order, panels)
          }

          return assignWithNewObject(state, {
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
    // Handle resort.

    case HANDLE_RESORT_ACTION:
      const [resortPanels, resortOrder] = handleResort(
        state.panels,
        state.order,
        action.payload.position,
        action.payload.index,
        action.payload.moving,
        state.margin,
        state.containerSize,
        state.headerHeight
      )
      return assignWithNewObject(state, {
        panels: resortPanels,
        order: resortOrder,
      })

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // Change locale.

    case SET_LOCALE:
      const locale = action.payload.locale
      setCookie('lang', locale)
      return assignWithNewObject(state, {
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
        return assignWithNewObject(state, {
          sortable,
          panels: mapToPanels(state.order, state.panels),
          panelsBackup: cloneDeep(state.panels),
        })
      } else {
        // State changes from sortable to un-sortable.
        // Use backup position if does exist.
        const panelsBackup = state.panelsBackup
        return assignWithNewObject(state, {
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

    case HANDLE_RESET_ACTION:
      const resetPanels = getCurrentPositions(
        state.containerSize,
        state.margin,
        state.panelKeys
      )

      return assignWithNewObject(state, {
        panels: resetPanels,
        order: cloneDeep(resetPanels),
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
  reducer
  // (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
  //   (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)
