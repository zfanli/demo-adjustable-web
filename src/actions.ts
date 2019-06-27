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

export const RESET_PANELS_POSITION = 'RESET_PANELS_POSITION'

export function resetPanelsPosition(): BaseAction {
  return {
    type: RESET_PANELS_POSITION,
    payload: {},
  }
}
