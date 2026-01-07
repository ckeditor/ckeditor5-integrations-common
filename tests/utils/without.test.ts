/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import { without } from '@/utils/without.js';

describe( 'without', () => {
	it( 'should remove specified items from the array', () => {
		const items = [ 1, 2, 3, 4, 5 ];
		const itemsToRemove = [ 2, 4 ];
		const result = without( itemsToRemove, items );
		expect( result ).toEqual( [ 1, 3, 5 ] );
	} );

	it( 'should return the same array if no items are removed', () => {
		const items = [ 1, 2, 3 ];
		const itemsToRemove = [ 4, 5 ];
		const result = without( itemsToRemove, items );
		expect( result ).toEqual( [ 1, 2, 3 ] );
	} );

	it( 'should return an empty array if all items are removed', () => {
		const items = [ 1, 2, 3 ];
		const itemsToRemove = [ 1, 2, 3 ];
		const result = without( itemsToRemove, items );
		expect( result ).toEqual( [] );
	} );

	it( 'should handle an empty array of items to remove', () => {
		const items = [ 1, 2, 3 ];
		const itemsToRemove: Array<number> = [];
		const result = without( itemsToRemove, items );
		expect( result ).toEqual( [ 1, 2, 3 ] );
	} );

	it( 'should handle an empty array of items', () => {
		const items: Array<number> = [];
		const itemsToRemove = [ 1, 2, 3 ];
		const result = without( itemsToRemove, items );
		expect( result ).toEqual( [] );
	} );

	it( 'should handle arrays with different types of items', () => {
		const items = [ 1, '2', 3, '4', 5 ];
		const itemsToRemove = [ '2', 4 ];
		const result = without( itemsToRemove, items );
		expect( result ).toEqual( [ 1, 3, '4', 5 ] );
	} );
} );
