import { cloneDeep, range } from 'lodash'
import { getCookie, setCookie } from '../utils'
import { locales } from '../locales'
import configFile from '../config.json'
import { State, PanelWithPosition } from '../type'

export default function(): State {
  // ----------------------------------------------------------------------------
  // --------------------------- START SECTION ----------------------------------
  // Preparation.

  // Fetch data from config.
  const {
    defaultLang,
    margin,
    headerHeight,
    footerHeight,
    shadowSizeWhileDragging,
    messageLeaveDelay,
    panelSizeRatio,
    panelKeys,
    watsonSpeech: { defaultKeywords, accessTokenURL },
  } = configFile

  // define default locale if does not exist
  let lang: string = defaultLang ? defaultLang : 'en'

  // Calculate default size.
  const defaultSize = {
    width: window.innerWidth - margin,
    height: window.innerHeight - headerHeight - footerHeight - margin,
  }
  const initialPanels: PanelWithPosition[] = []

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

  return {
    settings: {
      lang,
      locale: locales[lang],
      margin,
      initialContentHeight: defaultSize.height - headerHeight - footerHeight,
      headerHeight,
      footerHeight,
      shadowSizeWhileDragging,
      sortable: true,
      containerSize: defaultSize,
      messageLeaveDelay,
      messageFlag: true,
      sstFlag: 'file',
      panelSizeRatio,
    },
    watsonSpeech: {
      defaultKeywords,
      accessTokenURL,
      resultKeywords: [],
      conversation: [],
    },
    panelKeys,
    panels: initialPanels,
    order: cloneDeep(initialPanels),
    zIndices: range(5),
    tabs: {},
    pinned: [],
  }

  // ---------------------------- END SECTION -----------------------------------
  // ----------------------------------------------------------------------------
}
