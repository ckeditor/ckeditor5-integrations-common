/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import { createCKDocsUrl } from '@/docs/createCKDocsUrl.js';

describe( 'createCKDocsUrl', () => {
	it( 'should create a URL with the latest version by default', () => {
		const path = 'guide/getting-started';
		const expectedUrl = 'https://ckeditor.com/docs/ckeditor5/latest/guide/getting-started';

		expect( createCKDocsUrl( path ) ).toBe( expectedUrl );
	} );

	it( 'should create a URL with a specific version', () => {
		const path = 'guide/getting-started';
		const version = '34.0.0';
		const expectedUrl = `https://ckeditor.com/docs/ckeditor5/${ version }/guide/getting-started`;

		expect( createCKDocsUrl( path, version ) ).toBe( expectedUrl );
	} );

	it( 'should handle paths with leading slashes', () => {
		const path = 'getting-started/index.html';
		const expectedUrl = 'https://ckeditor.com/docs/ckeditor5/latest/getting-started/index.html';

		expect( createCKDocsUrl( path ) ).toBe( expectedUrl );
	} );

	it( 'should handle paths with trailing slashes', () => {
		const path = 'guide/getting-started/';
		const expectedUrl = 'https://ckeditor.com/docs/ckeditor5/latest/guide/getting-started/';

		expect( createCKDocsUrl( path ) ).toBe( expectedUrl );
	} );
} );
