// main state
export interface State {
  settings: {
    lang: string
    locale: Locale
    margin: number
    initialContentHeight: number
    headerHeight: number
    footerHeight: number
    tabBarHeight: number
    shadowSizeWhileDragging: number
    sortable: boolean
    messageLeaveDelay: number
    messageFlag: boolean
    sstFlag: string
    replyInputFlag: boolean
    availableUserId: string[]
    panelFrameSize: FrameSize
    panelMinSize: {
      minHeight: number
      minWidth: number
    }
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
    tempResultKeywords: { [k: string]: Keyword[] }
    accessTokenURL: string
    conversation: TextWithLabel[]
    uploadFiles: any[]
  }
  panelKeys: string[]
  panels: PanelWithPosition[]
  order: PanelWithPosition[]
  zIndices: number[]
  animationIndex?: number
  isDraggingDown?: boolean
  panelsBackup?: PanelWithPosition[]
  tabs: { [k: string]: boolean }
  tabsBackup?: { [k: string]: boolean }
  pinned: string[]
  userId: string
  user?: UserInformation
  replies?: Reply[]
  inputReplies?: ReplyInput[]
  inputReplyHolder: ReplyInput
  reloadFlag: { [k: string]: number }
  activeUser: number
  modal: Modal
  modalVisible: boolean
  fixedMenu: string[]
}

export type SingleReducer = [
  string,
  (state: State, action: BaseAction) => State
]

export interface FrameSize {
  row: number[]
  col: number[]
  temp?: FrameSize
}

export interface ReplyInput {
  date: string
  time: string
  dealing: string
  contact: string
  circuit: string
  target: string
  staff: string
  team: string
  business: string
  result: string
  detail: string
  information: string
}

export interface UserInformation {
  userId: string
  nameKn: string
  name: string
  birthday: string
  genderCode: string
  gender: string
  age: number
  team: string
  loanLimit: number
  contractLimit: number
  firstLoanLimit: number
  totalLimit: number
  annualIncome: number
  jobTypeCode: string
  jobType: string
  repaymentCode: string
  repayment: string
  purposeCode: string
  purpose: string
}

export interface Reply {
  timestamp: string
  information: string
}

export interface Modal {
  title: string
  panel: PanelWithPosition
}

export interface Reducers {
  [k: string]: (state: State, action: BaseAction) => State
}

export interface ResultResponse {
  textResult: TextWithLabel[]
  keywordResult: string[]
  label: string
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
  tempMinLeft?: number | null
  tempMinTop?: number | null
  tempMinWidth?: number
  tempMinHeight?: number
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
