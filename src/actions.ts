import {
  BaseAction,
  Size,
  PanelWithPosition,
  UserInformation,
  Reply,
  ReplyInput,
} from './type'

export const HANDLE_WINDOW_RESIZE = 'HANDLE_WINDOW_RESIZE'

export function handleWindowResize(size: Size): BaseAction {
  return {
    type: HANDLE_WINDOW_RESIZE,
    payload: { size },
  }
}

export const HANDLE_PANEL_DRAGGING = 'HANDLE_PANEL_DRAGGING'

export function handlePanelDragging(
  // Mouse position.
  position: number[],
  // Offset.
  offset: number[],
  // Animation index.
  index: number,
  // Is moving?
  moving: boolean
): BaseAction {
  return {
    type: HANDLE_PANEL_DRAGGING,
    payload: { position, offset, index, moving },
  }
}

export const HANDLE_SWITCH_LOCALE = 'HANDLE_SWITCH_LOCALE'

export function handleSwitchLocale(locale: string): BaseAction {
  return {
    type: HANDLE_SWITCH_LOCALE,
    payload: { locale },
  }
}

export const HANDLE_SWITCH_SORTABLE = 'HANDLE_SWITCH_SORTABLE'

export function handleSwitchSortable(sortable: boolean): BaseAction {
  return {
    type: HANDLE_SWITCH_SORTABLE,
    payload: { sortable },
  }
}

export const HANDLE_PANEL_RESET = 'HANDLE_PANEL_RESET'

export function handlePanelReset(): BaseAction {
  return {
    type: HANDLE_PANEL_RESET,
    payload: {},
  }
}

export const HANDLE_PANEL_RESORT = 'HANDLE_PANEL_RESORT'

export function handlePanelResort(
  position: number[],
  index: number,
  moving: boolean
) {
  return {
    type: HANDLE_PANEL_RESORT,
    payload: {
      position,
      index,
      moving,
    },
  }
}

export const HANDLE_RESULT_KEYWORDS = 'HANDLE_RESULT_KEYWORDS'

export function handleResultKeywords(
  resultKeywords: string[],
  label: string
): BaseAction {
  return {
    type: HANDLE_RESULT_KEYWORDS,
    payload: { resultKeywords, label },
  }
}

export const HANDLE_SWITCH_ACTIVE = 'HANDLE_SWITCH_ACTIVE'

export function handleSwitchActive(index: number): BaseAction {
  return {
    type: HANDLE_SWITCH_ACTIVE,
    payload: { index },
  }
}

export const HANDLE_PANEL_RESIZE = 'HANDLE_PANEL_RESIZE'

export function handlePanelResize(key: string, size: number[]): BaseAction {
  return {
    type: HANDLE_PANEL_RESIZE,
    payload: { key, size },
  }
}

export const HANDLE_PANEL_MINIMIZE = 'HANDLE_PANEL_MINIMIZE'

export function handlePanelMinimize(index: number): BaseAction {
  return {
    type: HANDLE_PANEL_MINIMIZE,
    payload: { index },
  }
}

export const HANDLE_PANEL_RETRIEVE = 'HANDLE_PANEL_RETRIEVE'

export function handlePanelRetrieve(index: number): BaseAction {
  return {
    type: HANDLE_PANEL_RETRIEVE,
    payload: { index },
  }
}

export const HANDLE_PANEL_PINNED = 'HANDLE_PANEL_PINNED'

export function handlePanelPinned(index: number): BaseAction {
  return {
    type: HANDLE_PANEL_PINNED,
    payload: { index },
  }
}

export const HANDLE_SWITCH_MESSAGE_FLAG = 'HANDLE_SWITCH_MESSAGE_FLAG'

export function handleSwitchMessageFlag(messageFlag: boolean): BaseAction {
  return {
    type: HANDLE_SWITCH_MESSAGE_FLAG,
    payload: { messageFlag },
  }
}

export const HANDLE_SWITCH_SST_FLAG = 'HANDLE_SWITCH_SST_FLAG'

export function handleSwitchSstFlag(sstFlag: boolean): BaseAction {
  return {
    type: HANDLE_SWITCH_SST_FLAG,
    payload: { sstFlag },
  }
}

export const HANDLE_CONVERSATION_CHANGED = 'HANDLE_CONVERSATION_CHANGED'

export function handleConversationChanged(conversation: []): BaseAction {
  return {
    type: HANDLE_CONVERSATION_CHANGED,
    payload: { conversation },
  }
}

export const HANDLE_INITIAL_PANELS = 'HANDLE_INITIAL_PANELS'

