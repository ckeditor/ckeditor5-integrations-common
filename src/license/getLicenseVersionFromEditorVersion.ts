/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { type CKCdnVersion, isCKCdnTestingVersion } from '../cdn/ck/isCKCdnVersion.js';
import { destructureSemanticVersion } from '../utils/version/destructureSemanticVersion.js';
import type { LicenseKeyVersion } from './LicenseKey.js';

/**
 * Returns the license version that is supported by the given CKEditor version.
 *
 * @param version The CKEditor version (semantic version or testing version).
 * @returns The supported license version.
 */
export function getLicenseVersionFromEditorVersion( version: CKCdnVersion ): LicenseKeyVersion {
	// Assume that the testing version is always the newest one
	// so we can return the highest supported license version.
	if ( isCKCdnTestingVersion( version ) ) {
		return 3;
	}

	const { major } = destructureSemanticVersion( version );

	switch ( true ) {
		case major >= 44:
			return 3;

		case major >= 38:
			return 2;

		default:
			return 1;
	}
}
