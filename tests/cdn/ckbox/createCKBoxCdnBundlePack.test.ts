/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, beforeEach } from 'vitest';

import type { CKBoxCdnVersion } from '@/cdn/ckbox/createCKBoxCdnUrl.js';

import { createCKBoxBundlePack } from '@/cdn/ckbox/createCKBoxCdnBundlePack.js';
import { removeAllCkCdnResources } from '@/test-utils/cdn/removeAllCkCdnResources.js';
import { loadCKCdnResourcesPack } from '@/cdn/utils/loadCKCdnResourcesPack.js';

describe( 'createCKBoxCdnBundlePack', () => {
	beforeEach( () => {
		removeAllCkCdnResources();
	} );

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
			beforeInject: expect.any( Function ),
			checkPluginLoaded: expect.any( Function )
		} );
	} );

	it( 'should not throw an error if the requested version is the same as the installed one', async () => {
		await loadCKBox( '2.5.1' );
		await expect( loadCKBox( '2.5.1' ) ).resolves.not.toThrow();
	} );

	it( 'should throw an error if the requested version is different than the installed one', async () => {
		await loadCKBox( '2.5.1' );
		await expect( async () => loadCKBox( '2.5.0' ) ).rejects.toThrowError(
			'CKBox is already loaded from CDN in version 2.5.1. ' +
			'Remove the old <script> and <link> tags loading CKBox to allow loading the 2.5.0 version.'
		);
	} );
} );

function loadCKBox( version: CKBoxCdnVersion ) {
	return loadCKCdnResourcesPack(
		createCKBoxBundlePack( {
			version
		} )
	);
}
