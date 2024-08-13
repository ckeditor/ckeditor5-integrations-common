/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import 'vitest/config';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

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
	test: {
		globals: true,
		include: [ 'tests/**/*.test.ts' ],
		coverage: {
			provider: 'istanbul',
			include: [ 'src/*' ],
			exclude: [ 'src/demos' ],
			reporter: [
				'text-summary',
				'html',
				'lcovonly',
				'json'
			],
			reportOnFailure: true,
			thresholds: {
				100: true
			}
		}
	},
	plugins: [
		dts( {
			exclude: [ '**/*.test.ts', '**/*.test.tsx' ]
		} )
	]
} );
