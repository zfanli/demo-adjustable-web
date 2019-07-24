import { initState } from '../store'
import { reducer } from '../reducers'
import { setLocale } from '../actions'

// Alias.
// const assignWithNewObject = (...args: any[]) => Object.assign({}, ...args)
const emptyAction = { type: '', payload: {} }

describe('Reducer.', () => {
  describe('Initialization.', () => {
    it('Reducer has an initial state.', () => {
      expect(reducer(undefined, emptyAction)).toEqual(initState)
    })

    it('`order` should be the same with `panels` at the point of initial.', () => {
      const panels = initState.panels
      expect(reducer(undefined, emptyAction).order).toEqual(panels)
    })
  })

  describe('About i18n.', () => {
    it('Set correct `lang` value.', () => {
      const TEST_LANG = 'TEST_LANG'
      expect(reducer(undefined, setLocale('TEST_LANG')).settings.lang).toEqual(
        TEST_LANG
      )
    })
  })
})
