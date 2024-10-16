import { byCy, byTestId, byTestIdIncludes } from './selectors';

describe('Testing Selectors', () => {
  test('byCy', () => {
    expect(byCy('someId')).toBe('[data-cy="someId"]');
    expect(byCy('aaaaaaa')).toBe('[data-cy="aaaaaaa"]');
  });

  test('byTestId', () => {
    expect(byTestId('someId')).toBe('[data-testid="someId"]');
    expect(byTestId('aaaaaaa')).toBe('[data-testid="aaaaaaa"]');
  });

  test('byTestIdIncludes', () => {
    expect(byTestIdIncludes('someId')).toBe('[data-testid*="someId"]');
    expect(byTestIdIncludes('aaaaaaa')).toBe('[data-testid*="aaaaaaa"]');
  });
});
