/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';

import { loadCKEditorCloud } from '@/cdn/loadCKEditorCloud';
import { createCKBoxBundlePack } from '@/cdn/ckbox/createCKBoxCdnBundlePack';
import { removeCkCdnLinks, removeCkCdnScripts } from 'tests/_utils/ckCdnMocks';

describe( 'loadCKEditorCloud', () => {
	beforeEach( () => {
		removeCkCdnScripts();
		removeCkCdnLinks();

		vi.spyOn( console, 'error' ).mockImplementation( () => undefined );
	} );

	afterEach( () => {
		vi.restoreAllMocks();
	} );

	it( 'should be possible to load base ckeditor with base features', async () => {
		const { CKEditor, CKBox, CKEditorPremiumFeatures } = await loadCKEditorCloud( {
			version: '43.0.0'
		} );

		expect( CKBox ).toBeUndefined();
		expect( CKEditorPremiumFeatures ).toBeUndefined();

		expect( CKEditor.ClassicEditor ).toBeDefined();
		expect( window.CKEDITOR_VERSION ).toBe( '43.0.0' );
	} );

	it( 'should be possible to load ckeditor with premium features', async () => {
		const { CKEditor, CKEditorPremiumFeatures } = await loadCKEditorCloud( {
			version: '43.0.0',
			premium: true
		} );

		expect( window.CKEDITOR_VERSION ).toBe( '43.0.0' );
		expect( CKEditor.ClassicEditor ).toBeDefined();
		expect( CKEditorPremiumFeatures?.AIAdapter ).toBeDefined();
	} );

	it( 'should be possible to load ckbox with base features', async () => {
		const { CKEditor, CKBox, CKEditorPremiumFeatures } = await loadCKEditorCloud( {
			version: '43.0.0',
			ckbox: {
				version: '2.5.1'
			}
		} );

		expect( CKEditor ).toBeDefined();
		expect( CKEditorPremiumFeatures ).toBeUndefined();
		expect( CKBox ).toBeDefined();
	} );

	it( 'should be possible to load custom plugins', async () => {
		const { CKEditor, CKPlugins } = await loadCKEditorCloud( {
			version: '43.0.0',
			plugins: {
				Plugin: createCKBoxBundlePack( {
					version: '2.5.1'
				} )
			}
		} );

		expect( CKEditor.ClassicEditor ).toBeDefined();
		expect( CKPlugins?.Plugin ).toBeDefined();
	} );
} );
