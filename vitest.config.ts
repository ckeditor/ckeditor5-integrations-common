/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { webdriverio } from '@vitest/browser-webdriverio';

export default defineConfig( {
	plugins: [ tsconfigPaths() ],
	test: {
		globals: false,
		restoreMocks: true,
		clearMocks: true,
		mockReset: true,
		unstubEnvs: true,
		unstubGlobals: true,
		projects: [ {
			extends: true,
			test: {
				include: [ 'tests/**/*.node.test.ts' ],
				name: 'node',
				environment: 'node'
			}
		}, {
			extends: true,
			test: {
				exclude: [ 'tests/**/*.node.test.ts' ],
				include: [ 'tests/**/*.test.ts' ],
				name: 'browser',
				browser: {
					provider: webdriverio(),
					instances: [ { browser: 'chrome' } ],
					screenshotFailures: false,
					headless: true,
					enabled: true
				}
			}
		} ],

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
	}
} );
