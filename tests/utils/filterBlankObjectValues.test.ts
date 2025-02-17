/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, expect, it } from 'vitest';
import { filterBlankObjectValues } from '@/utils/filterBlankObjectValues.js';

describe( 'filterBlankObjectValues', () => {
	it( 'should filter object values that are empty', () => {
		const obj = {
			a: 1,
			b: null,
			c: undefined,
			d: []
		};

		const filteredObj = filterBlankObjectValues( obj );

		expect( filteredObj ).toEqual( {
			a: 1,
			d: []
		} );
	} );
} );
