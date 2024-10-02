/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { BundleInstallationInfo } from './types.js';

import { isSemanticVersion } from '../utils/isSemanticVersion.js';

/**
 * Returns information about the base CKEditor bundle installation.
 */
export function getCKBaseBundleInstallationInfo(): BundleInstallationInfo | null {
	const { CKEDITOR_VERSION, CKEDITOR } = window;

	if ( !isSemanticVersion( CKEDITOR_VERSION ) ) {
		return null;
	}

	// Global `CKEDITOR` is set only in CDN builds.
	return {
		source: CKEDITOR ? 'cdn' : 'npm',
		version: CKEDITOR_VERSION
	};
}
