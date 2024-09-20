/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { BundleInstallationInfo } from './types';

import { isSemanticVersion } from '@/utils/isSemanticVersion';

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
