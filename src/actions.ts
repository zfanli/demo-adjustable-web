import { BaseAction, Size, FlatPanel } from './type'

export const SET_SIZE = 'SET_SIZE'

export function setSize(size: Size): BaseAction {
  return {
    type: SET_SIZE,
    payload: { size },
  }
}

export const SET_FLAT_PANELS = 'SET_FLAT_PANELS'

export function setFlatPanels(panels: FlatPanel[]): BaseAction {
  return {
    type: SET_FLAT_PANELS,
    payload: { panels },
  }
}
