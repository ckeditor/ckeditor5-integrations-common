/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, beforeEach, expect } from 'vitest';

import { removeAllCkCdnResources } from '@/test-utils/cdn/removeAllCkCdnResources.js';

import { getCKBaseBundleInstallationInfo } from '@/installation-info/getCKBaseBundleInstallationInfo.js';
import { loadCKEditorCloud } from '@/cdn/loadCKEditorCloud.js';

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
		window.CKEDITOR_VERSION = '44.3.0';

		expect( getCKBaseBundleInstallationInfo() ).toEqual( {
			source: 'npm',
			version: '44.3.0'
		} );
	} );

	it( 'should return CDN source if the base CKEditor bundle is injected from the CDN', async () => {
		await loadCKEditorCloud( {
			version: '44.3.0'
		} );

		expect( getCKBaseBundleInstallationInfo() ).toEqual( {
			source: 'cdn',
			version: '44.3.0'
		} );
	} );
} );
