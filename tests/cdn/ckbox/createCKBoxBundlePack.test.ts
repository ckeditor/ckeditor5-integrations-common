/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect } from 'vitest';
import { createCKBoxBundlePack } from '@/cdn/ckbox/createCKBoxCdnBundlePack';

describe( 'createCKBoxBundlePack', () => {
	it( 'should return a pack of resources for the base CKBox bundle', async () => {
		const pack = createCKBoxBundlePack( {
			version: '2.5.1'
		} );

		expect( pack ).toMatchObject( {
			scripts: [
				'https://cdn.ckbox.io/ckbox/2.5.1/ckbox.js'
			],
			stylesheets: [
				'https://cdn.ckbox.io/ckbox/2.5.1/styles/themes/lark.css'
			],
			getExportedEntries: expect.any( Function )
		} );
	} );
} );
