/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, vi, expect, vitest, beforeEach, afterEach } from 'vitest';

import { loadCKCdnResourcesPack } from '@/cdn/utils/loadCKCdnResourcesPack';
import { createCKCdnUrl } from '@/cdn/ck/createCKCdnUrl';
import {
	queryScript,
	queryStylesheet,
	queryPreload,
	removeCkCdnLinks,
	removeCkCdnScripts,
	CDN_MOCK_SCRIPT_URL,
	CDN_MOCK_STYLESHEET_URL
} from 'tests/_utils';
import { queryAllInjectedScripts } from '@/tests/_utils/queryInjectedElements';

describe( 'loadCKCdnResourcesPack', () => {
	beforeEach( () => {
		removeCkCdnScripts();
		removeCkCdnLinks();

		vi.spyOn( console, 'error' ).mockImplementation( () => undefined );
	} );

	afterEach( () => {
		vi.restoreAllMocks();
	} );

	it( 'should return the exported global variables', async () => {
		const checkPluginLoaded = vitest.fn( () => ( {
			ClassicEditor: {
				version: '30.0.0'
			}
		} ) );

		const result = await loadCKCdnResourcesPack( {
			checkPluginLoaded
		} );

		expect( result ).toEqual( {
			ClassicEditor: {
				version: '30.0.0'
			}
		} );

		expect( checkPluginLoaded ).toHaveBeenCalled();
	} );

	it( 'should not inject any script if the pack does not contain any', async () => {
		const result = {
			ClassicEditor: {
				version: '30.0.0'
			}
		};

		const loaded = await loadCKCdnResourcesPack( {
			checkPluginLoaded: () => result
		} );

		expect( result ).toEqual( loaded );
	} );

	it( 'should execute beforeInject callback before injecting the resources', async () => {
		const beforeInject = vi.fn().mockImplementation( () => {
			expect( window.CKEDITOR ).toBeUndefined();
			expect( queryAllInjectedScripts() ).toHaveLength( 0 );
		} );

		await loadCKCdnResourcesPack( {
			scripts: [ CDN_MOCK_SCRIPT_URL ],
			beforeInject
		} );

		expect( beforeInject ).toHaveBeenCalled();
	} );

	it( 'should inject the script if the pack contains one', async () => {
		const loaded = await loadCKCdnResourcesPack( {
			scripts: [ CDN_MOCK_SCRIPT_URL ],
			checkPluginLoaded: () => window.CKEDITOR!
		} );

		expect( loaded ).toBeDefined();
		expect( loaded ).toEqual( window.CKEDITOR );
	} );

	it( 'should be possible to define pack using plain array of scripts and stylesheets', async () => {
		expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).toBeNull();
		expect( queryStylesheet( CDN_MOCK_STYLESHEET_URL ) ).toBeNull();

		await loadCKCdnResourcesPack( [
			CDN_MOCK_SCRIPT_URL,
			CDN_MOCK_STYLESHEET_URL
		] );

		expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).not.toBeNull();
		expect( queryStylesheet( CDN_MOCK_STYLESHEET_URL ) ).not.toBeNull();
	} );

	it( 'should be possible to define pack using plain async function', async () => {
		const pack = await loadCKCdnResourcesPack( async () => ( { a: 2 } ) );

		expect( pack ).toEqual( { a: 2 } );
	} );

	it( 'should use preload property instead default one if passed', async () => {
		const loaded = await loadCKCdnResourcesPack( {
			preload: [ CDN_MOCK_SCRIPT_URL ],
			checkPluginLoaded: () => ( {
				result: 2
			} )
		} );

		expect( loaded ).toBeDefined();
		expect( queryPreload( CDN_MOCK_SCRIPT_URL ) ).not.toBeNull();
	} );

	it( 'should automatically preload all resources if preload property is not defined', async () => {
		const loaded = await loadCKCdnResourcesPack( {
			scripts: [ CDN_MOCK_SCRIPT_URL ],
			stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
			checkPluginLoaded: () => ( {
				result: 2
			} )
		} );

		expect( loaded ).toBeDefined();

		for ( const link of [ CDN_MOCK_SCRIPT_URL, CDN_MOCK_STYLESHEET_URL ] ) {
			expect( queryPreload( link ) ).not.toBeNull();
		}
	} );

	it( 'should be possible to pass custom function as an script', async () => {
		const customFunction = vitest.fn( () => Promise.resolve() );

		await loadCKCdnResourcesPack( {
			scripts: [ customFunction ],
			checkPluginLoaded: () => ( {
				result: 2
			} )
		} );

		expect( customFunction ).toHaveBeenCalled();
	} );

	it( 'should inject the stylesheet at the start of the head', async () => {
		// Manually inject the stylesheet into the document.
		const stylesheet1 = document.createElement( 'link' );
		stylesheet1.rel = 'stylesheet';
		stylesheet1.href = createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.0' );
		document.head.appendChild( stylesheet1 );

		// Inject the stylesheet using the loadCKCdnResourcesPack function.
		await loadCKCdnResourcesPack( {
			stylesheets: [ CDN_MOCK_STYLESHEET_URL ]
		} );

		// Verify that the stylesheet are injected at the start of the head.
		const injectedStylesheets = [ ...document.head.querySelectorAll( 'link[rel="stylesheet"]' ) ].map(
			link => link.getAttribute( 'href' )!
		);

		expect( injectedStylesheets ).toEqual( [
			CDN_MOCK_STYLESHEET_URL,
			createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.0' )
		] );
	} );
} );
