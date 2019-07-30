import { cloneDeep } from 'lodash'
import { State, BaseAction, SingleReducer } from '../type'
import { HANDLE_RESULT_KEYWORDS } from '../actions'

const handleKeywords = (state: State, action: BaseAction): State => {
  // Make a copy of watsonSpeech configs.
  const tempWatsonSpeech = cloneDeep(state.watsonSpeech)
  const keywords = action.payload.resultKeywords
  const label = action.payload.label as string
  const { resultKeywords, tempResultKeywords } = tempWatsonSpeech
  if (label) {
    tempResultKeywords[label] = keywords
    tempResultKeywords[label].forEach(({ word, count }) => {
      const index = resultKeywords.findIndex(k => k.word === word)
      if (index > -1) {
        resultKeywords[index].count = count
      } else {
        resultKeywords.push({ word, count })
      }
    })
    resultKeywords.sort((a, b) => a.count - b.count)

    tempWatsonSpeech.tempResultKeywords = tempResultKeywords
    tempWatsonSpeech.resultKeywords = resultKeywords
  } else {
    tempWatsonSpeech.resultKeywords = keywords
  }
  console.log(tempWatsonSpeech.resultKeywords)
  // Merge to store.
  return Object.assign({}, state, {
    watsonSpeech: tempWatsonSpeech,
  })
}

export default [HANDLE_RESULT_KEYWORDS, handleKeywords] as SingleReducer
