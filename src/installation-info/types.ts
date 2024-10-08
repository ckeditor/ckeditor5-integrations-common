/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { SemanticVersion } from '../utils/isSemanticVersion.js';

/**
 * The source from which CKEditor was installed.
 */
type BundleInstallationSource = 'npm' | 'cdn';

/**
 * Information about the currently installed CKEditor.
 */
export type BundleInstallationInfo = {

	/**
	 * The source from which CKEditor was installed.
	 */
	source: BundleInstallationSource;

	/**
	 * The version of CKEditor.
	 */
	version: SemanticVersion;
};
