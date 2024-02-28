import { getDropdownValues } from './KYCInfoFieldSection'

describe('KYCInfoFieldSection', () => {
  describe('getDropdownValues', () => {
    it('returns allowedValues if choices is undefined', () => {
      const allowedValues: [string, ...string[]] = ['a', 'b']
      const choices = undefined
      const formatter = undefined
      const result = getDropdownValues({ allowedValues, choices, formatter })
      expect(result).toEqual(allowedValues)
    })
    it('returns choices if allowedValues is undefined', () => {
      const allowedValues = undefined
      const choices: [string, ...string[]] = ['a', 'b']
      const formatter = undefined
      const result = getDropdownValues({ allowedValues, choices, formatter })
      expect(result).toEqual(choices)
    })
    it('returns choices that are in allowedValues', () => {
      const allowedValues: [string, ...string[]] = ['a', 'b']
      const choices: [string, ...string[]] = ['a', 'b', 'c']
      const formatter = undefined
      const result = getDropdownValues({ allowedValues, choices, formatter })
      expect(result).toEqual(allowedValues)
    })
    it('returns allowedValues if no choices are in allowedValues', () => {
      const allowedValues: [string, ...string[]] = ['a', 'b']
      const choices: [string, ...string[]] = ['c', 'd']
      const formatter = undefined
      const result = getDropdownValues({ allowedValues, choices, formatter })
      expect(result).toEqual(allowedValues)
    })
    it('returns formatted values', () => {
      const allowedValues: [string, ...string[]] = ['a', 'b']
      const choices: [string, ...string[]] = ['A', 'B', 'C']
      const formatter = (x: string) => x.toUpperCase()
      const result = getDropdownValues({ allowedValues, choices, formatter })
      expect(result).toEqual(['A', 'B'])
    })
  })
})
