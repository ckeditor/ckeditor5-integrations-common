/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, expect, it } from 'vitest';
import { filterObjectValues } from '@/utils/filterObjectValues';

describe( 'filterObjectValues', () => {
	it( 'should filter object values using the provided filter function', () => {
		const obj = {
			a: 1,
			b: null,
			c: undefined,
			d: []
		};

		const filteredObj = filterObjectValues(
			obj,
			value => value !== null
		);

		expect( filteredObj ).toEqual( {
			a: 1,
			c: undefined,
			d: []
		} );
	} );
} );
