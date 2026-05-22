/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import { kebabToCamelCase } from '../../src/utils/kebabToCamelCase.js';

describe( 'kebabToCamelCase', () => {
	it( 'should convert "font-size" to "fontSize"', () => {
		expect( kebabToCamelCase( 'font-size' ) ).toBe( 'fontSize' );
	} );

	it( 'should convert properties with multiple dashes', () => {
		expect( kebabToCamelCase( 'border-bottom-width' ) ).toBe( 'borderBottomWidth' );
	} );

	it( 'should not change words without dashes', () => {
		expect( kebabToCamelCase( 'color' ) ).toBe( 'color' );
		expect( kebabToCamelCase( 'margin' ) ).toBe( 'margin' );
	} );
} );
