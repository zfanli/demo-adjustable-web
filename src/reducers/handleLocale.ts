import { SET_LOCALE } from '../actions'
import { setCookie } from '../utils'
import { State, BaseAction, SingleReducer } from '../type'
import { locales } from '../locales'

const handleLocale = (state: State, action: BaseAction): State => {
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

export default [SET_LOCALE, handleLocale] as SingleReducer
