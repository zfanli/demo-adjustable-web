import { BaseAction, Size } from './type'

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

export function handleResultKeywords(resultKeywords: string[]): BaseAction {
  return {
    type: HANDLE_RESULT_KEYWORDS,
    payload: { resultKeywords },
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
