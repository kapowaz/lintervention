import eslint from 'eslint';

import config from '@kapowaz/eslint-config';

const { defineConfig, globalIgnores } = eslint;

export default defineConfig(config, [
  globalIgnores(
    ['coverage/**/*', 'dist/**/*', 'dist-cdn/**/*', 'src/test/sample/**/*'],
    'Ignore Build Directory',
  ),
  {
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: false },
      ],
    },
  },
]);
