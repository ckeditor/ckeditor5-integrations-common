/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import { omit } from '@/src/utils/omit.js';

describe( 'omit', () => {
	it( 'should remove a single key from an object', () => {
		const obj = { a: 1, b: 2, c: 3 };
		const result = omit( [ 'b' ], obj );

		expect( result ).toEqual( { a: 1, c: 3 } );
	} );

	it( 'should remove multiple keys from an object', () => {
		const obj = { name: 'Alice', age: 30, role: 'admin', active: true };
		const result = omit( [ 'age', 'role' ], obj );

		expect( result ).toEqual( { name: 'Alice', active: true } );
	} );

	it( 'should not mutate the original object (immutability)', () => {
		const obj = { x: 10, y: 20 };
		const result = omit( [ 'x' ], obj );

		expect( obj ).toEqual( { x: 10, y: 20 } );
		expect( result ).not.toBe( obj );
	} );

	it( 'should return a shallow copy if the keys array is empty', () => {
		const obj = { a: 1, b: 2 };
		const result = omit( [], obj );

		expect( result ).toEqual( { a: 1, b: 2 } );
		expect( result ).not.toBe( obj );
	} );

	it( 'should handle Symbol keys correctly', () => {
		const mySymbol = Symbol( 'my-symbol' );
		const obj = { [ mySymbol ]: 'secret', publicKey: 'visible' };

		const result = omit( [ mySymbol ], obj ) as any;

		expect( result ).toEqual( { publicKey: 'visible' } );
		expect( result[ mySymbol ] ).toBeUndefined();
	} );

	it( 'should ignore prototype properties', () => {
		const protoObj = { inherited: true };
		const obj = Object.create( protoObj );
		obj.ownProperty = 'yes';

		const result = omit( [ 'inherited' as any ], obj ) as any;

		expect( result.inherited ).toBeUndefined();
		expect( result.ownProperty ).toBe( 'yes' );
	} );
} );
