/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import 'vitest/config';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig( {
	build: {
		target: 'esnext',
		lib: {
			entry: 'src/test-utils/index',
			fileName: 'test-utils/index',
			formats: [ 'es' ]
		},
		sourcemap: true,
		emptyOutDir: false
	},
	plugins: [
		tsconfigPaths(),
		dts( {
			include: [ 'src/test-utils/**/*.ts' ],
			exclude: [ '**/*.test.ts', '**/*.test.tsx' ],
			copyDtsFiles: true,
			clearPureImport: false,
			compilerOptions: {
				baseUrl: './src/test-utils'
			}
		} )
	]
} );
