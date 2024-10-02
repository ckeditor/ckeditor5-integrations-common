/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, beforeEach } from 'vitest';

import type { CKCdnVersion } from '@/cdn/ck/createCKCdnUrl.js';

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
			version: '43.0.0',
			translations: [ 'es', 'de' ]
		} );

		expect( pack.preload ).toEqual( [
			'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/ckeditor5-premium-features.css',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/ckeditor5-premium-features.umd.js',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/translations/es.umd.js',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/translations/de.umd.js'
		] );

		expect( pack.scripts ).toHaveLength( 1 );
		expect( pack.stylesheets ).toEqual( [
			'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/ckeditor5-premium-features.css'
		] );

		expect( pack.checkPluginLoaded ).toBeInstanceOf( Function );
	} );

	it( 'should not load default EN translation script as it is already bundled', () => {
		const pack = createCKCdnPremiumBundlePack( {
			version: '43.0.0',
			translations: [ 'en', 'en-GB' ]
		} );

		expect( pack ).to.toMatchObject( {
			checkPluginLoaded: expect.any( Function ),
			stylesheets: [
				'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/ckeditor5-premium-features.css'
			],
			scripts: [
				expect.any( Function )
			],
			preload: [
				'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/ckeditor5-premium-features.css',
				'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/ckeditor5-premium-features.umd.js',
				'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/translations/en-GB.umd.js'
			]
		} );
	} );

	it( 'should not load any language if not provided', () => {
		const pack = createCKCdnPremiumBundlePack( {
			version: '43.0.0'
		} );

		expect( pack ).to.toMatchObject( {
			checkPluginLoaded: expect.any( Function ),
			stylesheets: [
				'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/ckeditor5-premium-features.css'
			],
			scripts: [
				expect.any( Function )
			],
			preload: [
				'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/ckeditor5-premium-features.css',
				'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/ckeditor5-premium-features.umd.js'
			]
		} );
	} );

	describe( 'error handling', () => {
		beforeEach( async () => {
			await loadCKCdnResourcesPack(
				createCKCdnBaseBundlePack( {
					version: '43.0.0'
				} )
			);
		} );

		it( 'should not throw an error if the requested version is the same as the installed one', async () => {
			await loadCKPremiumFeatures( '43.0.0' );
			await expect( loadCKPremiumFeatures( '43.0.0' ) ).resolves.not.toThrow();
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
