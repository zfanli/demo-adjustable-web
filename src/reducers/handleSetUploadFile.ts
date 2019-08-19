import { HANDLE_SET_UPLOAD_FILE } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleSetUploadFile = (state: State, action: BaseAction): State => {
  const { index, file } = action.payload
  const uploadFiles = state.watsonSpeech.uploadFiles
  uploadFiles[index] = file
  return Object.assign({}, state, {
    watsonSpeech: {
      ...state.watsonSpeech,
      uploadFiles,
    },
  })
}

export default [HANDLE_SET_UPLOAD_FILE, handleSetUploadFile] as SingleReducer
