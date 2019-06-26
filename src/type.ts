// main state
export interface State {
  lang: string
  locale: Locale
  panelKeys: string[]
  margin: number
  containerSize: {
    width: number
    height: number
  }
  panels: PanelWithPosition[]
  order: PanelWithPosition[]
  shadowSizeWhileDragging: number
  sortable: boolean
  triggerAnimation?: boolean
  panelsBackup?: PanelWithPosition[]
}

export interface PlainObject {
  [k: string]: string | number
}

export interface PanelWithPosition {
  key: string
  height: number
  width: number
  left: number
  top: number
  tempLeft?: number | null
  tempTop?: number | null
}

// localize object
export interface Locale {
  [k: string]: string | string[]
}

// base action
export interface BaseAction {
  type: string
  payload: {
    [k: string]: any
  }
}

// Base for store element size info.
export interface Size {
  width: number
  height: number
}

// Base for store panel size info.
export interface ExtendSize extends Size {
  maxWidth: number
  maxHeight: number
}

// Advanced type for store panel size info and position.
export interface SizeWithPosition extends ExtendSize {
  left: number
  top: number
}
