import { cloneDeep, range } from 'lodash'
import { getCurrentPositions, getCookie, setCookie } from './utils'
import { locales } from './locales'
import configFile from './config.json'
import { State } from './type'

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
    messageLeaveDelay: config.messageLeaveDelay,
    messageFlag: true,
    sstFlag: 'file',
  },
  watsonSpeech: {
    defaultKeywords: config.watsonSpeech.defaultKeywords,
    resultKeywords: [],
    accessTokenURL: config.watsonSpeech.accessTokenURL,
    conversation: [],
  },
  panelKeys: config.panelKeys,
  panels: initialPanels,
  order: cloneDeep(initialPanels),
  zIndices: range(5),
  tabs: {},
  pinned: [],
}

// ---------------------------- END SECTION -----------------------------------
// ----------------------------------------------------------------------------
