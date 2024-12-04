/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import { createCKBoxCdnUrl, CKBOX_CDN_URL } from '@/cdn/ckbox/createCKBoxCdnUrl.js';

describe( 'createCKBoxCdnUrl', () => {
	it( 'should return the correct URL for a given bundle, file, and version', () => {
		const url = createCKBoxCdnUrl( 'ckbox', 'ckbox.js', '2.5.1' );

		expect( url ).toBe( `${ CKBOX_CDN_URL }/ckbox/2.5.1/ckbox.js` );
	} );
} );
