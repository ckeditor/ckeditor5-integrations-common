/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect } from 'vitest';
import { isCKCdnVersion, isCKCdnTestingVersion } from '@/cdn/ck/isCKCdnVersion.js';

const testCases = [
	{ version: 'alpha', isTesting: true, isVersion: true },
	{ version: 'nightly', isTesting: true, isVersion: true },
	{ version: 'rc-1.2.3', isTesting: true, isVersion: true },
	{ version: '1.2.3', isTesting: false, isVersion: true },
	{ version: 'beta', isTesting: false, isVersion: false },
	{ version: '1.2', isTesting: false, isVersion: false }
];

describe( 'isCKCdnTestingVersion', () => {
	for ( const { version, isTesting } of testCases ) {
		it( `should return ${ isTesting } for "${ version }"`, () => {
			expect( isCKCdnTestingVersion( version ) ).toBe( isTesting );
		} );
	}
} );

describe( 'isCKCdnVersion', () => {
	for ( const { version, isVersion } of testCases ) {
		it( `should return ${ isVersion } for "${ version }"`, () => {
			expect( isCKCdnVersion( version ) ).toBe( isVersion );
		} );
	}
} );
