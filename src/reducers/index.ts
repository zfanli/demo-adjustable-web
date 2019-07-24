import { createStore } from 'redux'
import { initState } from '../store'
import { State, BaseAction, Reducers } from '../type'
import handleActive from './handleActive'
import handleConversation from './handleConversation'
import handleKeywords from './handleKeywords'
import handleLocale from './handleLocale'
import handlePanelDragging from './handlePanelDragging'
import handlePanelMinimize from './handlePanelMinimize'
import handlePanelPinned from './handlePanelPinned'
import handlePanelReset from './handlePanelReset'
import handlePanelResize from './handlePanelResize'
import handlePanelResort from './handlePanelResort'
import handlePanelRetrieve from './handlePanelRetrieve'
import handleSwitchMessageFlag from './handleSwitchMessageFlag'
import handleSwitchSortable from './handleSwitchSortable'
import handleSwitchSstFlag from './handleSwitchSstFlag'
import handleWindowResize from './handleWindowResize'

// Wrap all reducers in a single array.
const allReducers = [
  handleActive,
  handleConversation,
  handleKeywords,
  handleLocale,
  handlePanelDragging,
  handlePanelMinimize,
  handlePanelReset,
  handlePanelResize,
  handlePanelResort,
  handlePanelRetrieve,
  handlePanelPinned,
  handleSwitchMessageFlag,
  handleSwitchSortable,
  handleSwitchSstFlag,
  handleWindowResize,
]
// Combine reducers into an object.
const combinedReducers: Reducers = {}
allReducers.forEach(r => (combinedReducers[r[0]] = r[1]))

// Reducers.
export function reducer(state = initState, action: BaseAction): State {
  if (!!combinedReducers[action.type]) {
    return combinedReducers[action.type](state, action)
  }

  return state
}

// export store
export default createStore(
  reducer
  // (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
  //   (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)
