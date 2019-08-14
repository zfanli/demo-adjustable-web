import { cloneDeep } from 'lodash'
import {
  HANDLE_FETCH_USER_INFO,
  HANDLE_FETCH_REPLY_AUTO,
  HANDLE_FETCH_REPLY_INPUT,
} from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleFetchUserInfo = (state: State, action: BaseAction): State => {
  const reloadFlag = cloneDeep(state.reloadFlag)
  reloadFlag['userInfo'] = 1
  return Object.assign({}, state, {
    user: action.payload.userInformation,
    reloadFlag,
  })
}

const handleFetchReplyAuto = (state: State, action: BaseAction): State => {
  const reloadFlag = cloneDeep(state.reloadFlag)
  reloadFlag['replyAuto'] = 1
  return Object.assign({}, state, {
    replies: action.payload.replies,
    reloadFlag,
  })
}

const handleFetchReplyInput = (state: State, action: BaseAction): State => {
  const reloadFlag = cloneDeep(state.reloadFlag)
  reloadFlag['replyInput'] = 1
  return Object.assign({}, state, {
    inputReplies: action.payload.replies,
    reloadFlag,
  })
}

export default [
  [HANDLE_FETCH_USER_INFO, handleFetchUserInfo] as SingleReducer,
  [HANDLE_FETCH_REPLY_AUTO, handleFetchReplyAuto] as SingleReducer,
  [HANDLE_FETCH_REPLY_INPUT, handleFetchReplyInput] as SingleReducer,
]
