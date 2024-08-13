/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig( {
	plugins: [ tsconfigPaths() ],
	test: {
		globals: false,
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
