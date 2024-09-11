/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect } from 'vitest';
import { createCKCdnPremiumBundlePack } from '@/cdn/ck/createCKCdnPremiumBundlePack';

describe( 'createCKCdnPremiumBundlePack', () => {
	it( 'should return a pack of resources for the CKEditor Premium Features', () => {
		const pack = createCKCdnPremiumBundlePack( {
			version: '43.0.0',
			translations: [ 'en', 'de' ]
		} );

		expect( pack.preload ).toEqual( [
			'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/ckeditor5-premium-features.css',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/ckeditor5-premium-features.umd.js',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/translations/en.umd.js',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/translations/de.umd.js'
		] );

		expect( pack.scripts ).toHaveLength( 1 );
		expect( pack.stylesheets ).toEqual( [
			'https://cdn.ckeditor.com/ckeditor5-premium-features/43.0.0/ckeditor5-premium-features.css'
		] );

		expect( pack.checkPluginLoaded ).toBeInstanceOf( Function );
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
} );
