/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';

import type { SemanticVersion } from '@/utils/version/isSemanticVersion.js';
import { destructureSemanticVersion } from '@/utils/version/destructureSemanticVersion.js';

describe( 'destructureSemanticVersion', () => {
	it( 'should destructure a valid semantic version', () => {
		expect( destructureSemanticVersion( '1.2.3' as SemanticVersion ) ).toEqual( { major: 1, minor: 2, patch: 3 } );
		expect( destructureSemanticVersion( '0.0.1' as SemanticVersion ) ).toEqual( { major: 0, minor: 0, patch: 1 } );
		expect( destructureSemanticVersion( '10.20.30' as SemanticVersion ) ).toEqual( { major: 10, minor: 20, patch: 30 } );
	} );

	it( 'should throw an error for an invalid semantic version', () => {
		expect( () => destructureSemanticVersion( '1.2' as SemanticVersion ) ).toThrow( 'Invalid semantic version: 1.2.' );
		expect( () => destructureSemanticVersion( 'alpha' as SemanticVersion ) ).toThrow( 'Invalid semantic version: alpha.' );
		expect( () => destructureSemanticVersion( '' as SemanticVersion ) ).toThrow( 'Invalid semantic version: <blank>.' );
	} );
} );
