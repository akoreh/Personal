import {
  isBooleanString,
  isEmptyString,
  isNumberString,
} from './is-utils.util';

describe('Is Utils', () => {
  describe('isEmptyString', () => {
    test('should work correctly', () => {
      expect(isEmptyString('')).toBeTruthy();
      expect(isEmptyString(' ')).toBeTruthy();
      expect(isEmptyString('    ')).toBeTruthy();
      expect(isEmptyString('s')).toBeFalsy();
      expect(isEmptyString(' s')).toBeFalsy();
    });
  });

  describe('isBooleanString', () => {
    test('should work correctly', () => {
      expect(isBooleanString('')).toBeFalsy();
      expect(isBooleanString('true')).toBeTruthy();
      expect(isBooleanString('false')).toBeTruthy();
    });
  });

  describe('isNumberString', () => {
    test('should work', () => {
      expect(isNumberString('4 bed')).toBeFalsy();
      expect(isNumberString('4')).toBeTruthy();
      expect(isNumberString('04343434343')).toBeTruthy();
      expect(isNumberString('4.343')).toBeTruthy();
      expect(isNumberString('-1232.2222')).toBeTruthy();
    });
  });
});
