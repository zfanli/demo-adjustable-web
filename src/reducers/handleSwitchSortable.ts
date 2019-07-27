import { cloneDeep } from 'lodash'
import { mapToPanels } from '../utils'
import { HANDLE_SWITCH_SORTABLE } from '../actions'
import { State, BaseAction, SingleReducer } from '../type'

const handleSwitchSortable = (state: State, action: BaseAction): State => {
  const sortable = action.payload.sortable

  // State changes from un-sortable to sortable.
  // All panels should reset their position,
  // and store current position as a backup for further use.
  if (sortable) {
    return Object.assign({}, state, {
      settings: {
        ...state.settings,
        sortable,
      },
      panels: mapToPanels(state.order, state.panelKeys),
      panelsBackup: cloneDeep(state.panels),
      tabs: {},
    })
  } else {
    // State changes from sortable to un-sortable.
    // Use backup position if does exist.
    const panelsBackup = state.panelsBackup
    // Show tabs.
    const unsortableTabs: { [k: string]: boolean } = {}
    state.panelKeys.forEach(k => (unsortableTabs[k] = false))
    return Object.assign({}, state, {
      settings: {
        ...state.settings,
        sortable,
      },
      // Use backup if exists.
      panels: panelsBackup ? panelsBackup : state.panels,
      panelsBackup: null,
      // Show tabs
      tabs: unsortableTabs,
    })
  }
}

export default [HANDLE_SWITCH_SORTABLE, handleSwitchSortable] as SingleReducer
