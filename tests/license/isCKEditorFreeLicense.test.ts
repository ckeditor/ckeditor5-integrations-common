/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, afterEach } from 'vitest';
import { isCKEditorFreeLicense } from '@/license/isCKEditorFreeLicense.js';

describe( 'isCKEditorFreeLicense', () => {
	afterEach( () => {
		window.CKEDITOR_VERSION = '';
	} );

	describe( 'v1 - v2', () => {
		it( 'should return true for undefined license key', () => {
			const result = isCKEditorFreeLicense( undefined, 1 );
			expect( result ).toBe( true );
		} );

		it( 'should return false for GPL license key', () => {
			const result = isCKEditorFreeLicense( 'GPL', 1 );
			expect( result ).toBe( false );
		} );
	} );

	describe( 'v3', () => {
		it( 'should return true for GPL license key', () => {
			const result = isCKEditorFreeLicense( 'GPL', 3 );
			expect( result ).toBe( true );
		} );

		it( 'should return false for undefined license key', () => {
			const result = isCKEditorFreeLicense( undefined, 3 );
			expect( result ).toBe( false );
		} );
	} );

	it( 'should use the license version from the installation info if not provided', () => {
		window.CKEDITOR_VERSION = '44.0.0';

		expect( isCKEditorFreeLicense( 'GPL' ) ).toBe( true );

		window.CKEDITOR_VERSION = '38.0.0';

		expect( isCKEditorFreeLicense( 'GPL' ) ).toBe( false );
	} );

	it( 'should return false for unknown license version', () => {
		const result = isCKEditorFreeLicense( 'GPL', 4 as any );

		expect( result ).toBe( false );
	} );

	it( 'should return false for non-GPL license key', () => {
		const result = isCKEditorFreeLicense( 'MIT' );
		expect( result ).toBe( false );
	} );

	it( 'should return false for plain license key', () => {
		const result = isCKEditorFreeLicense( 'asdj2yu43usdfjsdhfjsdfhj3278' );

		expect( result ).toBe( false );
	} );
} );
