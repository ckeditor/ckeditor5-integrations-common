/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { BundleInstallationInfo } from './types.js';

import { isCKVersion, type CKVersion } from '../utils/version/isCKVersion.js';

/**
 * Returns information about the base CKEditor bundle installation.
 */
export function getCKBaseBundleInstallationInfo(): BundleInstallationInfo<CKVersion> | null {
	const { CKEDITOR_VERSION, CKEDITOR } = window;

	if ( !isCKVersion( CKEDITOR_VERSION ) ) {
		return null;
	}

	// Global `CKEDITOR` is set only in CDN builds.
	return {
		source: CKEDITOR ? 'cdn' : 'npm',
		version: CKEDITOR_VERSION
	};
}
