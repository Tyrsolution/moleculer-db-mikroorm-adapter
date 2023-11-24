import esbuild from 'rollup-plugin-esbuild';
import autoExternal from '@andrewleedham/rollup-plugin-auto-external';
import dtsBundle from 'rollup-plugin-dts-bundle';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json' assert { type: 'json' };

export default () => {
	const mainInput = {
		input: 'src/adapter/index.ts',
		treeshake: true,
		output: {
			sourcemap: false,
			format: 'cjs',
			file: pkg.main,
			exports: 'named',
		},
		plugins: [
			json(),
			commonjs(),
			autoExternal({
				builtins: true,
				peerDependencies: false,
				dependencies: true,
			}),
			esbuild({
				minify: false,
				target: 'esnext',
			}),
			dtsBundle({
				bundle: {
					name: '@tyrsolutions/moleculer-db-mikroorm-adapter',
					main: 'src/types/mikroormadapter.d.ts',
					out: '../../dist/index.d.ts', // Can be omitted, 'typings.d.ts' - default output.

					// Other 'dts-bundle' package options.
				},
			}),
			process.env.NODE_ENV === 'release' && uglify(),
		],
	};
	const esmInput = {
		...mainInput,
		output: {
			sourcemap: false,
			format: 'esm',
			file: pkg.module,
		},
	};
	return [mainInput, esmInput];
};
