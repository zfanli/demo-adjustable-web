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
        const left1 = panelFrameSize.temp.col[0] + motion[0]
        const minLeft1 = 0 + panelMinSize.minWidth + margin
        const maxLeft1 = panelFrameSize.col[1] - panelMinSize.minWidth
        panelFrameSize.col[0] =
          minLeft1 > left1 ? minLeft1 : maxLeft1 < left1 ? maxLeft1 : left1
        break

      case 'Y2':
        const left2 = panelFrameSize.temp.col[1] + motion[0]
        const minLeft2 = panelFrameSize.temp.col[0] + panelMinSize.minWidth
        const maxLeft2 = panelFrameSize.temp.col[2] - panelMinSize.minWidth
        panelFrameSize.col[1] =
          minLeft2 > left2 ? minLeft2 : maxLeft2 < left2 ? maxLeft2 : left2
        break
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
