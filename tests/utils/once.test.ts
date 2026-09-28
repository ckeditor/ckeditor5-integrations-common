/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, expect, it, vi } from 'vitest';
import { once } from '@/utils/once.js';

describe( 'once', () => {
	it( 'should execute the function only once', () => {
		const mockFn = vi.fn();
		const onceFn = once( mockFn );

		onceFn();
		onceFn();
		onceFn();

		expect( mockFn ).toHaveBeenCalledOnce();
	} );

	it( 'should return the same result on subsequent calls', () => {
		const mockFn = vi.fn().mockReturnValue( 'result' );
		const onceFn = once( mockFn );

		const result1 = onceFn();
		const result2 = onceFn();
		const result3 = onceFn();

		expect( result1 ).toBe( 'result' );
		expect( result2 ).toBe( 'result' );
		expect( result3 ).toBe( 'result' );
	} );

	it( 'should be possible to reset cache', () => {
		const mockFn = vi.fn().mockReturnValueOnce( 1 ).mockReturnValueOnce( 2 );
		const onceFn = once( mockFn );

		expect( onceFn() ).toBe( 1 );
		expect( onceFn() ).toBe( 1 );

		onceFn.reset();

		expect( onceFn() ).toBe( 2 );
		expect( onceFn() ).toBe( 2 );
	} );

	it( 'should pass arguments to the function on the first call', () => {
		const mockFn = vi.fn( ( a: number, b: number ) => a + b );
		const onceFn = once( mockFn );

		expect( onceFn( 1, 2 ) ).toBe( 3 );
		expect( onceFn( 5, 5 ) ).toBe( 3 );
		expect( mockFn ).toHaveBeenCalledWith( 1, 2 );
	} );

	it( 'should rethrow the same error on subsequent calls without executing the function again', () => {
		const error = new Error( 'failed' );
		const mockFn = vi.fn( () => {
			throw error;
		} );

		const onceFn = once( mockFn );

		expect( () => onceFn() ).toThrow( error );
		expect( () => onceFn() ).toThrow( error );
		expect( mockFn ).toHaveBeenCalledOnce();
	} );

	it( 'should cache thrown values that are not errors', () => {
		const mockFn = vi.fn( () => {
			throw undefined;
		} );

		const onceFn = once( mockFn );

		for ( let i = 0; i < 2; i++ ) {
			try {
				onceFn();
				expect.unreachable();
			} catch ( error ) {
				expect( error ).toBeUndefined();
			}
		}

		expect( mockFn ).toHaveBeenCalledOnce();
	} );

	it( 'should be possible to reset cached error', () => {
		const mockFn = vi.fn()
			.mockImplementationOnce( () => {
				throw new Error( 'failed' );
			} )
			.mockReturnValueOnce( 'result' );
		const onceFn = once( mockFn );

		expect( () => onceFn() ).toThrow( 'failed' );
		expect( () => onceFn() ).toThrow( 'failed' );

		onceFn.reset();

		expect( onceFn() ).toBe( 'result' );
		expect( onceFn() ).toBe( 'result' );
		expect( mockFn ).toHaveBeenCalledTimes( 2 );
	} );
} );
