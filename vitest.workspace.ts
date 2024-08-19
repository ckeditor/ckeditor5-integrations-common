/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { defineWorkspace } from 'vitest/config';

export default defineWorkspace( [
	{
		extends: './vitest.config.ts',
		test: {
			include: [ 'tests/**/*.node.test.ts' ],
			name: 'node',
			environment: 'node'
		}
	},
	{
		extends: './vitest.config.ts',
		test: {
			exclude: [ 'tests/**/*.node.test.ts' ],
			include: [ 'tests/**/*.test.ts' ],
			name: 'browser',
			browser: {
				provider: 'webdriverio',
				name: 'chrome',
				screenshotFailures: false,
				headless: true,
				enabled: true
			}
		}
	}
] );
