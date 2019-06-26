import { BaseAction, Size } from './type'

export const SET_SIZE = 'SET_SIZE'

export function setSize(size: Size): BaseAction {
  return {
    type: SET_SIZE,
    payload: { size },
  }
}

export const SET_DRAGGING_POSITION = 'SET_DRAGGING_POSITION'

export function setDraggingPosition(
  position: number[],
  index: number,
  moving: boolean
): BaseAction {
  return {
    type: SET_DRAGGING_POSITION,
    payload: { position, index, moving },
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
