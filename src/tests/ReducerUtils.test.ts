import { getPanels, setPanels } from '../reducers/utils'

beforeAll(() => {
  // Some set up works.
  process.env.API_PANELS = 'http://localhost:3002/api/panels'
})

const testPanels = [
  {
    key: 'userInfo',
    height: 297,
    width: 335,
    left: 15,
    top: 15,
    largest: false,
  },
  {
    key: 'replyInfo',
    height: 297,
    width: 335,
    left: 15,
    top: 327,
    largest: false,
  },
  {
    key: 'fixedMenu',
    height: 297,
    width: 335,
    left: 365,
    top: 15,
    largest: false,
  },
  {
    key: 'dynamicMenu',
    height: 297,
    width: 335,
    left: 365,
    top: 327,
    largest: false,
  },
  {
    key: 'speechToTextPanel',
    height: 609,
    width: 335,
    left: 715,
    top: 15,
    largest: true,
  },
]

describe('Utils for reducers.', () => {
  describe('API fetch.', () => {
    it('Set unsorted panels to backend server.', async () => {
      expect(await setPanels([], false)).toBeTruthy()
    })

    it('Get unsorted panels from backend server.', async () => {
      expect(await getPanels(false)).toEqual([])
    })

    it('Set panels to backend server.', async () => {
      expect(await setPanels(testPanels, true)).toBeTruthy()
    })

    it('Get panels from backend server.', async () => {
      expect(await getPanels(true)).toEqual(testPanels)
    })
  })
})
