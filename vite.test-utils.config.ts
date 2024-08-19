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
			entry: 'tests/_utils/index',
			fileName: 'tests/_utils/index',
			formats: [ 'es' ]
		},
		sourcemap: true,
		emptyOutDir: false
	},
	plugins: [
		tsconfigPaths(),
		dts( {
			include: [ 'tests/_utils/**/*', 'src/**/*' ],
			exclude: [ '**/*.test.ts', '**/*.test.tsx' ],
			copyDtsFiles: true,
			clearPureImport: false
		} )
	]
} );
