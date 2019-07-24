import { cloneDeep } from 'lodash'
import { State, BaseAction, SingleReducer } from '../type'
import { HANDLE_RESULT_KEYWORDS } from '../actions'

const handleKeywords = (state: State, action: BaseAction): State => {
  // Make a copy of watsonSpeech configs.
  const tempWatsonSpeech = cloneDeep(state.watsonSpeech)
  tempWatsonSpeech.resultKeywords = action.payload.resultKeywords
  console.log(action.payload.resultKeywords)
  // Merge to store.
  return Object.assign({}, state, {
    watsonSpeech: tempWatsonSpeech,
  })
}

export default [HANDLE_RESULT_KEYWORDS, handleKeywords] as SingleReducer
