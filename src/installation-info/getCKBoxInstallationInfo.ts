/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { BundleInstallationInfo } from './types.js';

import { isSemanticVersion } from '../utils/version/isSemanticVersion.js';

/**
 * Returns information about the CKBox installation.
 */
export function getCKBoxInstallationInfo(): BundleInstallationInfo | null {
	const version = window.CKBox?.version;

	if ( !isSemanticVersion( version ) ) {
		return null;
	}

	return {
		source: 'cdn',
		version
	};
}
