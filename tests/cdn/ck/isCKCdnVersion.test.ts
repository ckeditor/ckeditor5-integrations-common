/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import { isCKCdnVersion, isCKCdnTestingVersion } from '@/cdn/ck/isCKCdnVersion.js';

const testCases = [
	{ version: 'alpha', isTesting: true, isVersion: true },
	{ version: 'nightly', isTesting: true, isVersion: true },
	{ version: 'rc-1.2.3', isTesting: false, isVersion: false },
	{ version: '1.2.3', isTesting: false, isVersion: true },
	{ version: 'beta', isTesting: false, isVersion: false },
	{ version: '1.2', isTesting: false, isVersion: false },
	{ version: '0.0.0-nightly-20241104.0', isTesting: true, isVersion: true },
	{ version: '0.0.0-internal-20241104.0', isTesting: true, isVersion: true },
	{ version: '43.3.0-alpha.12	', isTesting: true, isVersion: true },
	{ version: 'nightly-abc', isTesting: true, isVersion: true },
	{ version: 'staging', isTesting: true, isVersion: true },
	{ version: 'nightly-next', isTesting: true, isVersion: true }
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
