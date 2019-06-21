import { createStore } from 'redux'
import { State, BaseAction } from './type'
import { locales } from './locales'
import config from './config.json'

// define default locale if does not exist
const lang: string = config.defaultLang ? config.defaultLang : 'en'

// initialize state
const initState: State = {
  locale: locales[lang],
  panelKeys: config.panelKeys,
}

// reducer
function reducer(state = initState, action: BaseAction): State {
  return state
}

// export store
export default createStore(reducer)
