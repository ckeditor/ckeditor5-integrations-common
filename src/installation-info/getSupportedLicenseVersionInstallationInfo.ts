/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { isCKCdnTestingVersion } from '../cdn/ck/isCKCdnVersion.js';
import type { LicenseKeyVersion } from '../license/LicenseKey.js';

import { destructureSemanticVersion } from '../utils/version/destructureSemanticVersion.js';
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

	const { version } = installationInfo;

	// Assume that the testing version is always the newest one
	// so we can return the highest supported license version.
	if ( isCKCdnTestingVersion( version ) ) {
		return 3;
	}

	const { major } = destructureSemanticVersion( version );

	// License V3 was released in CKEditor 44.0.0.
	if ( major >= 44 ) {
		return 3;
	}

	// License V2 was released in CKEditor 38.0.0.
	if ( major >= 38 ) {
		return 2;
	}

	// License V1.
	return 1;
}
