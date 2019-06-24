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
