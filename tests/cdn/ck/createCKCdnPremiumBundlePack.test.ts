/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach } from 'vitest';

import type { CKCdnVersion } from '@/cdn/ck/isCKCdnVersion.js';

import { loadCKCdnResourcesPack } from '@/cdn/utils/loadCKCdnResourcesPack.js';
import { removeAllCkCdnResources } from '@/test-utils/cdn/removeAllCkCdnResources.js';

import { createCKCdnPremiumBundlePack } from '@/cdn/ck/createCKCdnPremiumBundlePack.js';
import { createCKCdnBaseBundlePack } from '@/cdn/ck/createCKCdnBaseBundlePack.js';

describe( 'createCKCdnPremiumBundlePack', () => {
	beforeEach( () => {
		removeAllCkCdnResources();
	} );

	it( 'should return a pack of resources for the CKEditor Premium Features', () => {
		const pack = createCKCdnPremiumBundlePack( {
			version: '44.3.0',
			translations: [ 'es', 'de' ]
		} );

		expect( pack.preload ).toEqual( [
			'https://cdn.ckeditor.com/ckeditor5-premium-features/44.3.0/ckeditor5-premium-features.css',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/44.3.0/ckeditor5-premium-features.umd.js',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/44.3.0/translations/es.umd.js',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/44.3.0/translations/de.umd.js'
		] );

		expect( pack.scripts ).toHaveLength( 1 );
		expect( pack.stylesheets ).toEqual( [
			'https://cdn.ckeditor.com/ckeditor5-premium-features/44.3.0/ckeditor5-premium-features.css'
		] );

		expect( pack.checkPluginLoaded ).toBeInstanceOf( Function );
	} );

	it( 'should not load default EN translation script as it is already bundled', () => {
		const pack = createCKCdnPremiumBundlePack( {
			version: '44.3.0',
			translations: [ 'en', 'en-GB' ]
		} );

		expect( pack ).to.toMatchObject( {
			checkPluginLoaded: expect.any( Function ),
			stylesheets: [
				'https://cdn.ckeditor.com/ckeditor5-premium-features/44.3.0/ckeditor5-premium-features.css'
			],
			scripts: [
				expect.any( Function )
			],
			preload: [
				'https://cdn.ckeditor.com/ckeditor5-premium-features/44.3.0/ckeditor5-premium-features.css',
				'https://cdn.ckeditor.com/ckeditor5-premium-features/44.3.0/ckeditor5-premium-features.umd.js',
				'https://cdn.ckeditor.com/ckeditor5-premium-features/44.3.0/translations/en-GB.umd.js'
			]
		} );
	} );

	it( 'should allow to specify custom CDN urls using `createCustomCdnUrl` parameter', () => {
		const pack = createCKCdnPremiumBundlePack( {
			version: '44.3.0',
			createCustomCdnUrl: ( type, path, version ) => `https://example.com/${ type }/${ path }/${ version }`
		} );

		expect( pack ).to.toMatchObject( {
			checkPluginLoaded: expect.any( Function ),
			stylesheets: [
				'https://example.com/ckeditor5-premium-features/ckeditor5-premium-features.css/44.3.0'
			],
			scripts: [
				expect.any( Function )
			],
			preload: [
				'https://example.com/ckeditor5-premium-features/ckeditor5-premium-features.css/44.3.0',
				'https://example.com/ckeditor5-premium-features/ckeditor5-premium-features.umd.js/44.3.0'
			]
		} );
	} );

	it( 'should not load any language if not provided', () => {
		const pack = createCKCdnPremiumBundlePack( {
			version: '44.3.0'
		} );

		expect( pack ).to.toMatchObject( {
			checkPluginLoaded: expect.any( Function ),
			stylesheets: [
				'https://cdn.ckeditor.com/ckeditor5-premium-features/44.3.0/ckeditor5-premium-features.css'
			],
			scripts: [
				expect.any( Function )
			],
			preload: [
				'https://cdn.ckeditor.com/ckeditor5-premium-features/44.3.0/ckeditor5-premium-features.css',
				'https://cdn.ckeditor.com/ckeditor5-premium-features/44.3.0/ckeditor5-premium-features.umd.js'
			]
		} );
	} );

	describe( 'error handling', () => {
		beforeEach( async () => {
			await loadCKCdnResourcesPack(
				createCKCdnBaseBundlePack( {
					version: '44.3.0'
				} )
			);
		} );

		it( 'should not throw an error if the requested version is the same as the installed one', async () => {
			await loadCKPremiumFeatures( '44.3.0' );
			await expect( loadCKPremiumFeatures( '44.3.0' ) ).resolves.not.toThrow();
		} );
	} );
} );

function loadCKPremiumFeatures( version: CKCdnVersion ) {
	return loadCKCdnResourcesPack(
		createCKCdnPremiumBundlePack( {
			version
		} )
	);
}
