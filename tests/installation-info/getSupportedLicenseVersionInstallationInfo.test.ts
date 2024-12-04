/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, beforeEach, expect } from 'vitest';

import { getSupportedLicenseVersionInstallationInfo } from '@/installation-info/getSupportedLicenseVersionInstallationInfo.js';

describe( 'getSupportedLicenseVersionInstallationInfo', () => {
	beforeEach( () => {
		window.CKEDITOR_VERSION = '';
	} );

	it( 'should return null if the CKEditor bundle is not available', () => {
		expect( getSupportedLicenseVersionInstallationInfo() ).toBeNull();
	} );

	it( 'should return null if the `CKEDITOR_VERSION` is not a semantic version', () => {
		mockEditorVersion( 'foo' );

		expect( getSupportedLicenseVersionInstallationInfo() ).toBeNull();
	} );

	it( 'should return license V2 for versions lower than 44', () => {
		mockEditorVersion( '43.0.0' );

		expect( getSupportedLicenseVersionInstallationInfo() ).toEqual( 2 );
	} );

	it( 'should return license V2 for versions higher or equal than 38', () => {
		mockEditorVersion( '38.0.0' );
		expect( getSupportedLicenseVersionInstallationInfo() ).toEqual( 2 );

		mockEditorVersion( '39.0.0' );
		expect( getSupportedLicenseVersionInstallationInfo() ).toEqual( 2 );
	} );

	it( 'should return license V3 for versions equal or higher than 44', () => {
		mockEditorVersion( '44.0.0' );
		expect( getSupportedLicenseVersionInstallationInfo() ).toEqual( 3 );

		mockEditorVersion( '45.0.0' );
		expect( getSupportedLicenseVersionInstallationInfo() ).toEqual( 3 );

		mockEditorVersion( '55.0.0' );
		expect( getSupportedLicenseVersionInstallationInfo() ).toEqual( 3 );
	} );

	it( 'should return license V1 for versions lower than 28', () => {
		mockEditorVersion( '37.0.0' );
		expect( getSupportedLicenseVersionInstallationInfo() ).toEqual( 1 );
	} );

	it( 'should return license V3 for test versions', () => {
		for ( const version of [ 'alpha', 'nightly', 'internal' ] ) {
			mockEditorVersion( version );
			expect( getSupportedLicenseVersionInstallationInfo() ).toEqual( 3 );
		}
	} );
} );

function mockEditorVersion( version: string ): void {
	window.CKEDITOR_VERSION = version;
}
