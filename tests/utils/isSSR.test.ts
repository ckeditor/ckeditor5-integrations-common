/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, expect, it } from 'vitest';
import { isSSR } from '@/utils/isSSR.js';

describe( 'isSSR', () => {
	it( 'should return false when running in the browser', () => {
		expect( isSSR() ).toBe( false );
	} );
} );
