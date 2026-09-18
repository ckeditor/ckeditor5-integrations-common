/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import { isCKVersion, isCKTestingVersion, isCKTestingChannel, extractCKTestingChannel } from '@/utils/version/isCKVersion.js';

describe( 'isCKTestingVersion', () => {
	const cases = {
		'alpha': true,
		'nightly': true,
		'staging': true,
		'nightly-abc': true,
		'nightly-next': true,
		'0.0.0-nightly-20241104.0': true,
		'0.0.0-internal-20241104.0': true,
		'43.3.0-alpha.12': true,

		'1.2.3': false,
		'1.2': false,
		'beta': false,
		'rc-1.2.3': false
	};

	for ( const [ version, expected ] of Object.entries( cases ) ) {
		it( `should return ${ expected } for "${ version }"`, () => {
			expect( isCKTestingVersion( version ) ).toBe( expected );
		} );
	}
} );

describe( 'isCKVersion', () => {
	const cases = {
		'alpha': true,
		'nightly': true,
		'staging': true,
		'nightly-abc': true,
		'1.2.3': true,
		'0.0.0-nightly-20241104.0': true,
		'43.3.0-alpha.12': true,

		'1.2': false,
		'beta': false,
		'rc-1.2.3': false
	};

	for ( const [ version, expected ] of Object.entries( cases ) ) {
		it( `should return ${ expected } for "${ version }"`, () => {
			expect( isCKVersion( version ) ).toBe( expected );
		} );
	}
} );

describe( 'isCKTestingChannel', () => {
	// Aliases resolved by the CDN, as opposed to concrete builds that merely belong to a channel.
	const cases = {
		'nightly': true,
		'alpha': true,
		'staging': true,
		'nightly-next': true,
		'nightly-abc': false,

		'0.0.0-nightly-20241104.0': false,
		'47.7.0-alpha.2': false,
		'1.2.3': false,
		'alphabet': false,
		'prenightly-abc': false,
		'': false
	};

	for ( const [ version, expected ] of Object.entries( cases ) ) {
		it( `should return ${ expected } for "${ version }"`, () => {
			expect( isCKTestingChannel( version ) ).toBe( expected );
		} );
	}

	it( 'should return false for an undefined version', () => {
		expect( isCKTestingChannel( undefined ) ).toBe( false );
	} );
} );

describe( 'extractCKTestingChannel', () => {
	const cases = {
		'nightly': 'nightly',
		'nightly-abc': 'nightly',
		'nightly-next': 'nightly',
		'alpha': 'alpha',
		'staging': 'staging',
		'0.0.0-nightly-20241104.0': 'nightly',
		'0.0.0-internal-20241104.0': 'internal',
		'43.3.0-alpha.12': 'alpha',
		'0.0.0-nightly-alpha.1': 'nightly',

		'1.2.3': null,
		'beta': null,
		'rc-1.2.3': null,
		'alphabet': null,
		'1.2.3-prenightly': null,
		'': null
	};

	for ( const [ version, expected ] of Object.entries( cases ) ) {
		it( `should return ${ expected === null ? 'null' : `"${ expected }"` } for "${ version }"`, () => {
			expect( extractCKTestingChannel( version ) ).toBe( expected );
		} );
	}
} );
