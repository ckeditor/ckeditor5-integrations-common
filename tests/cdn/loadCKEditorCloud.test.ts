/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import {
	describe, it, vi, expect,
	expectTypeOf, beforeEach, afterEach
} from 'vitest';

import type { AIAdapter } from 'ckeditor5-premium-features';

import { loadCKEditorCloud } from '@/cdn/loadCKEditorCloud.js';
import { removeAllCkCdnResources } from '@/test-utils/cdn/removeAllCkCdnResources.js';
import { createCKBoxBundlePack } from '@/cdn/ckbox/createCKBoxCdnBundlePack.js';
import { createCKBoxCdnUrl } from '@/cdn/ckbox/createCKBoxCdnUrl.js';

import { queryPreload, queryScript, queryStylesheet } from '@/utils/queryHeadElement.js';
import { createCKCdnUrl } from '@/cdn/ck/createCKCdnUrl.js';
import {
	queryAllInjectedLinks,
	queryAllInjectedScripts
} from '@/utils/queryAllInjectedElements.js';

describe( 'loadCKEditorCloud', () => {
	beforeEach( () => {
		removeAllCkCdnResources();

		vi.spyOn( console, 'error' ).mockImplementation( () => undefined );
		vi.spyOn( console, 'warn' ).mockImplementation( () => undefined );

		window.FakePlugin = { fake: 'fake' };
	} );

	afterEach( () => {
		vi.restoreAllMocks();
	} );

	for ( const version of [ 'alpha', 'internal' ] as const ) {
		it( `should raise warning if ${ version } version is used`, async () => {
			const { CKEditor } = await loadCKEditorCloud( {
				version
			} );

			expect( CKEditor.ClassicEditor ).toBeDefined();
			expect( console.warn ).toBeCalledWith(
				'You are using a testing version of CKEditor 5. Please remember that it is not suitable for production environments.'
			);
		} );
	}

	it( 'should raise exception if unsupported version is passed', () => {
		expect( () => loadCKEditorCloud( { version: '42.0.0' } ) ).toThrowError(
			'The CKEditor 5 CDN can\'t be used with the given editor version: 42.0.0. ' +
			'Please make sure you are using at least the CKEditor 5 version 44.'
		);
	} );

	it( 'should not raise a warning if non-testing version is passed', async () => {
		const { CKEditor } = await loadCKEditorCloud( {
			version: '43.0.0'
		} );

		expect( CKEditor.ClassicEditor ).toBeDefined();
		expect( console.warn ).not.toBeCalled();
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

	it( 'should allow to specify custom CDN urls using `createCustomCdnUrl` parameter', async () => {
		const { CKEditor } = await loadCKEditorCloud( {
			version: '43.0.0',
			premium: true,
			createCustomCdnUrl: ( type, name, version ) => `${ createCKCdnUrl( type, name, version ) }?testParam=123`
		} );

		expect( CKEditor.ClassicEditor ).toBeDefined();

		expectBundleLoaded( 'ckeditor5' );
		expectBundleLoaded( 'ckeditor5-premium-features' );

		function expectBundleLoaded( bundleName: string ) {
			expect( queryScript( `${ createCKCdnUrl( bundleName, `${ bundleName }.umd.js`, '43.0.0' ) }?testParam=123` ) ).not.toBeNull();
			expect( queryStylesheet( `${ createCKCdnUrl( bundleName, `${ bundleName }.css`, '43.0.0' ) }?testParam=123` ) ).not.toBeNull();
		}
	} );

	describe( 'CSP', () => {
		it( 'should set crossorigin=anonymous attribute on injected elements if attributes are not specified', async () => {
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
			const setAttributeSpy = vi.spyOn( HTMLElement.prototype, 'setAttribute' );
			const promise = loadCKEditorCloud( {
				version: '43.0.0',
				injectedHtmlElementsAttributes: {
					crossorigin: 'use-credentials'
				}
			} );

			expect( setAttributeSpy ).toBeCalledWith( 'crossorigin', 'use-credentials' );
			expect( setAttributeSpy ).toBeCalledTimes( 6 );

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
