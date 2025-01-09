/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
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
			entry: 'src/index',
			fileName: 'index',
			formats: [ 'es', 'umd' ],
			name: 'CKEDITOR_INTEGRATIONS_COMMON'
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
			clearPureImport: false,
			beforeWriteFile: ( filePath, content ) => {
				// Force disable TypeScript checks for the CKEditor 5 Premium Features typings.
				// CKEditor 5 Premium Features typings are optional and might be missing in the project.
				// Some `tsconfig.json` with `skipLibCheck` set to `false` might fail to compile such project.
				if ( content.includes( 'from \'ckeditor5-premium-features\'' ) ) {
					content = `// @ts-nocheck\n${ content }`;
				}

				return {
					filePath,
					content
				};
			}
		} )
	]
} );
