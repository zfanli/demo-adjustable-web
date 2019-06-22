import { createStore } from 'redux'
import { State, BaseAction } from './type'
import { SET_SIZE } from './actions'
import { locales } from './locales'
import config from './config.json'

// define default locale if does not exist
const lang: string = config.defaultLang ? config.defaultLang : 'en'

// initialize state
const initState: State = {
  locale: locales[lang],
  panelKeys: config.panelKeys,
  margin: config.margin,
  contentBoxSize: {
    width: window.innerWidth - config.margin,
    height: window.innerHeight - 200 - config.margin,
  },
}

// Alias.
const assign = Object.assign

// reducer
function reducer(state = initState, action: BaseAction): State {
  switch (action.type) {
    case SET_SIZE:
      const contentBoxSize = action.payload.size
      return assign(state, { contentBoxSize })

    default:
      return state
  }
}

// export store
export default createStore(reducer)
