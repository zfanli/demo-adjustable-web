import { BaseAction, Size } from './type'

export const SET_SIZE = 'SET_SIZE'

export function setSize(size: Size): BaseAction {
  return {
    type: SET_SIZE,
    payload: { size },
  }
}
