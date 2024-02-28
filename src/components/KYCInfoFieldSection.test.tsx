import { getDropdownValues } from './KYCInfoFieldSection'
import {idTypeReverseFormatter} from "./kycInfo/PersonalDataAndDocumentsDetailed";

describe('KYCInfoFieldSection', () => {
  describe('getDropdownValues', () => {
    it('returns allowedValues if choices is undefined', () => {
      const allowedValues: [string, ...string[]] = ['a', 'b']
      const choices = undefined
      const reverseFormatter = undefined
      const result = getDropdownValues({
        allowedValues,
        choices,
        reverseFormatter,
      })
      expect(result).toEqual(allowedValues)
    })
    it('returns choices if allowedValues is undefined', () => {
      const allowedValues = undefined
      const choices: [string, ...string[]] = ['a', 'b']
      const reverseFormatter = undefined
      const result = getDropdownValues({
        allowedValues,
        choices,
        reverseFormatter,
      })
      expect(result).toEqual(choices)
    })
    it('returns choices that are in allowedValues', () => {
      const allowedValues: [string, ...string[]] = ['a', 'b']
      const choices: [string, ...string[]] = ['a', 'b', 'c']
      const reverseFormatter = undefined
      const result = getDropdownValues({
        allowedValues,
        choices,
        reverseFormatter,
      })
      expect(result).toEqual(allowedValues)
    })
    it('returns allowedValues if no choices are in allowedValues', () => {
      const allowedValues: [string, ...string[]] = ['a', 'b']
      const choices: [string, ...string[]] = ['c', 'd']
      const reverseFormatter = undefined
      const result = getDropdownValues({
        allowedValues,
        choices,
        reverseFormatter,
      })
      expect(result).toEqual(allowedValues)
    })
    it('returns human-readable values', () => {
      const optionAid = 'a'
      const optionAhumanReadable = 'Option A'
      const optionBid = 'b'
      const optionBhumanReadable = 'Option B'
      const allowedValues: [string, ...string[]] = [optionAid, optionBid]
      const choices: [string, ...string[]] = [
        optionAhumanReadable,
        optionBhumanReadable,
        'Option C',
      ]
      const reverseFormatter = (optionId: string) =>
        `Option ${optionId.toUpperCase()}`
      const result = getDropdownValues({
        allowedValues,
        choices,
        reverseFormatter,
      })
      expect(result).toEqual(['Option A', 'Option B'])
    })
    it('works for ID type field', () => {
      const allowedValues: [string, ...string[]] = ['IDC', 'PAS']
      const choices: [string, ...string[]] = [
        'State-issued ID',
        'Passport',
        "Driver's License",
      ]
      const reverseFormatter = idTypeReverseFormatter
      const result = getDropdownValues({
        allowedValues,
        choices,
        reverseFormatter,
      })
      expect(result).toEqual(['State-issued ID', 'Passport'])
    })
  })
})
