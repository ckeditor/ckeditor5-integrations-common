/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import type { SemanticVersion } from '@/src/utils/version/isSemanticVersion.js';
import { compareSemanticVersions, type VersionCompareResult } from '@/src/utils/version/compareSemanticVersions.js';

const COMPARE_VERSIONS: Array<[a: SemanticVersion, b: SemanticVersion, result: VersionCompareResult]> = [
	// Compare major versions.
	[ '45.0.0', '44.0.0', 1 ],
	[ '44.0.0', '45.0.0', -1 ],
	[ '44.0.0', '44.0.0', 0 ],

	// Compare minor versions.
	[ '44.1.0', '44.0.0', 1 ],
	[ '44.0.0', '44.1.0', -1 ],
	[ '44.2.0', '44.2.0', 0 ],

	// Compare patch versions
	[ '44.0.1', '44.0.0', 1 ],
	[ '44.0.0', '44.0.1', -1 ],
	[ '44.0.1', '44.0.1', 0 ],

	// Mixed
	[ '44.1.0', '45.0.0', -1 ],
	[ '44.6.0', '43.8.0', 1 ],
	[ '0.0.0', '45.0.0', -1 ],
	[ '44.6.0', '42.7.10', 1 ]
];

describe( 'compareSemanticVersions', () => {
	it.each( COMPARE_VERSIONS )( 'properly compare %s with %s version', ( a, b, result ) => {
		expect( compareSemanticVersions( a, b ) ).to.be.equal( result );
	} );
} );
