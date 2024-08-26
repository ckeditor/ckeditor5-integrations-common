/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect } from 'vitest';
import { combineCKCdnBundlesPacks } from '@/cdn/combineCKCdnBundlesPacks';

describe( 'combineCKCdnBundlesPacks', () => {
	it( 'should combine multiple CKEditor CDN bundles packs into a single pack', async () => {
		const pack1 = {
			preload: [ 'preload1' ],
			scripts: [ 'script1' ],
			stylesheets: [ 'stylesheet1' ],
			confirmPluginReady: async () => ( { exported1: 'value1' } )
		};

		const pack2 = {
			preload: [ 'preload2' ],
			scripts: [ 'script2' ],
			stylesheets: [ 'stylesheet2' ],
			confirmPluginReady: async () => ( { exported2: 'value2' } )
		};

		const combinedPack = combineCKCdnBundlesPacks( {
			Pack1: pack1,
			Pack2: pack2
		} );

		expect( combinedPack ).toMatchObject( {
			preload: [ 'preload1', 'preload2' ],
			scripts: [ 'script1', 'script2' ],
			stylesheets: [ 'stylesheet1', 'stylesheet2' ]
		} );

		const exportedEntries = await combinedPack.confirmPluginReady!();

		expect( exportedEntries ).toEqual( {
			Pack1: { exported1: 'value1' },
			Pack2: { exported2: 'value2' }
		} );
	} );

	it( 'should handle undefined packs', async () => {
		const pack1 = {
			preload: [ 'preload1' ],
			scripts: [ 'script1' ],
			stylesheets: [ 'stylesheet1' ],
			confirmPluginReady: async () => ( { exported1: 'value1' } )
		};

		const combinedPack = combineCKCdnBundlesPacks( {
			Pack1: pack1,
			Pack2: undefined
		} );

		expect( combinedPack ).toMatchObject( {
			preload: [ 'preload1' ],
			scripts: [ 'script1' ],
			stylesheets: [ 'stylesheet1' ]
		} );

		const exportedEntries = await combinedPack.confirmPluginReady!();

		expect( exportedEntries ).toEqual( {
			Pack1: { exported1: 'value1' },
			Pack2: undefined
		} );
	} );

	it( 'should handle empty packs', async () => {
		const combinedPack = combineCKCdnBundlesPacks( {} );

		expect( combinedPack ).toMatchObject( {
			preload: [],
			scripts: [],
			stylesheets: []
		} );

		const exportedEntries = await combinedPack.confirmPluginReady!();

		expect( exportedEntries ).toEqual( {} );
	} );

	it( 'should handle packs with no scripts', async () => {
		const pack1 = {
			preload: [ 'preload1' ],
			stylesheets: [ 'stylesheet1' ],
			confirmPluginReady: async () => ( { exported1: 'value1' } )
		};

		const pack2 = {
			preload: [ 'preload2' ],
			stylesheets: [ 'stylesheet2' ],
			confirmPluginReady: async () => ( { exported2: 'value2' } )
		};

		const combinedPack = combineCKCdnBundlesPacks( {
			Pack1: pack1,
			Pack2: pack2
		} );

		expect( combinedPack ).toMatchObject( {
			preload: [ 'preload1', 'preload2' ],
			stylesheets: [ 'stylesheet1', 'stylesheet2' ]
		} );

		const exportedEntries = await combinedPack.confirmPluginReady!();

		expect( exportedEntries ).toEqual( {
			Pack1: { exported1: 'value1' },
			Pack2: { exported2: 'value2' }
		} );
	} );

	it( 'should handle packs with no stylesheets', async () => {
		const pack1 = {
			preload: [ 'preload1' ],
			scripts: [ 'script1' ],
			confirmPluginReady: async () => ( { exported1: 'value1' } )
		};

		const pack2 = {
			preload: [ 'preload2' ],
			scripts: [ 'script2' ],
			confirmPluginReady: async () => ( { exported2: 'value2' } )
		};

		const combinedPack = combineCKCdnBundlesPacks( {
			Pack1: pack1,
			Pack2: pack2
		} );

		expect( combinedPack ).toMatchObject( {
			preload: [ 'preload1', 'preload2' ],
			scripts: [ 'script1', 'script2' ]
		} );

		const exportedEntries = await combinedPack.confirmPluginReady!();

		expect( exportedEntries ).toEqual( {
			Pack1: { exported1: 'value1' },
			Pack2: { exported2: 'value2' }
		} );
	} );

	it( 'should handle packs with no preload', async () => {
		const pack1 = {
			scripts: [ 'script1' ],
			stylesheets: [ 'stylesheet1' ],
			confirmPluginReady: async () => ( { exported1: 'value1' } )
		};

		const pack2 = {
			scripts: [ 'script2' ],
			stylesheets: [ 'stylesheet2' ],
			confirmPluginReady: async () => ( { exported2: 'value2' } )
		};

		const combinedPack = combineCKCdnBundlesPacks( {
			Pack1: pack1,
			Pack2: pack2
		} );

		expect( combinedPack ).toMatchObject( {
			scripts: [ 'script1', 'script2' ],
			stylesheets: [ 'stylesheet1', 'stylesheet2' ]
		} );

		const exportedEntries = await combinedPack.confirmPluginReady!();

		expect( exportedEntries ).toEqual( {
			Pack1: { exported1: 'value1' },
			Pack2: { exported2: 'value2' }
		} );
	} );
} );
