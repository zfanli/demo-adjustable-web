import { BaseAction, Size } from './type'

export const SET_SIZE = 'SET_SIZE'

export function setSize(size: Size): BaseAction {
  return {
    type: SET_SIZE,
    payload: { size },
  }
}

export const HANDLE_DRAGGING = 'HANDLE_DRAGGING'

export function handleDragging(
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
    type: HANDLE_DRAGGING,
    payload: { position, offset, index, moving },
  }
}

export const SET_LOCALE = 'SET_LOCALE'

export function setLocale(locale: string): BaseAction {
  return {
    type: SET_LOCALE,
    payload: { locale },
  }
}

export const SET_SORTABLE = 'SET_SORTABLE'

export function setSortable(sortable: boolean): BaseAction {
  return {
    type: SET_SORTABLE,
    payload: { sortable },
  }
}

export const HANDLE_RESET_ACTION = 'HANDLE_RESET_ACTION'

export function resetPanelsPosition(): BaseAction {
  return {
    type: HANDLE_RESET_ACTION,
    payload: {},
  }
}

export const HANDLE_RESORT_ACTION = 'HANDLE_RESORT_ACTION'

export function handleResortAction(
  position: number[],
  index: number,
  moving: boolean
) {
  return {
    type: HANDLE_RESORT_ACTION,
    payload: {
      position,
      index,
      moving,
    },
  }
}

export const SET_RESULT_KEYWORDS = 'SET_RESULT_KEYWORDS'

export function setResultKeywords(resultKeywords: string[]): BaseAction {
  return {
    type: SET_RESULT_KEYWORDS,
    payload: { resultKeywords },
  }
}

export const SET_ACTIVE_PANEL = 'SET_ACTIVE_PANEL'

export function setActivePanel(index: number): BaseAction {
  return {
    type: SET_ACTIVE_PANEL,
    payload: { index },
  }
}
