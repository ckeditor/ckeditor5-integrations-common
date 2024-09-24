/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, expect, it } from 'vitest';
import { waitFor } from '@/utils/waitFor.js';

describe( 'waitFor', () => {
	it( 'should resolve when the callback succeeds', async () => {
		const result = await waitFor( () => Promise.resolve( 'success' ) );
		expect( result ).toBe( 'success' );
	} );

	it( 'should reject when the callback throws an error', async () => {
		await expect( waitFor( () => Promise.reject( new Error( 'failed' ) ) ) ).rejects.toThrow( 'failed' );
	} );

	it( 'should reject when the timeout is reached', async () => {
		await expect(
			waitFor( () => new Promise( resolve => setTimeout( resolve, 2000 ) ), {
				timeOutAfter: 200,
				retryAfter: 100
			} )
		).rejects.toThrow( 'Timeout' );
	} );
} );
