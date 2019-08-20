import { range } from 'lodash'
import { State, BaseAction, SingleReducer, Size } from '../type'
import { HANDLE_WINDOW_RESIZE } from '../actions'
import {
  handleSizeChangeForSortable,
  handleSizeChangeForUnsortable,
} from '../utils'

const handleWindowResize = (state: State, action: BaseAction): State => {
  const containerSize = action.payload.size as Size

  let panelFrameSize = state.settings.panelFrameSize

  if (panelFrameSize.col.length === 0) {
    const cols = range(3).map(() => containerSize.width / 3)
    const rows = range(2).map(() => containerSize.height / 2)

    const reduce = (i: number, a: number[]) =>
      a.slice(0, i + 1).reduce((a, b) => a + b)

    panelFrameSize = {
      col: range(3).map(i => reduce(i, cols)),
      row: range(2).map(i => reduce(i, rows)),
    }
  } else {
    const newWidth = containerSize.width
    const newHeight = containerSize.height
    const oldWidth = panelFrameSize.col[panelFrameSize.col.length - 1]
    const oldHeight = panelFrameSize.row[panelFrameSize.row.length - 1]
    panelFrameSize.col = panelFrameSize.col.map(
      col => newWidth * (col / oldWidth)
    )
    panelFrameSize.row = panelFrameSize.row.map(
      row => newHeight * (row / oldHeight)
    )
  }

  // Change relative positions and sizes.
  const panels = state.settings.sortable
    ? handleSizeChangeForSortable(
        state.panels,
        state.order,
        containerSize,
        state.settings.margin,
        Object.keys(state.tabs).filter(k => state.tabs[k])
      )
    : handleSizeChangeForUnsortable(
        state.panels,
        state.order,
        containerSize,
        state.settings.containerSize
      )

  // const tempSettings
  return Object.assign({}, state, {
    settings: {
      ...state.settings,
      containerSize,
      panelFrameSize,
    },
    panels: panels[0],
    order: panels[1],
  })
}

export default [HANDLE_WINDOW_RESIZE, handleWindowResize] as SingleReducer
