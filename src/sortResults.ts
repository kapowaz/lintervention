import { IOverruleReport } from './types';

/**
 * Since we can’t reliably expect the sort command to work on all platforms,
 * it’s easier to just take the output and perform the sorting once we’ve
 * processed it on this end. This function sorts the results first by number of
 * occurrences, and then by the rule name alphabetically.
 */
export const sortResults = (results: IOverruleReport[]): IOverruleReport[] => {
  return results.sort((a: IOverruleReport, b: IOverruleReport) => {
    const aCount = parseInt(a.count, 10);
    const bCount = parseInt(b.count, 10);

    switch (true) {
      case aCount > bCount:
        return -1;
      case aCount < bCount:
        return 1;
      default:
        return a.rule.localeCompare(b.rule);
    }
  });
};
