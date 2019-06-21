// main state
export interface State {
  locale: Locale
  panelKeys: string[]
}

// localize object
export interface Locale {
  [k: string]: string
}

// base action
export interface BaseAction {
  type: string
  payload: {}
}
