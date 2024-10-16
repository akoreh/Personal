const composeSelector = (
  selector: string,
  id: string,
  strict: boolean,
): string => `[${selector}${strict ? '' : '*'}="${id}"]`;

export const byCy = (id: string): string =>
  composeSelector('data-cy', id, true);
export const byTestId = (id: string): string =>
  composeSelector('data-testid', id, true);
export const byCyIncludes = (id: string): string =>
  composeSelector('data-cy', id, false);
export const byTestIdIncludes = (id: string): string =>
  composeSelector('data-testid', id, false);
