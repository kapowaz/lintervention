import { sortResults } from './sortResults';

const unsorted = [
  { count: '2', rule: 'import/no-extraneous-dependencies' },
  { count: '1', rule: 'no-param-reassign' },
  { count: '1', rule: '@typescript-eslint/no-non-null-assertion' },
  { count: '3', rule: 'no-console' },
  { count: '1', rule: '@typescript-eslint/no-unused-vars' },
  { count: '1', rule: 'no-undef' },
];

describe('sortResults', () => {
  it('should sort results according to occurrence and then alphabetically by rule name', () => {
    const result = sortResults(unsorted);

    expect(result).toEqual([
      { count: '3', rule: 'no-console' },
      { count: '2', rule: 'import/no-extraneous-dependencies' },
      { count: '1', rule: '@typescript-eslint/no-non-null-assertion' },
      { count: '1', rule: '@typescript-eslint/no-unused-vars' },
      { count: '1', rule: 'no-param-reassign' },
      { count: '1', rule: 'no-undef' },
    ]);
  });
});
