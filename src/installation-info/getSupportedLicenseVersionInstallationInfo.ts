/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { getLicenseVersionFromEditorVersion } from '../license/getLicenseVersionFromEditorVersion.js';
import type { LicenseKeyVersion } from '../license/LicenseKey.js';

import { getCKBaseBundleInstallationInfo } from './getCKBaseBundleInstallationInfo.js';

/**
 * Returns information about the installed CKEditor version and the supported license version.
 *
 * @returns The supported license version or `null` if the CKEditor version is unknown.
 */
export function getSupportedLicenseVersionInstallationInfo(): LicenseKeyVersion | null {
	const installationInfo = getCKBaseBundleInstallationInfo();

	// It looks like unknown version of Ckeditor is installed, so we can't determine the license version.
	if ( !installationInfo ) {
		return null;
	}

	return getLicenseVersionFromEditorVersion( installationInfo.version );
}
