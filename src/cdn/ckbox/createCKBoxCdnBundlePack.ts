/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { waitForWindowEntry } from '../../utils/waitForWindowEntry.js';
import { getCKBoxInstallationInfo } from '../../installation-info/getCKBoxInstallationInfo.js';

import type { CKCdnResourcesAdvancedPack } from '../../cdn/utils/loadCKCdnResourcesPack.js';
import { createCKBoxCdnUrl, type CKBoxCdnVersion } from './createCKBoxCdnUrl.js';

/**
 * Creates a pack of resources for the base CKBox bundle.
 *
 * @param config The configuration of the CKBox bundle pack.
 * @returns A pack of resources for the base CKBox bundle.
 * @example
 * ```ts
 * const { CKBox } = await loadCKCdnResourcesPack(
 * 	createCKBoxCdnBundlePack( {
 * 		version: '2.5.1',
 * 		theme: 'lark'
 * 	} )
 * );
 * ```
 */
export function createCKBoxBundlePack(
	{
		version,
		theme = 'lark'
	}: CKBoxCdnBundlePackConfig
): CKCdnResourcesAdvancedPack<Window['CKBox']> {
	return {
		// Load the main script of the base features.
		scripts: [
			createCKBoxCdnUrl( 'ckbox', 'ckbox.js', version )
		],

		// Load optional theme, if provided. It's not required but recommended because it improves the look and feel.
		...theme && {
			stylesheets: [ createCKBoxCdnUrl( 'ckbox', `styles/themes/${ theme }.css`, version ) ]
		},

		// Pick the exported global variables from the window object.
		checkPluginLoaded: async () =>
			waitForWindowEntry( [ 'CKBox' ] ),

		// Check if the CKBox bundle is already loaded and throw an error if it is.
		beforeInject: () => {
			const installationInfo = getCKBoxInstallationInfo();

			if ( installationInfo && installationInfo.version !== version ) {
				throw new Error(
					`CKBox is already loaded from CDN in version ${ installationInfo.version }. ` +
					`Remove the old <script> and <link> tags loading CKBox to allow loading the ${ version } version.`
				);
			}
		}
	};
}

/**
 * Configuration of the base CKEditor bundle pack.
 */
export type CKBoxCdnBundlePackConfig = {

	/**
	 * The version of  the base CKEditor bundle.
	 */
	version: CKBoxCdnVersion;

	/**
	 * The theme of the CKBox bundle. Default is 'lark'.
	 */
	theme?: string | null;
};
