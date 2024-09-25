/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, expect, it } from 'vitest';
import { mapObjectValues } from '@/utils/mapObjectValues.js';

describe( 'mapObjectValues', () => {
	it( 'should map object values using the provided mapper function', () => {
		const obj = {
			a: 1,
			b: 2
		};

		const mappedObj = mapObjectValues( obj, value => value * 2 );

		expect( mappedObj ).toEqual( { a: 2, b: 4 } );
	} );
} );
