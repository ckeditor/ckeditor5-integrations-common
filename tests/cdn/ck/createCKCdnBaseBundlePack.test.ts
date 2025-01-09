/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach } from 'vitest';

import type { CKCdnVersion } from '@/cdn/ck/isCKCdnVersion.js';

import {
	createCKCdnBaseBundlePack,
	type CKCdnBaseBundlePackConfig
} from '@/cdn/ck/createCKCdnBaseBundlePack.js';

import { removeAllCkCdnResources } from '@/test-utils/cdn/removeAllCkCdnResources.js';
import { loadCKCdnResourcesPack } from '@/cdn/utils/loadCKCdnResourcesPack.js';
import { createCKDocsUrl } from '@/docs/createCKDocsUrl.js';

describe( 'createCKCdnBaseBundlePack', () => {
	beforeEach( () => {
		removeAllCkCdnResources();
	} );

	it( 'should create a pack of resources for the base CKEditor bundle', () => {
		const config: CKCdnBaseBundlePackConfig = {
			version: '43.0.0',
			translations: [ 'pl', 'de' ]
		};

		const pack = createCKCdnBaseBundlePack( config );

		expect( pack.preload ).toEqual( [
			'https://cdn.ckeditor.com/ckeditor5/43.0.0/ckeditor5.css',
			'https://cdn.ckeditor.com/ckeditor5/43.0.0/ckeditor5.umd.js',
			'https://cdn.ckeditor.com/ckeditor5/43.0.0/translations/pl.umd.js',
			'https://cdn.ckeditor.com/ckeditor5/43.0.0/translations/de.umd.js'
		] );

		expect( pack.scripts ).toHaveLength( 1 );
		expect( pack.scripts![ 0 ] ).toBeInstanceOf( Function );

		expect( pack.stylesheets ).toEqual( [
			'https://cdn.ckeditor.com/ckeditor5/43.0.0/ckeditor5.css'
		] );

		expect( pack.checkPluginLoaded ).toBeInstanceOf( Function );
	} );

	it( 'should not load default EN translation script as it is already bundled', () => {
		const pack = createCKCdnBaseBundlePack( {
			version: '43.0.0',
			translations: [ 'en', 'en-GB' ]
		} );

		expect( pack ).to.toMatchObject( {
			checkPluginLoaded: expect.any( Function ),
			stylesheets: [
				'https://cdn.ckeditor.com/ckeditor5/43.0.0/ckeditor5.css'
			],
			scripts: [
				expect.any( Function )
			],
			preload: [
				'https://cdn.ckeditor.com/ckeditor5/43.0.0/ckeditor5.css',
				'https://cdn.ckeditor.com/ckeditor5/43.0.0/ckeditor5.umd.js',
				'https://cdn.ckeditor.com/ckeditor5/43.0.0/translations/en-GB.umd.js'
			]
		} );
	} );

	it( 'should not load any language if not provided', () => {
		const pack = createCKCdnBaseBundlePack( {
			version: '43.0.0'
		} );

		expect( pack ).to.toMatchObject( {
			checkPluginLoaded: expect.any( Function ),
			stylesheets: [
				'https://cdn.ckeditor.com/ckeditor5/43.0.0/ckeditor5.css'
			],
			scripts: [
				expect.any( Function )
			],
			preload: [
				'https://cdn.ckeditor.com/ckeditor5/43.0.0/ckeditor5.css',
				'https://cdn.ckeditor.com/ckeditor5/43.0.0/ckeditor5.umd.js'
			]
		} );
	} );

	it( 'should allow to specify custom CDN urls using `createCustomCdnUrl` parameter', () => {
		const pack = createCKCdnBaseBundlePack( {
			version: '43.0.0',
			createCustomCdnUrl: ( type, name, version ) => `https://cdn.example.com/${ type }/${ name }/${ version }`
		} );

		expect( pack ).to.toMatchObject( {
			checkPluginLoaded: expect.any( Function ),
			stylesheets: [
				'https://cdn.example.com/ckeditor5/ckeditor5.css/43.0.0'
			],
			scripts: [
				expect.any( Function )
			],
			preload: [
				'https://cdn.example.com/ckeditor5/ckeditor5.css/43.0.0',
				'https://cdn.example.com/ckeditor5/ckeditor5.umd.js/43.0.0'
			]
		} );
	} );

	it( 'should throw an error if the requested version differs from the installed one', async () => {
		await loadCKEditor( '43.0.0' );
		await expect( async () => loadCKEditor( '42.0.0' ) ).rejects.toThrowError(
			'CKEditor 5 is already loaded from CDN in version 43.0.0. ' +
			'Remove the old <script> and <link> tags loading CKEditor 5 to allow loading the 42.0.0 version.'
		);
	} );

	it( 'should not throw an error if the requested version is the same as the installed one', async () => {
		await loadCKEditor( '43.0.0' );
		await expect( loadCKEditor( '43.0.0' ) ).resolves.not.toThrow();
	} );

	it( 'should throw an error if CKEditor 5 is loaded from NPM', async () => {
		window.CKEDITOR_VERSION = '41.0.0';

		await expect( async () => loadCKEditor( '43.0.0' ) ).rejects.toThrowError(
			'CKEditor 5 is already loaded from npm. Check the migration guide for more details: ' +
			createCKDocsUrl( 'updating/migration-to-cdn/vanilla-js.html' )
		);
	} );
} );

function loadCKEditor( version: CKCdnVersion ) {
	return loadCKCdnResourcesPack(
		createCKCdnBaseBundlePack( {
			version
		} )
	);
}
