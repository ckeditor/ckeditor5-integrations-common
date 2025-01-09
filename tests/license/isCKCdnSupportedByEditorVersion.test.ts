/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import { isCKCdnSupportedByEditorVersion } from '@/license/isCKCdnSupportedByEditorVersion.js';

describe( 'isCKCdnSupportedByEditorVersion', () => {
	it( 'should return true for testing versions', () => {
		expect( isCKCdnSupportedByEditorVersion( 'alpha' ) ).toBe( true );
		expect( isCKCdnSupportedByEditorVersion( 'nightly' ) ).toBe( true );
	} );

	it( 'should return true for version 44.x.x (license v3)', () => {
		expect( isCKCdnSupportedByEditorVersion( '44.0.0' ) ).toBe( true );
		expect( isCKCdnSupportedByEditorVersion( '44.1.0' ) ).toBe( true );
		expect( isCKCdnSupportedByEditorVersion( '44.1.1' ) ).toBe( true );
	} );

	it( 'should return true for version 43.x.x (license v1-v2)', () => {
		expect( isCKCdnSupportedByEditorVersion( '43.0.0' ) ).toBe( true );
		expect( isCKCdnSupportedByEditorVersion( '43.1.0' ) ).toBe( true );
		expect( isCKCdnSupportedByEditorVersion( '43.2.1' ) ).toBe( true );
	} );

	it( 'should return false for versions below 43.x.x', () => {
		expect( isCKCdnSupportedByEditorVersion( '42.0.0' ) ).toBe( false );
		expect( isCKCdnSupportedByEditorVersion( '41.1.0' ) ).toBe( false );
		expect( isCKCdnSupportedByEditorVersion( '40.0.0' ) ).toBe( false );
	} );
} );
