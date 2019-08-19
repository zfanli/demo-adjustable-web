import { cloneDeep, range } from 'lodash'
import { getCookie, setCookie } from './utils'
import { locales } from '../locales'
import configFile from '../config/config.json'
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
    tabBarHeight,
    shadowSizeWhileDragging,
    messageLeaveDelay,
    panelSizeRatio,
    panelMinSize,
    panelKeys,
    fixedMenu,
    userId,
    availableUserId,
    defaultInputReply,
    watsonSpeech: { defaultKeywords },
    api: { accessTokenURL },
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
      tabBarHeight,
      shadowSizeWhileDragging,
      sortable: true,
      containerSize: defaultSize,
      messageLeaveDelay,
      messageFlag: true,
      sstFlag: 'files',
      panelSizeRatio,
      panelMinSize,
      replyInputFlag: false,
      availableUserId,
    },
    watsonSpeech: {
      defaultKeywords,
      accessTokenURL,
      resultKeywords: [],
      tempResultKeywords: {},
      conversation: [],
      uploadFiles: [],
    },
    panelKeys,
    panels: initialPanels,
    order: cloneDeep(initialPanels),
    zIndices: range(5),
    tabs: {},
    pinned: [],
    userId: userId,
    user: undefined,
    replies: undefined,
    inputReplies: undefined,
    activeUser: 0,
    modal: {
      title: '',
      panel: {
        key: 'modal',
        top: 0,
        left: 0,
        height: 0,
        width: 0,
      },
    },
    modalVisible: false,
    fixedMenu,
    reloadFlag: {},
    inputReplyHolder: defaultInputReply,
  }

  // ---------------------------- END SECTION -----------------------------------
  // ----------------------------------------------------------------------------
}
