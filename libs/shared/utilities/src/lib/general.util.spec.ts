import { escapeRegExp } from 'lodash-es';

import {
  byAnimation,
  clamp,
  deepClone,
  getHorizontalDistance,
  getVerticalDistance,
  hasOwnProperty,
  isPrimitive,
  mockFailedRequest,
  mockRequest,
  normalizeWhiteSpace,
  orderSort,
  replaceAll,
  replaceInArray,
  stripQueryParams,
} from './general.util';

describe('General Util', () => {
  describe('clamp', () => {
    test('should work correctly', () => {
      expect(clamp(344, 1, 300)).toBe(300);
      expect(clamp(-1, 1, 300)).toBe(1);
      expect(clamp(1, 1, 300)).toBe(1);
      expect(clamp(300, 1, 300)).toBe(300);
    });
  });

  describe('deepClone', () => {
    test('should work correctly', () => {
      const s = { a: 1, b: 3 };
      const a = { s, i: 2 };

      expect(a.s).toBe(s);
      expect(a.s).toEqual(s);

      const res = deepClone(a);

      expect(res).not.toBe(a);
      expect(res).toEqual(a);
      expect(res.s).not.toBe(s);
      expect(res.s).toEqual(s);
    });
  });

  describe('isPrimitive', () => {
    test('should work correctly', () => {
      expect(isPrimitive(null)).toBe(true);
      expect(isPrimitive(undefined)).toBe(true);
      expect(isPrimitive(0)).toBe(true);
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive('')).toBe(true);

      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive([])).toBe(false);
      expect(isPrimitive(new Date())).toBe(false);
    });
  });

  describe('hasOwnProperty', () => {
    test('should work correctly', () => {
      expect(hasOwnProperty({ a: 0 }, 'a')).toBe(true);
      expect(hasOwnProperty({ a: 0 }, 'b')).toBe(false);
      expect(hasOwnProperty({}, 'b')).toBe(false);
      expect(hasOwnProperty({}, 'toString')).toBe(false);
    });
  });

  describe('normalizeWhitespace', () => {
    test('should work correctly', () => {
      expect(normalizeWhiteSpace(' aaaaa    bbbbb    cccccc    ')).toBe(
        ' aaaaa bbbbb cccccc ',
      );
    });
  });

  describe('escapeRegExp', () => {
    test('should return the same string if there are no special characters', () => {
      expect(escapeRegExp('test123')).toBe('test123');
    });

    test('should correctly handle an empty string', () => {
      expect(escapeRegExp('')).toBe('');
    });

    test('should escape special characters in a string', () => {
      const input = '.*+?^${}()|[]\\';
      const output = '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\';
      expect(escapeRegExp(input)).toBe(output);
    });

    test('should escape special characters in a mixed string', () => {
      const input = 'a.b*c?d(e)f[g]h|i^j$k\\l';
      const output = 'a\\.b\\*c\\?d\\(e\\)f\\[g\\]h\\|i\\^j\\$k\\\\l';
      expect(escapeRegExp(input)).toBe(output);
    });

    test('should handle strings with only one special character', () => {
      const specialCharacters = [
        '.',
        '*',
        '+',
        '?',
        '^',
        '$',
        '{',
        '}',
        '(',
        ')',
        '|',
        '[',
        ']',
        '\\',
      ];
      specialCharacters.forEach((char) => {
        const input = char;
        const output = `\\${char}`;
        expect(escapeRegExp(input)).toBe(output);
      });
    });

    test('should handle strings with multiple occurrences of the same special character', () => {
      const input = '...';
      const output = '\\.\\.\\.';
      expect(escapeRegExp(input)).toBe(output);
    });

    test('should handle strings with spaces and special characters', () => {
      const input =
        'a . b * c + d ? e ^ f $ g { h } i ( j ) k | l [ m ] n \\ o';
      const output =
        'a \\. b \\* c \\+ d \\? e \\^ f \\$ g \\{ h \\} i \\( j \\) k \\| l \\[ m \\] n \\\\ o';
      expect(escapeRegExp(input)).toBe(output);
    });
  });

  describe('replaceAll', () => {
    test('should work for empty strings', () => {
      expect(replaceAll('', ',', 's')).toBe('');
    });

    test('should work for non empty strings with no matches', () => {
      expect(replaceAll('some text', ',', 's')).toBe('some text');
    });

    test('should work for non empty strings with one match', () => {
      expect(replaceAll('some , text', ',', 's')).toBe('some s text');
    });

    test('should work for non empty strings with multiple matches', () => {
      expect(replaceAll(',so,me , text,', ',', 's')).toBe('ssosme s texts');
    });
  });

  describe('replaceInArray', () => {
    test('should be able to bail out of broken params', () => {
      expect(
        replaceInArray(undefined as any, { id: 4 }, (item) => item.id === 4),
      ).toEqual([]);

      expect(
        replaceInArray(null as any, { id: 4 }, (item) => item.id === 4),
      ).toEqual([]);

      expect(
        replaceInArray({} as any, { id: 4 }, (item) => item.id === 4),
      ).toEqual([]);

      expect(
        replaceInArray(-Infinity as any, { id: 4 }, (item) => item.id === 4),
      ).toEqual([]);

      expect(replaceInArray([], { id: 4 }, (item) => item.id === 4)).toEqual(
        [],
      );

      expect(
        replaceInArray(
          [{ id: 332 }, { id: 32 }],
          { id: 4 },
          (item) => item.id === 4,
        ),
      ).toEqual([{ id: 332 }, { id: 32 }]);
    });

    test('should work correctly for objects', () => {
      expect(
        replaceInArray(
          [{ id: 1 }, { id: 32 }, { id: 4 }, { id: 63 }],
          { id: 83 },
          (item) => item.id === 4,
        ),
      ).toEqual([{ id: 1 }, { id: 32 }, { id: 83 }, { id: 63 }]);
    });

    test('should work correctly for strings', () => {
      expect(
        replaceInArray(
          ['some string', 'some other string', '3f'],
          'another string',
          (item) => item === '3f',
        ),
      ).toEqual(['some string', 'some other string', 'another string']);
    });

    test('should work correctly for numbers', () => {
      expect(replaceInArray([33, 43, 88], 1337, (item) => item === 33)).toEqual(
        [1337, 43, 88],
      );
    });

    test('should NOT mutate the original array', () => {
      const original = [33, 43, 88];
      const res = replaceInArray(original, 1337, (item) => item === 33);

      expect(res).not.toBe(original);
    });
  });

  describe('byAnimation', () => {
    test('should return a correct selector', () => {
      expect(byAnimation('something')).toBe('[data-animation="something"]');
    });
  });

  describe('stripQueryParams', () => {
    test('should correctly remove all query params from a URL', () => {
      expect(stripQueryParams('https://localhost:3001')).toBe(
        'https://localhost:3001/',
      );

      expect(
        stripQueryParams('https://localhost:3001?someParam=something'),
      ).toBe('https://localhost:3001/');

      expect(
        stripQueryParams(
          'https://localhost:3001?someParam=something&someOtherParams=somethingelse',
        ),
      ).toBe('https://localhost:3001/');

      expect(stripQueryParams('someurl.jpg')).toBe('someurl.jpg');
    });
  });

  describe('HTML Element Distance Methods', () => {
    let el1: HTMLElement;
    let el2: HTMLElement;

    const setElementPosition = (
      element: HTMLElement,
      position: Partial<DOMRect>,
    ): void => {
      element.getBoundingClientRect = jest.fn(
        () => ({ ...position }) as DOMRect,
      );
    };

    beforeEach(() => {
      el1 = document.createElement('div');
      el2 = document.createElement('div');

      document.body.appendChild(el1);
      document.body.appendChild(el2);
    });

    afterEach(() => {
      document.body.removeChild(el1);
      document.body.removeChild(el2);
    });

    describe('getVerticalDistance', () => {
      test('should return the vertical distance when el2 is below el1', () => {
        setElementPosition(el1, { bottom: 100 });
        setElementPosition(el2, { top: 200 });

        expect(getVerticalDistance(el1, el2)).toBe(100);
      });

      test('should return the vertical distance when el2 is above el1', () => {
        setElementPosition(el1, { bottom: 200 });
        setElementPosition(el2, { top: 100 });

        expect(getVerticalDistance(el1, el2)).toBe(100);
      });

      test('should return zero when el1 and el2 are touching', () => {
        setElementPosition(el1, { bottom: 100 });
        setElementPosition(el2, { top: 100 });

        expect(getVerticalDistance(el1, el2)).toBe(0);
      });

      test('should return the correct distance with decimal values', () => {
        setElementPosition(el1, { bottom: 99.5 });
        setElementPosition(el2, { top: 199.5 });

        expect(getVerticalDistance(el1, el2)).toBe(100);
      });

      test('should return the correct distance when elements have negative coordinates', () => {
        setElementPosition(el1, { bottom: -50 });
        setElementPosition(el2, { top: 50 });

        expect(getVerticalDistance(el1, el2)).toBe(100);
      });

      test('should return the correct distance when both elements have the same top and bottom', () => {
        setElementPosition(el1, { bottom: 100 });
        setElementPosition(el2, { top: 100 });

        expect(getVerticalDistance(el1, el2)).toBe(0);
      });
    });

    describe('getHorizontalPosition', () => {
      test('should return the horizontal distance when el2 is to the right of el1', () => {
        setElementPosition(el1, { right: 100 });
        setElementPosition(el2, { left: 200 });

        expect(getHorizontalDistance(el1, el2)).toBe(100);
      });

      test('should return the horizontal distance when el2 is to the left of el1', () => {
        setElementPosition(el1, { right: 200 });
        setElementPosition(el2, { left: 100 });

        expect(getHorizontalDistance(el1, el2)).toBe(100);
      });

      test('should return zero when el1 and el2 are touching horizontally', () => {
        setElementPosition(el1, { right: 100 });
        setElementPosition(el2, { left: 100 });

        expect(getHorizontalDistance(el1, el2)).toBe(0);
      });

      test('should return the correct distance with decimal values', () => {
        setElementPosition(el1, { right: 99.5 });
        setElementPosition(el2, { left: 199.5 });

        expect(getHorizontalDistance(el1, el2)).toBe(100);
      });

      test('should return the correct distance when elements have negative coordinates', () => {
        setElementPosition(el1, { right: -50 });
        setElementPosition(el2, { left: 50 });

        expect(getHorizontalDistance(el1, el2)).toBe(100);
      });

      test('should return the correct distance when both elements have the same left and right', () => {
        setElementPosition(el1, { right: 100 });
        setElementPosition(el2, { left: 100 });

        expect(getHorizontalDistance(el1, el2)).toBe(0);
      });
    });
  });

  describe('Mock Requests', () => {
    test('mockRequest', (done) => {
      const result = { a: 1, b: 2 };

      mockRequest(result).subscribe({
        next: (res) => {
          expect(res).toEqual(result);
        },
        complete: () => {
          done();
        },
      });
    });

    test('mockFailedRequest', (done) => {
      const error = { a: 1, b: 2 };

      mockFailedRequest(error).subscribe({
        error: (res) => {
          expect(res).toEqual(error);
          done();
        },
      });
    });
  });

  describe('orderSort', () => {
    test('should work if no items match the sort array', () => {
      const sortArray = [1, 2, 3, 4];
      const arrayToBeSorted = [5, 6, 7, 9];

      expect(orderSort(sortArray, arrayToBeSorted)).toEqual(arrayToBeSorted);
    });

    test('should work if items match the sort array', () => {
      const sortArray = [1, 'a', 2, 3, 'b', 4];
      const arrayToBeSorted = [4, 8, 9, 'a', 'b'];

      expect(orderSort(sortArray, arrayToBeSorted)).toEqual([
        'a',
        'b',
        4,
        8,
        9,
      ]);
    });
  });
});
