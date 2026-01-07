/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
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
