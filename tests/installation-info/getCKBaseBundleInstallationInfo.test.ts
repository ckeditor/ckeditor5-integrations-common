/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, beforeEach, expect } from 'vitest';

import { getCKBaseBundleInstallationInfo } from '@/installation-info/getCKBaseBundleInstallationInfo';
import { loadCKEditorCloud } from '@/cdn/loadCKEditorCloud';

import { removeAllCkCdnResources } from '@/tests/_utils';

describe( 'getCKBaseBundleInstallationInfo', () => {
	beforeEach( () => {
		removeAllCkCdnResources();
	} );

	it( 'should return null if the CKEditor bundle is not available', () => {
		expect( getCKBaseBundleInstallationInfo() ).toBeNull();
	} );

	it( 'should return null if the `CKEDITOR_VERSION` is not a semantic version', () => {
		window.CKEDITOR_VERSION = 'foo';

		expect( getCKBaseBundleInstallationInfo() ).toBeNull();
	} );

	it( 'should return NPM source if the base CKEditor bundle is not injected from the CDN', () => {
		window.CKEDITOR_VERSION = '43.0.0';

		expect( getCKBaseBundleInstallationInfo() ).toEqual( {
			source: 'npm',
			version: '43.0.0'
		} );
	} );

	it( 'should return CDN source if the base CKEditor bundle is injected from the CDN', async () => {
		await loadCKEditorCloud( {
			version: '43.0.0'
		} );

		expect( getCKBaseBundleInstallationInfo() ).toEqual( {
			source: 'cdn',
			version: '43.0.0'
		} );
	} );
} );