export function handleInitialPanels(
  panels: PanelWithPosition[],
  size: Size
): BaseAction {
  return {
    type: HANDLE_INITIAL_PANELS,
    payload: { panels, size },
  }
}

export const HANDLE_INITIAL_UNSORTED_PANELS = 'HANDLE_INITIAL_UNSORTED_PANELS'

export function handleInitialUnsortedPanels(
  panels: PanelWithPosition[]
): BaseAction {
  return {
    type: HANDLE_INITIAL_UNSORTED_PANELS,
    payload: { panels },
  }
}

export const HANDLE_PANEL_MAXIMIZE = 'HANDLE_PANEL_MAXIMIZE'

export function handlePanelMaximize(
  index: number,
  maximized: boolean
): BaseAction {
  return {
    type: HANDLE_PANEL_MAXIMIZE,
    payload: { index, maximized },
  }
}

export const HANDLE_SWITCH_USER = 'HANDLE_SWITCH_USER'

export function handleSwitchUser(id: number): BaseAction {
  return {
    type: HANDLE_SWITCH_USER,
    payload: { id },
  }
}

export const HANDLE_SWITCH_MODAL_FLAG = 'HANDLE_SWITCH_MODAL_FLAG'

export function handleSwitchModalFlag(
  title: string,
  flag: boolean
): BaseAction {
  return {
    type: HANDLE_SWITCH_MODAL_FLAG,
    payload: { title, flag },
  }
}

export const HANDLE_MODAL_DRAGGING = 'HANDLE_MODAL_DRAGGING'

export function handleModalDragging(
  offset: number[],
  moving: boolean
): BaseAction {
  return {
    type: HANDLE_MODAL_DRAGGING,
    payload: { offset, moving },
  }
}

export const HANDLE_MODAL_INITIALIZE = 'HANDLE_MODAL_INITIALIZE'

export function handleModalInitialize(
  height: number,
  width: number,
  top: number,
  left: number
): BaseAction {
  return {
    type: HANDLE_MODAL_INITIALIZE,
    payload: { height, width, top, left },
  }
}

export const HANDLE_SWITCH_REPLY_INPUT_FLAG = 'HANDLE_SWITCH_REPLY_INPUT_FLAG'

export function handleSwitchReplyInputFlag(flag: boolean): BaseAction {
  return {
    type: HANDLE_SWITCH_REPLY_INPUT_FLAG,
    payload: { flag },
  }
}

export const HANDLE_FETCH_USER_INFO = 'HANDLE_FETCH_USER_INFO'

export function handleFetchUserInfo(
  userInformation: UserInformation
): BaseAction {
  return {
    type: HANDLE_FETCH_USER_INFO,
    payload: { userInformation },
  }
}

export const HANDLE_FETCH_REPLY_AUTO = 'HANDLE_FETCH_REPLY_AUTO'

export function handleFetchReplyAuto(replies: Reply[]): BaseAction {
  return {
    type: HANDLE_FETCH_REPLY_AUTO,
    payload: { replies },
  }
}

export const HANDLE_FETCH_REPLY_INPUT = 'HANDLE_FETCH_REPLY_INPUT'

export function handleFetchReplyInput(replies: ReplyInput[]): BaseAction {
  return {
    type: HANDLE_FETCH_REPLY_INPUT,
    payload: { replies },
  }
}

export const HANDLE_SAVE_INPUT_REPLY = 'HANDLE_SAVE_INPUT_REPLY'

export function handleSaveInputReply(reply: ReplyInput): BaseAction {
  return {
    type: HANDLE_SAVE_INPUT_REPLY,
    payload: { reply },
  }
}

export const HANDLE_SET_UPLOAD_FILE = 'HANDLE_SET_UPLOAD_FILE'

export function handleSetUploadFile(index: number, file: any): BaseAction {
  return {
    type: HANDLE_SET_UPLOAD_FILE,
    payload: { index, file },
  }
}

export const HANDLE_FRAME_RESIZE = 'HANDLE_FRAME_RESIZE'

export function handleFrameResize(
  target: string,
  motion: number[]
): BaseAction {
  return {
    type: HANDLE_FRAME_RESIZE,
    payload: { target, motion },
  }
}

export const HANDLE_FRAME_RESIZE_START = 'HANDLE_FRAME_RESIZE_START'

export function handleFrameResizeStart(): BaseAction {
  return {
    type: HANDLE_FRAME_RESIZE_START,
    payload: {},
  }
}

export const HANDLE_FRAME_RESIZE_END = 'HANDLE_FRAME_RESIZE_END'

export function handleFrameResizeEnd(): BaseAction {
  return {
    type: HANDLE_FRAME_RESIZE_END,
    payload: {},
  }
}
