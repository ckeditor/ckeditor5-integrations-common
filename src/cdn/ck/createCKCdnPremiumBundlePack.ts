/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { CKCdnResourcesAdvancedPack } from '../../cdn/utils/loadCKCdnResourcesPack.js';
import type { CKCdnBaseBundlePackConfig } from './createCKCdnBaseBundlePack.js';

import { waitForWindowEntry } from '../../utils/waitForWindowEntry.js';
import { injectScriptsInParallel } from '../../utils/injectScript.js';
import { without } from '../../utils/without.js';

import { createCKCdnUrl } from './createCKCdnUrl.js';

/**
 * Creates a pack of resources for the CKEditor Premium Features.
 *
 * @param config The configuration of the CKEditor Premium Features pack.
 * @returns A pack of resources for the CKEditor Premium Features.
 * @example
 *
 * ```ts
 * const { SlashCommand } = await loadCKCdnResourcesPack(
 * 	createCKCdnPremiumBundlePack( {
 * 		version: '44.0.0',
 * 		translations: [ 'es', 'de' ]
 * 	} )
 * );
 * ```
 */
export function createCKCdnPremiumBundlePack(
	{
		version,
		translations,
		createCustomCdnUrl = createCKCdnUrl
	}: CKCdnPremiumBundlePackConfig
): CKCdnResourcesAdvancedPack<Window['CKEDITOR_PREMIUM_FEATURES']> {
	const urls = {
		scripts: [
			// Load the main script of the premium features.
			createCustomCdnUrl( 'ckeditor5-premium-features', 'ckeditor5-premium-features.umd.js', version ),

			// Load all JavaScript files from the premium features.
			// EN bundle is prebuilt into the main script, so we don't need to load it separately.
			...without( [ 'en' ], translations || [] ).map( translation =>
				createCustomCdnUrl( 'ckeditor5-premium-features', `translations/${ translation }.umd.js`, version )
			)
		],

		stylesheets: [
			createCustomCdnUrl( 'ckeditor5-premium-features', 'ckeditor5-premium-features.css', version )
		]
	};

	return {
		// Preload resources specified in the pack, before loading the main script.
		preload: [
			...urls.stylesheets,
			...urls.scripts
		],

		scripts: [
			// It's safe to load translations and the main script in parallel.
			async attributes => injectScriptsInParallel( urls.scripts, attributes )
		],

		// Load all stylesheets of the premium features.
		stylesheets: urls.stylesheets,

		// Pick the exported global variables from the window object.
		checkPluginLoaded: async () =>
			waitForWindowEntry( [ 'CKEDITOR_PREMIUM_FEATURES' ] )
	};
}

/**
 * Configuration of the CKEditor Premium Features pack.
 */
export type CKCdnPremiumBundlePackConfig = Pick<
	CKCdnBaseBundlePackConfig,
	'translations' | 'version' | 'createCustomCdnUrl'
>;
