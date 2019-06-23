import { createStore } from 'redux'
import { range } from 'lodash'
import { State, BaseAction, ExtendSize, Size } from './type'
import { calculateInitialPanelSize } from './utils'
import { SET_SIZE, SET_FLAT_PANELS } from './actions'
import { locales } from './locales'
import config from './config.json'

// define default locale if does not exist
const lang: string = config.defaultLang ? config.defaultLang : 'en'

// Hold margin.
const margin = config.margin
// Calculate default size.
const defaultSize = {
  width: window.innerWidth - config.margin,
  height:
    window.innerHeight -
    config.headerHeight -
    config.footerHeight -
    config.margin,
}

/**
 * Calculate panel size,
 * 5 panels in total, list in a 2x3 grid,
 * 4 of them are the same size, rest 1 is double size (height only),
 * just like: [<normal>, <normal>, <large>, <normal>, <normal>].
 *
 * Layout as:
 * ```
 * <normal1>  <normal2>  <large3 part1>
 * <normal4>  <normal5>  <large3 part2>
 * ```
 */
function getAllPanelSizes(windowSize: Size, margin: number): ExtendSize[] {
  return range(5).map((_, i) => {
    // Position of the largest one
    if (i === 2) {
      let p = calculateInitialPanelSize(windowSize, margin)
      // Double the height
      p.maxHeight = p.maxHeight * 2
      p.height = p.maxHeight - margin
      return p
    } else {
      return calculateInitialPanelSize(windowSize, margin)
    }
  })
}

// Initialize.
const initialPanels = getAllPanelSizes(defaultSize, margin)

/**
 * Create initial state
 */
const initState: State = {
  locale: locales[lang],
  panelKeys: config.panelKeys,
  margin: margin,
  contentBoxSize: defaultSize,
  panelSizes: initialPanels,
  flatPanels: [],
  shadowSizeWhileDragging: config.shadowSizeWhileDragging,
}

// Alias.
const assign = Object.assign

/**
 * Reducers.
 */
function reducer(state = initState, action: BaseAction): State {
  switch (action.type) {
    case SET_SIZE:
      const contentBoxSize = action.payload.size
      const panelSizes = getAllPanelSizes(contentBoxSize, state.margin)
      return assign(state, { contentBoxSize, panelSizes })

    case SET_FLAT_PANELS:
      const flatPanels = action.payload.panels
      return assign(state, { flatPanels })

    default:
      return state
  }
}

// export store
export default createStore(reducer)
