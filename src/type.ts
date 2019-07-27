// main state
export interface State {
  settings: {
    lang: string
    locale: Locale
    margin: number
    initialContentHeight: number
    headerHeight: number
    footerHeight: number
    shadowSizeWhileDragging: number
    sortable: boolean
    messageLeaveDelay: number
    messageFlag: boolean
    sstFlag: string
    panelSizeRatio: {
      normalWidth: number
      largeWidth: number
    }
    containerSize: {
      width: number
      height: number
    }
  }
  watsonSpeech: {
    defaultKeywords: string[]
    resultKeywords: Keyword[]
    accessTokenURL: string
    conversation: TextWithLabel[]
  }
  panelKeys: string[]
  panels: PanelWithPosition[]
  order: PanelWithPosition[]
  zIndices: number[]
  animationIndex?: number
  isDraggingDown?: boolean
  panelsBackup?: PanelWithPosition[]
  tabs: { [k: string]: boolean }
  pinned: string[]
}

export type SingleReducer = [
  string,
  (state: State, action: BaseAction) => State
]

export interface Reducers {
  [k: string]: (state: State, action: BaseAction) => State
}

export interface ResultResponse {
  textResult: TextWithLabel[]
  keywordResult: string[]
}

export interface TextWithLabel {
  speaker: string | number
  transcript: string
  timestamp?: number
}

export interface PlainObject {
  [k: string]: string | number
}

export interface Keyword {
  count: number
  word: string
}

export interface PanelWithPosition {
  key: string
  height: number
  width: number
  left: number
  top: number
  tempLeft?: number | null
  tempTop?: number | null
  tempWidth?: number
  tempHeight?: number
  largest?: boolean
}

// localize object
export interface Locale {
  [k: string]: string | string[]
}

// base action
export interface BaseAction {
  type: string
  payload: {
    [k: string]: any
  }
}

// Base for store element size info.
export interface Size {
  width: number
  height: number
}

// Base for store panel size info.
export interface ExtendSize extends Size {
  maxWidth: number
  maxHeight: number
  largest?: boolean
}

// Advanced type for store panel size info and position.
export interface SizeWithPosition extends ExtendSize {
  left: number
  top: number
}
