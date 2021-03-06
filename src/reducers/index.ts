import { createStore } from 'redux'
import initState from './store'
import { State, BaseAction, Reducers } from '../type'
import handleConversation from './handleConversation'
import handleFetchData from './handleFetchData'
import handleFrameResize from './handleFrameResize'
import handleInitialPanels from './handleInitialPanels'
import handleInitialUnsortedPanels from './handleInitialUnsortedPanels'
import handleKeywords from './handleKeywords'
import handleModalDragging from './handleModalDragging'
import handleModalInitialize from './handleModalInitialize'
import handlePanelDragging from './handlePanelDragging'
import handlePanelMaximize from './handlePanelMaximize'
import handlePanelMinimize from './handlePanelMinimize'
import handlePanelPinned from './handlePanelPinned'
import handlePanelReset from './handlePanelReset'
import handlePanelResize from './handlePanelResize'
import handlePanelResort from './handlePanelResort'
import handlePanelRetrieve from './handlePanelRetrieve'
import handleSaveInputReply from './handleSaveInputReply'
import handleSetUploadFile from './handleSetUploadFile'
import handleSwitchActive from './handleSwitchActive'
import handleSwitchLocale from './handleSwitchLocale'
import handleSwitchMessageFlag from './handleSwitchMessageFlag'
import handleSwitchModalFlag from './handleSwitchModalFlag'
import handleSwitchReplyInfoFlag from './handleSwitchReplyInfoFlag'
import handleSwitchSortable from './handleSwitchSortable'
import handleSwitchSstFlag from './handleSwitchSstFlag'
import handleSwitchUser from './handleSwitchUser'
import handleWindowResize from './handleWindowResize'

// Wrap all reducers in a single array.
const allReducers = [
  ...handleFetchData,
  ...handleFrameResize,
  handleConversation,
  handleInitialPanels,
  handleInitialUnsortedPanels,
  handleKeywords,
  handleModalDragging,
  handleModalInitialize,
  handlePanelDragging,
  handlePanelMaximize,
  handlePanelMinimize,
  handlePanelReset,
  handlePanelResize,
  handlePanelResort,
  handlePanelRetrieve,
  handleSaveInputReply,
  handleSetUploadFile,
  handleSwitchActive,
  handleSwitchLocale,
  handlePanelPinned,
  handleSwitchMessageFlag,
  handleSwitchModalFlag,
  handleSwitchReplyInfoFlag,
  handleSwitchSortable,
  handleSwitchSstFlag,
  handleSwitchUser,
  handleWindowResize,
]
// Combine reducers into an object.
const combinedReducers: Reducers = {}
allReducers.forEach(r => (combinedReducers[r[0]] = r[1]))

// Reducers.
export function reducer(state = initState(), action: BaseAction): State {
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
