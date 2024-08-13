/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { waitForWindowEntry } from '@/utils/waitForWindowEntry';
import { removeCkCdnScripts, CDN_MOCK_SCRIPT_URL } from 'tests/_utils/ckCdnMocks';
import { injectScript } from '@/utils/injectScript';

describe( 'waitForWindowEntry', () => {
	beforeEach( () => {
		removeCkCdnScripts();

		vi.spyOn( console, 'error' ).mockImplementation( () => undefined );
	} );

	afterEach( () => {
		vi.restoreAllMocks();
	} );

	it( 'should wait for the window entry to be available', async () => {
		await injectScript( CDN_MOCK_SCRIPT_URL );

		const result = await waitForWindowEntry( [ 'CKEDITOR' ] );
		expect( result ).toBeDefined();
	} );

	it( 'should throw an error if the window entry is not found', async () => {
		await expect( waitForWindowEntry( [ 'CKEDITOR' ] ) ).rejects.toThrowError(
			'Window entry "CKEDITOR" not found.'
		);
	} );
} );
