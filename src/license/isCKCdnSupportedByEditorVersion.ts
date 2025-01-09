/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { destructureSemanticVersion } from '../utils/version/destructureSemanticVersion.js';
import { isCKCdnTestingVersion, type CKCdnVersion } from '../cdn/ck/isCKCdnVersion.js';
import { getLicenseVersionFromEditorVersion } from './getLicenseVersionFromEditorVersion.js';

/**
 * Checks if the CKEditor CDN is supported by the given editor version.
 *
 * @param version The CKEditor version.
 * @returns `true` if the CDN is supported, `false` otherwise.
 */
export function isCKCdnSupportedByEditorVersion( version: CKCdnVersion ): boolean {
	if ( isCKCdnTestingVersion( version ) ) {
		return true;
	}

	const { major } = destructureSemanticVersion( version );
	const licenseVersion = getLicenseVersionFromEditorVersion( version );

	switch ( licenseVersion ) {
		// For newer license versions, we support all newer versions.
		case 3:
			return true;

		// For the license v1-v2, we support only the 43 version.
		default:
			return major === 43;
	}
}
