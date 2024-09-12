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
import { createCKBoxCdnUrl } from '@/cdn/ckbox/createCKBoxCdnUrl';

import { queryPreload, queryScript, queryStylesheet, removeAllCkCdnResources } from '../_utils';
import { createCKCdnUrl } from '@/src/cdn/ck/createCKCdnUrl';
import {
	queryAllInjectedLinks,
	queryAllInjectedScripts
} from '../_utils/queryInjectedElements';

describe( 'loadCKEditorCloud', () => {
	beforeEach( () => {
		removeAllCkCdnResources();

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

	describe( 'CSP', () => {
		it( 'should set crossorigin=anonymous attribute on injected elements if attributes are not specified', async () => {
			console.info( queryAnonymousLinks()[ 0 ] );

			expect( queryAnonymousLinks() ).toHaveLength( 0 );
			expect( queryAnonymousScripts() ).toHaveLength( 0 );

			await loadCKEditorCloud( {
				version: '43.0.0'
			} );

			expect( queryAnonymousLinks() ).toHaveLength( 3 );
			expect( queryAnonymousScripts() ).toHaveLength( 1 );
		} );

		it( 'should not set crossorigin attribute on injected elements if attributes are specified but are blank', async () => {
			expect( queryAnonymousLinks() ).toHaveLength( 0 );
			expect( queryAnonymousScripts() ).toHaveLength( 0 );

			await loadCKEditorCloud( {
				version: '43.0.0',
				injectedHtmlElementsAttributes: {}
			} );

			expect( queryAnonymousLinks() ).toHaveLength( 0 );
			expect( queryAnonymousScripts() ).toHaveLength( 0 );
		} );

		it( 'should be possible to override the `crossorigin` attribute', async () => {
			const promise = loadCKEditorCloud( {
				version: '43.0.0',
				injectedHtmlElementsAttributes: {
					crossorigin: 'use-credentials'
				}
			} );

			// It's fine because `use-credentials` throws an error in the vitest browser.
			expect( promise ).rejects.toThrowError();
		} );

		it( 'should set nonce attribute on injected elements if attributes are specified', async () => {
			await loadCKEditorCloud( {
				version: '43.0.0',
				injectedHtmlElementsAttributes: {
					nonce: 'test-nonce'
				}
			} );

			const script = createCKCdnUrl( 'ckeditor5', 'ckeditor5.umd.js', '43.0.0' );
			const link = createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '43.0.0' );

			expect( queryScript( script )?.getAttribute( 'nonce' ) ).toBe( 'test-nonce' );
			expect( queryStylesheet( link )?.getAttribute( 'nonce' ) ).toBe( 'test-nonce' );

			for ( const preloadLink of [ script, link ] ) {
				expect( queryPreload( preloadLink )?.getAttribute( 'nonce' ) ).toBe( 'test-nonce' );
			}
		} );

		function queryAnonymousScripts() {
			return queryAllInjectedScripts().filter( script => script.getAttribute( 'crossorigin' ) === 'anonymous' );
		}

		function queryAnonymousLinks() {
			return queryAllInjectedLinks().filter( link => link.getAttribute( 'crossorigin' ) === 'anonymous' );
		}
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
