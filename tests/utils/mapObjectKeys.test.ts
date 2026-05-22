/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import { mapObjectKeys } from '../../src/utils/mapObjectKeys.js';

describe( 'mapObjectKeys', () => {
	it( 'should correctly map keys using a simple uppercase function', () => {
		const obj: Record<string, number> = { a: 1, b: 2 };
		const result = mapObjectKeys( obj, key => key.toUpperCase() );

		expect( result ).toEqual( { A: 1, B: 2 } );
	} );

	it( 'should add a prefix to all keys in the object', () => {
		const data: Record<string, string> = {
			name: 'Alice',
			role: 'Admin'
		};

		const prefixedData = mapObjectKeys( data, key => `user_${ key }` );

		expect( prefixedData ).toEqual( {
			user_name: 'Alice',
			user_role: 'Admin'
		} );
	} );

	it( 'should not mutate the original object', () => {
		const obj: Record<string, string> = { originalKey: 'value' };

		mapObjectKeys( obj, key => `new_${ key }` );

		expect( obj ).toEqual( { originalKey: 'value' } );
	} );
} );
