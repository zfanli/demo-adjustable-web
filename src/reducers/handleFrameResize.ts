import { cloneDeep } from 'lodash'
import {
  HANDLE_FRAME_RESIZE,
  HANDLE_FRAME_RESIZE_START,
  HANDLE_FRAME_RESIZE_END,
} from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleFrameResize = (state: State, action: BaseAction): State => {
  const { target, motion } = action.payload as {
    target: string
    motion: number[]
  }
  const panelFrameSize = cloneDeep(state.settings.panelFrameSize)

  if (panelFrameSize.temp) {
    const { panelMinSize, margin } = state.settings
    switch (target) {
      case 'X':
        const top = panelFrameSize.temp.row[0] + motion[1]
        const maxTop = panelFrameSize.row[1] - panelMinSize.minHeight
        const minTop = margin + panelMinSize.minHeight
        panelFrameSize.row[0] =
          minTop > top ? minTop : maxTop < top ? maxTop : top
        break
      case 'Y1':
      case 'Y2':
        const index = Number(target.slice(1)) - 1
        const left = panelFrameSize.temp.col[index] + motion[0]
        const maxLeft =
          panelFrameSize.col[index === 1 ? 2 : 1] - panelMinSize.minWidth
        const minLeft =
          (index === 1 ? panelFrameSize.col[0] : 0) +
          margin +
          panelMinSize.minWidth
        panelFrameSize.col[index] =
          minLeft > left ? minLeft : maxLeft < left ? maxLeft : left
    }

    return Object.assign({}, state, {
      settings: {
        ...state.settings,
        panelFrameSize,
      },
    })
  }
  return state
}

const handleFrameResizeStart = (state: State): State => {
  const panelFrameSize = cloneDeep(state.settings.panelFrameSize)
  panelFrameSize.temp = cloneDeep(state.settings.panelFrameSize)
  return Object.assign({}, state, {
    settings: {
      ...state.settings,
      panelFrameSize,
    },
  })
}

const handleFrameResizeEnd = (state: State): State => {
  const panelFrameSize = cloneDeep(state.settings.panelFrameSize)
  panelFrameSize.temp = undefined
  return Object.assign({}, state, {
    settings: {
      ...state.settings,
      panelFrameSize,
    },
  })
}

export default [
  [HANDLE_FRAME_RESIZE, handleFrameResize] as SingleReducer,
  [HANDLE_FRAME_RESIZE_START, handleFrameResizeStart] as SingleReducer,
  [HANDLE_FRAME_RESIZE_END, handleFrameResizeEnd] as SingleReducer,
]
