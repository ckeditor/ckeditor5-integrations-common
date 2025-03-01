/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, expect, it } from 'vitest';
import { uniq } from '@/utils/uniq.js';

describe( 'uniq', () => {
	it( 'should remove duplicate elements from an array', () => {
		const input = [ 1, 2, 2, 3, 4, 4, 5 ];
		const expectedOutput = [ 1, 2, 3, 4, 5 ];

		const result = uniq( input );

		expect( result ).toEqual( expectedOutput );
	} );

	it( 'should return an empty array if the input is empty', () => {
		const input: Array<number> = [];
		const expectedOutput: Array<number> = [];

		const result = uniq( input );

		expect( result ).toEqual( expectedOutput );
	} );
} );
