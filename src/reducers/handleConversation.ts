import { cloneDeep, uniq } from 'lodash'
import { HANDLE_CONVERSATION_CHANGED } from '../actions'
import { State, BaseAction, SingleReducer, TextWithLabel } from '../type'

const handleConversation = (state: State, action: BaseAction): State => {
  // Make a copy of watsonSpeech configs.
  const conversation = cloneDeep(state.watsonSpeech)
  const resultConversation = action.payload.conversation as TextWithLabel[]

  if (state.settings.sstFlag === 'files') {
    const label = resultConversation[0].speaker
    let tempConversation = conversation.conversation.filter(
      c => c.speaker !== label && c.speaker !== 'analyzing'
    )
    tempConversation = tempConversation.concat(resultConversation)
    conversation.conversation = tempConversation.sort((c1, c2) => {
      if (c1.timestamp && c2.timestamp) {
        return c1.timestamp - c2.timestamp
      }
      return 0
    })
  } else {
    conversation.conversation = action.payload.conversation
  }

  // Mark speaker label with customer and call service.
  if (
    conversation.conversation.length > 0 &&
    state.settings.sstFlag !== 'files'
  ) {
    let speakerLabels = uniq(conversation.conversation.map(c => c.speaker))
    const analyzingIndex = speakerLabels.findIndex(s => s === 'analyzing')
    if (analyzingIndex > -1) {
      speakerLabels.splice(analyzingIndex, 1)
    }
    const map = {
      [speakerLabels[1]]: 'customer',
      [speakerLabels[0]]: 'service',
    }
    if (speakerLabels.length > 2) {
      speakerLabels.forEach((s, i) => {
        if (i > 1) {
          map[s] = 'analyzing'
        }
      })
    }

    conversation.conversation = conversation.conversation.map(c => {
      return { ...c, speaker: map[c.speaker] }
    })
  }

  // Merge to store.
  return Object.assign({}, state, {
    watsonSpeech: conversation,
  })
}

export default [
  HANDLE_CONVERSATION_CHANGED,
  handleConversation,
] as SingleReducer
