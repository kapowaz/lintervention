import { reportDisabled } from '../reportDisabled';

const table = ({
  heading,
  headings,
  rows,
}: {
  heading: string;
  headings: string[];
  rows: string[][];
}) => `#### ${heading}

|${headings.join('|')}|
|${headings.map(() => '---').join('|')}|
${rows.map((row) => `|${row.join('|')}|`).join('\n')}
`;

export const dangerReport = async () => {
  const directives = await reportDisabled({});
  const headings = ['Count', 'Rule'];
  const rows = directives.map(({ count, rule }) => [count, rule]);

  table({ heading: 'Lintervention Report', headings, rows });
};
