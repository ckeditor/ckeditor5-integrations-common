/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { getSupportedLicenseVersionInstallationInfo } from '../installation-info/getSupportedLicenseVersionInstallationInfo.js';
import { expectType } from '../types/expectType.js';

import type { LicenseKey, LicenseKeyVersion } from './LicenseKey.js';

/**
 * Checks if passed license key is a free CKEditor license key.
 *
 * @param licenseKey The license key to check.
 * @param licenseVersion The version of the license key.
 * @returns `true` if the license key is free, `false` otherwise.
 */
export function isCKEditorFreeLicense( licenseKey: LicenseKey, licenseVersion?: LicenseKeyVersion ): boolean {
	// Pick the license version from the installation info if it's not provided.
	// Version should be present somewhere in the window object.
	licenseVersion ||= getSupportedLicenseVersionInstallationInfo() || undefined;

	switch ( licenseVersion ) {
		case 1:
		case 2:
			return licenseKey === undefined;

		case 3:
			return licenseKey === 'GPL';

		default: {
			expectType<undefined>( licenseVersion );

			return false;
		}
	}
}
