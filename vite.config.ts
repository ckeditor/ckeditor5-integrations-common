/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import 'vitest/config';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig( {
	build: {
		target: 'esnext',
		lib: {
			formats: [ 'es', 'cjs' ],
			entry: {
				index: 'src/index',
				'test-utils': 'src/test-utils'
			}
		},
		sourcemap: true,
		emptyOutDir: true,
		minify: false
	},
	plugins: [
		tsconfigPaths(),
		dts( {
			exclude: [ '**/*.test.ts', '**/*.test.tsx' ],
			copyDtsFiles: true,
			clearPureImport: false
		} )
	]
} );
