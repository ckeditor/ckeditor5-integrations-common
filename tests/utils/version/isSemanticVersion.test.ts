/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import { isSemanticVersion } from '@/utils/version/isSemanticVersion.js';

describe( 'isSemanticVersion', () => {
	it( 'should return true for a valid semantic version', () => {
		expect( isSemanticVersion( '1.2.3' ) ).toBe( true );
		expect( isSemanticVersion( '1.2.3-beta' ) ).toBe( true );
		expect( isSemanticVersion( '1.2.3-beta.4' ) ).toBe( true );
		expect( isSemanticVersion( '1.2.3-beta.4+build' ) ).toBe( true );
		expect( isSemanticVersion( '1.2.3+build' ) ).toBe( true );
	} );

	it( 'should return false for an invalid semantic version', () => {
		expect( isSemanticVersion( '.01.0' ) ).toBe( false );
		expect( isSemanticVersion( 'alpha' ) ).toBe( false );
		expect( isSemanticVersion( '1.2' ) ).toBe( false );
		expect( isSemanticVersion( '' ) ).toBe( false );
		expect( isSemanticVersion( null ) ).toBe( false );
		expect( isSemanticVersion( undefined ) ).toBe( false );
	} );
} );
