import { range, cloneDeep } from 'lodash'
import {
  getCurrentPanelSize,
  packagePanels,
  convertToRowDirection,
  getPositionsBySizes,
  mapToPanels,
} from '../utils'
import { ExtendSize, PanelWithPosition } from '../type'
import config from '../config.json'

// Test size.
const size = { width: 300, height: 200 }
// Test margin.
const margin = 15
// Normal.
const normalSize: ExtendSize = {
  maxWidth: 100,
  maxHeight: 100,
  width: 85,
  height: 85,
  largest: false,
}
// Largest one.
const largeSize: ExtendSize = {
  maxWidth: 100,
  maxHeight: 200,
  width: 85,
  height: 185,
  largest: true,
}
// Default pattern: [0, 2, 4, 1, 3, 4].
const defaultPanels = range(4).map(() => normalSize)
defaultPanels.push(largeSize)
// Default positions in default pattern.
const defaultPattern = [0, 2, 4, 1, 3, 4]
const positionOfDefaultPanels = range(5).map((_, i) => {
  const index = defaultPattern.findIndex(p => p === i)
  const col = index > 2 ? index - 3 : index
  const row = index > 2 ? 1 : 0
  const size = defaultPanels[i]
  return {
    key: config.panelKeys[i],
    height: size.height,
    width: size.width,
    left: size.maxWidth * col + margin,
    top: size.maxHeight * row + margin,
    largest: size.largest,
  }
})

describe('Utils Test', () => {
  describe('Private function: getCurrentPanelSize.', () => {
    it('Returns normal size if it is not the largest panel.', () => {
      expect(getCurrentPanelSize(size, margin)).toEqual(normalSize)
    })

    it('Returns lager size if largest flag is set to true.', () => {
      expect(getCurrentPanelSize(size, margin, true)).toEqual(largeSize)
    })
  })

  describe('Private function: packagePanels.', () => {
    it('Returns sizes with default pattern in [0, 2, 4, 1, 3, 4] (Largest at the end).', () => {
      expect(packagePanels(size, margin)).toEqual(defaultPanels)
    })

    it('Returns sizes with pattern in [0, 1, 4, 0, 2, 3] (Largest at the top).', () => {
      const expectedResult = range(4).map(() => normalSize)
      expectedResult.unshift(largeSize)
      expect(packagePanels(size, margin, 0)).toEqual(expectedResult)
    })

    it('Returns sizes with pattern in [0, 2, 3, 1, 2, 4] (Largest at the middle).', () => {
      const expectedResult = range(4).map(() => normalSize)
      expectedResult.splice(2, 0, largeSize)
      expect(packagePanels(size, margin, 2)).toEqual(expectedResult)
    })
  })

  describe('Private Function: convertToRowDirection.', () => {
    const patterns = [
      // Pattern 1.
      [0, 1, 3, 0, 2, 4],
      // Pattern 2.
      [0, 2, 3, 1, 2, 4],
      // Pattern 3 and default.
      [0, 2, 4, 1, 3, 4],
    ]

    it(`Returns pattern 1 when the largest index is 0: ${patterns[0]}.`, () => {
      expect(convertToRowDirection(0)).toEqual(patterns[0])
    })

    it(`Returns pattern 2 when the largest index is 2: ${patterns[1]}.`, () => {
      expect(convertToRowDirection(2)).toEqual(patterns[1])
    })

    it(`Returns pattern 3 when the largest index is 4: ${patterns[2]}.`, () => {
      expect(convertToRowDirection(4)).toEqual(patterns[2])
    })

    it(`Returns default pattern 3 when the index is other: ${patterns[2]}.`, () => {
      expect(convertToRowDirection(9)).toEqual(patterns[2])
    })
  })

  describe('Private function: getPositionsBySizes.', () => {
    it('Return correct positions.', () => {
      expect(getPositionsBySizes(defaultPanels, margin)).toEqual(
        cloneDeep(positionOfDefaultPanels).map(p => {
          p.key = ''
          return p
        })
      )
    })
  })

  describe('Private function: mapToPanels.', () => {
    it('Returns the same object if in the same order.', () => {
      expect(
        mapToPanels(
          positionOfDefaultPanels,
          cloneDeep(positionOfDefaultPanels).map(p => {
            p.width = 0
            p.height = 0
            p.top = 0
            p.left = 0
            return p
          })
        )
      ).toEqual(positionOfDefaultPanels)
    })

    it('Returns different object if not in the same order.', () => {
      const temp = [
        ...cloneDeep(positionOfDefaultPanels).slice(2, 5),
        ...cloneDeep(positionOfDefaultPanels).slice(0, 2),
      ]
      expect(mapToPanels(positionOfDefaultPanels, temp)).not.toEqual(
        positionOfDefaultPanels
      )
    })

    it('Returns the same object after sorted.', () => {
      const temp = [
        ...cloneDeep(positionOfDefaultPanels).slice(2, 5),
        ...cloneDeep(positionOfDefaultPanels).slice(0, 2),
      ]
      const sortFunction = (a: PanelWithPosition, b: PanelWithPosition) =>
        a.key.localeCompare(b.key)
      expect(
        mapToPanels(positionOfDefaultPanels, temp).sort(sortFunction)
      ).toEqual(positionOfDefaultPanels.sort(sortFunction))
    })
  })
})
