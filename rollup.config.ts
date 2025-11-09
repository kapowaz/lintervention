import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs';
import { createRequire } from 'node:module';
import path from 'path';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { nodeExternals } from 'rollup-plugin-node-externals';

const rq = createRequire(import.meta.url);
const pkg = rq('./package.json');

const copyFiles = (from: string, to: string, overwrite = false) => {
  return {
    name: 'copy-files',
    generateBundle() {
      const log = (msg: string) => console.log('\x1b[36m%s\x1b[0m', msg);
      log(`copy files: ${from} → ${to}`);

      if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });

      fs.readdirSync(from).forEach((file) => {
        const fromFile = `${from}/${file}`;
        const toFile = `${to}/${file}`;
        if (fs.existsSync(toFile) && !overwrite) return;
        log(`• ${fromFile} → ${toFile}`);

        fs.copyFileSync(path.resolve(fromFile), path.resolve(toFile));
      });
    },
  };
};

const legacyOutputDefaults = {
  esModule: true,
  interop: 'compat',
};

export default [
  {
    input: 'src/index.ts',
    plugins: [
      nodeExternals({
        deps: true,
        peerDeps: true,
        packagePath: './package.json',
      }),
      commonjs(),
      resolve(),
      esbuild({
        target: 'es2018',
        tsconfig: 'tsconfig.build.json',
      }),

      copyFiles('./src/bin', './dist/bin'),
    ],
    output: [
      {
        format: 'cjs',
        sourcemap: true,
        file: pkg.main,
        ...legacyOutputDefaults,
      },
      {
        format: 'esm',
        sourcemap: true,
        dir: path.dirname(pkg.module),
        preserveModules: true,
        preserveModulesRoot: 'src',
        ...legacyOutputDefaults,
      },
    ],
  },
  {
    input: './compiled/index.d.ts',
    plugins: [dts()],
    output: [
      {
        file: pkg.exports['.'].require.types,
        format: 'cjs',
      },
      {
        file: pkg.exports['.'].import.types,
        format: 'esm',
      },
    ],
  },
];
