/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, vi, expect, vitest, beforeEach, afterEach } from 'vitest';

import { loadCKCdnResourcesPack } from '@/cdn/loadCKCdnResourcesPack';
import {
	removeCkCdnLinks,
	removeCkCdnScripts,
	CDN_MOCK_SCRIPT_URL,
	CDN_MOCK_STYLESHEET_URL
} from 'tests/_utils/ckCdnMocks';

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
		const getExportedEntries = vitest.fn( () => ( {
			ClassicEditor: {
				version: '30.0.0'
			}
		} ) );

		const result = await loadCKCdnResourcesPack( {
			getExportedEntries
		} );

		expect( result ).toEqual( {
			ClassicEditor: {
				version: '30.0.0'
			}
		} );

		expect( getExportedEntries ).toHaveBeenCalled();
	} );

	it( 'should not inject any script if the pack does not contain any', async () => {
		const result = {
			ClassicEditor: {
				version: '30.0.0'
			}
		};

		const loaded = await loadCKCdnResourcesPack( {
			getExportedEntries: () => result
		} );

		expect( result ).toEqual( loaded );
	} );

	it( 'should inject the script if the pack contains one', async () => {
		const loaded = await loadCKCdnResourcesPack( {
			scripts: [ CDN_MOCK_SCRIPT_URL ],
			getExportedEntries: () => window.CKEDITOR!
		} );

		expect( loaded ).toBeDefined();
		expect( loaded ).toEqual( window.CKEDITOR );
	} );

	it( 'should use preload property instead default one if passed', async () => {
		const loaded = await loadCKCdnResourcesPack( {
			preload: [ CDN_MOCK_SCRIPT_URL ],
			getExportedEntries: () => ( {
				result: 2
			} )
		} );

		expect( loaded ).toBeDefined();
		expect( document.querySelector( `link[rel="preload"][href="${ CDN_MOCK_SCRIPT_URL }"]` ) ).not.toBeNull();
	} );

	it( 'should automatically preload all resources if preload property is not defined', async () => {
		const loaded = await loadCKCdnResourcesPack( {
			scripts: [ CDN_MOCK_SCRIPT_URL ],
			stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
			getExportedEntries: () => ( {
				result: 2
			} )
		} );

		expect( loaded ).toBeDefined();

		for ( const link of [ CDN_MOCK_SCRIPT_URL, CDN_MOCK_STYLESHEET_URL ] ) {
			expect( document.querySelector( `link[rel="preload"][href="${ link }"]` ) ).not.toBeNull();
		}
	} );

	it( 'should be possible to pass custom function as an script', async () => {
		const customFunction = vitest.fn( () => Promise.resolve() );

		await loadCKCdnResourcesPack( {
			scripts: [ customFunction ],
			getExportedEntries: () => ( {
				result: 2
			} )
		} );

		expect( customFunction ).toHaveBeenCalled();
	} );
} );
