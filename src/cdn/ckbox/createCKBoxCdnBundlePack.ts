/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { CKCdnResourcesAdvancedPack } from '../loadCKCdnResourcesPack';

import { waitForWindowEntry } from '../../utils/waitForWindowEntry';
import { createCKBoxCdnUrl, type CKBoxCdnVersion } from './createCKBoxCdnUrl';

import './globals.d';

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
			stylesheets: [
				createCKBoxCdnUrl( 'ckbox', `styles/themes/${ theme }.css`, version )
			]
		},

		// Pick the exported global variables from the window object.
		getExportedEntries: async () =>
			waitForWindowEntry( [ 'CKBox' ] )
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
