import { SET_ACTIVE_PANEL } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleActive = (state: State, action: BaseAction): State => {
  const activePanel = action.payload.index
  const activeIndex = state.zIndices[activePanel]
  // Reduce the z-index if it is greater than the target z-index.
  const zIndices = state.zIndices.map(z => (z > activeIndex ? z - 1 : z))
  // Set the target to be the biggest one.
  zIndices[activePanel] = 4
  // Merge to store.
  return Object.assign({}, state, { zIndices })
}

export default [SET_ACTIVE_PANEL, handleActive] as SingleReducer
