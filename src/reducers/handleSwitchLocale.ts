import { HANDLE_SWITCH_LOCALE } from '../actions'
import { setCookie } from './utils'
import { State, BaseAction, SingleReducer } from '../type'
import { locales } from '../locales'

const handleSwitchLocale = (state: State, action: BaseAction): State => {
  // Get the next lang.
  const locale = action.payload.locale
  // Store it into cookie.
  setCookie('lang', locale)
  // Merge to store.
  return Object.assign({}, state, {
    settings: {
      ...state.settings,
      locale: locales[locale],
      lang: locale,
    },
  })
}

export default [HANDLE_SWITCH_LOCALE, handleSwitchLocale] as SingleReducer
