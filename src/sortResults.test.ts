import sorted from './test/results/sorted.json';
import unsorted from './test/results/unsorted.json';
import { sortResults } from './sortResults';

describe('sortResults', () => {
  it('should sort results according to occurrence and then alphabetically by rule name', () => {
    const result = sortResults(unsorted);

    expect(result).toEqual(sorted);
  });
});
