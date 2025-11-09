import { defineConfig, globalIgnores } from 'eslint/config';

import config from '@kapowaz/eslint-config';

export default defineConfig(config, [
  globalIgnores(
    ['coverage/**/*', 'dist/**/*', 'dist-cdn/**/*', 'src/test/sample/**/*'],
    'Ignore Build Directory',
  ),
]);
