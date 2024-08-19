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
			entry: 'src/index',
			fileName: 'index',
			formats: [ 'es', 'umd' ],
			name: 'CKEDITOR_INTEGRATIONS_COMMON'
		},
		sourcemap: true,
		emptyOutDir: true
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
