/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { isCKRollingVersion } from '../utils/version/isCKVersion.js';
import { isSemanticVersion, type SemanticVersion } from '../utils/version/isSemanticVersion.js';
import { compareSemanticVersions, type VersionCompareResult } from '../utils/version/compareSemanticVersions.js';

import { getCKBaseBundleInstallationInfo } from './getCKBaseBundleInstallationInfo.js';

/**
 * Compares currently installed bundle with passed semantic version.
 *
 * - `1` if installed version > version.
 * - `-1` if installed version < version
 * - `0` if both versions are equal.
 * - `null` if editor is not installed.
 *
 * @param version Semantic version to compare.
 * @returns Comparison result.
 */
export function compareInstalledCKBaseVersion( version: SemanticVersion ): VersionCompareResult | null {
	const installedVersion = getCKBaseBundleInstallationInfo()?.version;

	if ( !installedVersion ) {
		return null;
	}

	if ( isCKRollingVersion( version ) ) {
		return -1;
	}

	if ( !isSemanticVersion( installedVersion ) || isCKRollingVersion( installedVersion ) ) {
		return 1;
	}

	return compareSemanticVersions( installedVersion, version );
}
