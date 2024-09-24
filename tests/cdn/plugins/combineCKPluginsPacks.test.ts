/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, beforeEach, afterEach, expectTypeOf } from 'vitest';

import type { Awaitable } from '@/types/Awaitable';
import { combineCdnPluginsPacks } from '@/cdn/plugins/combineCdnPluginsPacks';

describe( 'combineCdnPluginsPacks', () => {
	beforeEach( () => {
		window.ScreenReader = {
			test: 123
		};
	} );

	afterEach( () => {
		delete window.ScreenReader;
	} );

	it( 'should define default `checkPluginLoaded` if not present', async () => {
		const combinedPack = combineCdnPluginsPacks( {
			ScreenReader: [ 'https://example.org/screen-reader.js' ],
			AccessibilityChecker: undefined
		} );

		expect( combinedPack ).toEqual( {
			beforeInject: expect.any( Function ),
			scripts: [ 'https://example.org/screen-reader.js' ],
			preload: [],
			stylesheets: [],
			checkPluginLoaded: expect.any( Function )
		} );

		expectTypeOf( combinedPack.checkPluginLoaded!()! ).toEqualTypeOf<Awaitable<{
			ScreenReader: ScreenReader | undefined;
			AccessibilityChecker: never;
		}>>();

		await expect( combinedPack.checkPluginLoaded!() ).resolves.toEqual( {
			ScreenReader: {
				test: 123
			}
		} );
	} );
} );

type ScreenReader = {
	test: number;
};

declare global {
	interface Window {
		ScreenReader?: ScreenReader;
	}
}
