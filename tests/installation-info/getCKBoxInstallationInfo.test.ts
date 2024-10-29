/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, beforeEach, expect } from 'vitest';

import { removeAllCkCdnResources } from '@/test-utils/cdn/removeAllCkCdnResources.js';

import { getCKBoxInstallationInfo } from '@/installation-info/getCKBoxInstallationInfo.js';
import { loadCKEditorCloud } from '@/cdn/loadCKEditorCloud.js';

describe( 'getCKBoxInstallationInfo', () => {
	beforeEach( () => {
		removeAllCkCdnResources();
	} );

	it( 'should return null if CKBox bundle is not installed', () => {
		expect( getCKBoxInstallationInfo() ).toBeNull();
	} );

	it( 'should return null if the `CKBox.version` is not a semantic version', () => {
		window.CKBox = { version: 'foo' } as any;

		expect( getCKBoxInstallationInfo() ).toBeNull();
	} );

	it( 'should return CDN source if the CKBox bundle is installed', async () => {
		await loadCKEditorCloud( {
			version: '43.0.0',
			ckbox: {
				version: '2.5.1'
			}
		} );

		expect( getCKBoxInstallationInfo() ).toEqual( {
			source: 'cdn',
			version: '2.5.1'
		} );
	} );
} );
