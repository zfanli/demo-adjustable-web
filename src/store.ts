import { createStore } from 'redux'
import { State, BaseAction } from './type'
import {
  getCurrentPositions,
  handleSizeChangeForSortable,
  getCookie,
  setCookie,
  mapToPanels,
  handleResort,
  handleSizeChangeForUnsortable,
} from './utils'
import {
  SET_SIZE,
  HANDLE_DRAGGING,
  SET_LOCALE,
  SET_SORTABLE,
  HANDLE_RESET_ACTION,
  HANDLE_RESORT_ACTION,
  SET_RESULT_KEYWORDS,
  SET_ACTIVE_PANEL,
  HANDLE_PANEL_RESIZE,
} from './actions'
import { locales } from './locales'
import configFile from './config.json'
import { cloneDeep, range } from 'lodash'

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
  settings: {
    lang,
    locale: locales[lang],
    margin,
    headerHeight: config.headerHeight,
    footerHeight: config.footerHeight,
    shadowSizeWhileDragging: config.shadowSizeWhileDragging,
    sortable: true,
    containerSize: defaultSize,
  },
  watsonSpeech: {
    defaultKeywords: config.watsonSpeech.defaultKeywords,
    resultKeywords: [],
    accessTokenURL: config.watsonSpeech.accessTokenURL,
  },
  panelKeys: config.panelKeys,
  panels: initialPanels,
  order: cloneDeep(initialPanels),
  zIndices: range(5),
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
      const [resizePanels, resizeOrder] = state.settings.sortable
        ? handleSizeChangeForSortable(
            state.panels,
            state.order,
            containerSize,
            state.settings.margin
          )
        : handleSizeChangeForUnsortable(
            state.panels,
            state.order,
            containerSize,
            state.settings.containerSize
          )
      // const tempSettings
      return assignWithNewObject(state, {
        settings: {
          ...state.settings,
          containerSize,
        },
        panels: resizePanels,
        order: resizeOrder,
      })

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // For handle panel dragging.

    case HANDLE_DRAGGING:
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
          targetPanel.left = targetPanel.tempLeft + offset[0]
          targetPanel.top = targetPanel.tempTop + offset[1]

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
            panels = mapToPanels(state.order, panels)
          }

          // Merge to store.
          return assignWithNewObject(state, {
            panels,
            animationIndex: draggingTargetIndex,
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
      // Calculate next panels and order.
      const [resortPanels, resortOrder] = handleResort(
        state.panels,
        state.order,
        action.payload.position,
        action.payload.index,
        action.payload.moving,
        state.settings.margin,
        state.settings.containerSize,
        state.settings.headerHeight
      )
      // Merge to store.
      return assignWithNewObject(state, {
        panels: resortPanels,
        order: resortOrder,
      })

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // Change locale.

    case SET_LOCALE:
      // Get the next lang.
      const locale = action.payload.locale
      // Store it into cookie.
      setCookie('lang', locale)
      // Merge to store.
      return assignWithNewObject(state, {
        settings: {
          ...state.settings,
          locale: locales[locale],
          lang: locale,
        },
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
          settings: {
            ...state.settings,
            sortable,
          },
          panels: mapToPanels(state.order, state.panels),
          panelsBackup: cloneDeep(state.panels),
        })
      } else {
        // State changes from sortable to un-sortable.
        // Use backup position if does exist.
        const panelsBackup = state.panelsBackup
        return assignWithNewObject(state, {
          settings: {
            ...state.settings,
            sortable,
          },
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
      // Calculate initial position.
      const resetPanels = getCurrentPositions(
        state.settings.containerSize,
        state.settings.margin,
        state.panelKeys
      )
      // Merge to store.
      return assignWithNewObject(state, {
        panels: resetPanels,
        order: cloneDeep(resetPanels),
      })

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // Reset panels position to initial state.

    case SET_RESULT_KEYWORDS:
      // Make a copy of watsonSpeech configs.
      const tempWatsonSpeech = cloneDeep(state.watsonSpeech)
      tempWatsonSpeech.resultKeywords = action.payload.resultKeywords
      console.log(action.payload.resultKeywords)
      // Merge to store.
      return assignWithNewObject(state, {
        watsonSpeech: tempWatsonSpeech,
      })

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // Handle active panel z-index.

    case SET_ACTIVE_PANEL:
      const activePanel = action.payload.index
      const activeIndex = state.zIndices[activePanel]
      // Reduce the z-index if it is greater than the target z-index.
      const zIndices = state.zIndices.map(z => (z > activeIndex ? z - 1 : z))
      // Set the target to be the biggest one.
      zIndices[activePanel] = 4
      // Merge to store.
      return assignWithNewObject(state, { zIndices })

    // ------------------------- END SECTION ----------------------------------
    // ------------------------------------------------------------------------
    // ------------------------ START SECTION ---------------------------------
    // Handle panel resize.

    case HANDLE_PANEL_RESIZE:
      const panelKey = action.payload.key
      const [resizeWidth, resizeHeight] = action.payload.size
      const forPanelResizeUse = cloneDeep(state.panels)
      forPanelResizeUse.forEach(p => {
        if (p.key === panelKey) {
          p.width = resizeWidth
          p.height = resizeHeight
        }
      })
      return assignWithNewObject(state, { panels: forPanelResizeUse })

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
