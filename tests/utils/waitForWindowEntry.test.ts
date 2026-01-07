/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { waitForWindowEntry } from '@/utils/waitForWindowEntry.js';
import { injectScript } from '@/utils/injectScript.js';

import { CDN_MOCK_SCRIPT_URL } from '@/test-utils/cdn/mocks.js';
import { removeAllCkCdnResources } from '@/test-utils/cdn/removeAllCkCdnResources.js';

describe( 'waitForWindowEntry', () => {
	beforeEach( () => {
		removeAllCkCdnResources();

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
