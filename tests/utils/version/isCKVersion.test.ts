/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import { isCKVersion, isCKTestingVersion, extractCKTestingChannel } from '@/utils/version/isCKVersion.js';

const testCases = [
	{ version: 'alpha', isTesting: true, isVersion: true, channel: 'alpha' },
	{ version: 'nightly', isTesting: true, isVersion: true, channel: 'nightly' },
	{ version: 'rc-1.2.3', isTesting: false, isVersion: false, channel: null },
	{ version: '1.2.3', isTesting: false, isVersion: true, channel: null },
	{ version: 'beta', isTesting: false, isVersion: false, channel: null },
	{ version: '1.2', isTesting: false, isVersion: false, channel: null },
	{ version: '0.0.0-nightly-20241104.0', isTesting: true, isVersion: true, channel: 'nightly' },
	{ version: '0.0.0-internal-20241104.0', isTesting: true, isVersion: true, channel: 'internal' },
	{ version: '43.3.0-alpha.12	', isTesting: true, isVersion: true, channel: 'alpha' },
	{ version: 'nightly-abc', isTesting: true, isVersion: true, channel: 'nightly' },
	{ version: 'staging', isTesting: true, isVersion: true, channel: 'staging' },
	{ version: 'nightly-next', isTesting: true, isVersion: true, channel: 'nightly' }
];

describe( 'isCKTestingVersion', () => {
	for ( const { version, isTesting } of testCases ) {
		it( `should return ${ isTesting } for "${ version }"`, () => {
			expect( isCKTestingVersion( version ) ).toBe( isTesting );
		} );
	}
} );

describe( 'isCKVersion', () => {
	for ( const { version, isVersion } of testCases ) {
		it( `should return ${ isVersion } for "${ version }"`, () => {
			expect( isCKVersion( version ) ).toBe( isVersion );
		} );
	}
} );

describe( 'extractCKTestingChannel', () => {
	for ( const { version, channel } of testCases ) {
		it( `should return ${ channel === null ? 'null' : `"${ channel }"` } for "${ version }"`, () => {
			expect( extractCKTestingChannel( version ) ).toBe( channel );
		} );
	}

	it( 'should not match a channel name embedded in a longer segment', () => {
		expect( extractCKTestingChannel( 'alphabet' ) ).toBe( null );
		expect( extractCKTestingChannel( '1.2.3-prenightly' ) ).toBe( null );
	} );

	it( 'should return the first channel found in the version', () => {
		expect( extractCKTestingChannel( '0.0.0-nightly-alpha.1' ) ).toBe( 'nightly' );
	} );

	it( 'should return null for an empty string', () => {
		expect( extractCKTestingChannel( '' ) ).toBe( null );
	} );
} );
