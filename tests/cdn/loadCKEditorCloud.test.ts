/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	describe, it, vi, expect,
	expectTypeOf, beforeEach, afterEach
} from 'vitest';

import type { AIAdapter } from 'ckeditor5-premium-features';

import { loadCKEditorCloud } from '@/cdn/loadCKEditorCloud';
import { createCKBoxBundlePack } from '@/cdn/ckbox/createCKBoxCdnBundlePack';
import { removeCkCdnLinks, removeCkCdnScripts } from 'tests/_utils/ckCdnMocks';
import { createCKBoxCdnUrl } from '@/cdn/ckbox/createCKBoxCdnUrl';

describe( 'loadCKEditorCloud', () => {
	beforeEach( () => {
		removeCkCdnScripts();
		removeCkCdnLinks();

		vi.spyOn( console, 'error' ).mockImplementation( () => undefined );
		window.FakePlugin = { fake: 'fake' };
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
		const { CKEditor, loadedPlugins } = await loadCKEditorCloud( {
			version: '43.0.0',
			plugins: {
				Plugin: createCKBoxBundlePack( {
					version: '2.5.1'
				} )
			}
		} );

		expect( CKEditor.ClassicEditor ).toBeDefined();
		expect( loadedPlugins?.Plugin ).toBeDefined();
	} );

	describe( 'typings', () => {
		it( 'should properly infer type of global variable if checkPluginLoaded is not provided', async () => {
			const { loadedPlugins } = await loadCKEditorCloud( {
				version: '43.0.0',
				plugins: {
					FakePlugin: [ createCKBoxCdnUrl( 'ckbox', 'ckbox.js', '2.5.1' ) ]
				}
			} );

			expectTypeOf( loadedPlugins.FakePlugin ).toEqualTypeOf<FakePlugin>();
		} );

		it( 'should properly infer type of global variable if checkPluginLoaded is provided', async () => {
			const { loadedPlugins } = await loadCKEditorCloud( {
				version: '43.0.0',
				plugins: {
					FakePlugin: {
						scripts: [ createCKBoxCdnUrl( 'ckbox', 'ckbox.js', '2.5.1' ) ],
						checkPluginLoaded: () => window.FakePlugin2
					}
				}
			} );

			expectTypeOf( loadedPlugins.FakePlugin ).toEqualTypeOf<FakePlugin2>();
		} );

		it( 'should set CKBox result type as non-nullable if ckbox config is provided', async () => {
			const { CKBox } = await loadCKEditorCloud( {
				version: '43.0.0',
				ckbox: {
					version: '2.5.1'
				}
			} );

			expectTypeOf( CKBox ).not.toBeNullable();
		} );

		it( 'should set CKBox result type as nullable if ckbox config is not provided', async () => {
			const { CKBox } = await loadCKEditorCloud( {
				version: '43.0.0'
			} );

			expectTypeOf( CKBox ).toBeUndefined();
		} );

		it( 'should set CKEditorPremiumFeatures type as non-nullable if premium=true config is provided', async () => {
			const { CKEditorPremiumFeatures } = await loadCKEditorCloud( {
				version: '43.0.0',
				premium: true,
				ckbox: {
					version: '2.5.1'
				}
			} );

			expectTypeOf( CKEditorPremiumFeatures ).not.toBeNullable();
			expectTypeOf( CKEditorPremiumFeatures.AIAdapter ).toEqualTypeOf<typeof AIAdapter>();
		} );

		it( 'should set CKEditorPremiumFeatures type as nullable if premium=true config is not provided', async () => {
			const { CKEditorPremiumFeatures } = await loadCKEditorCloud( {
				version: '43.0.0',
				ckbox: {
					version: '2.5.1'
				}
			} );

			expectTypeOf( CKEditorPremiumFeatures ).toBeUndefined();
		} );
	} );
} );

type FakePlugin = {
	fake: string;
};

type FakePlugin2 = {
	abc: number;
};

declare global {
	interface Window {
		FakePlugin: FakePlugin;
		FakePlugin2: FakePlugin2;
	}
}
