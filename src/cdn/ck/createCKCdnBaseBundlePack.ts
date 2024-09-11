/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { CKCdnResourcesAdvancedPack } from '../loadCKCdnResourcesPack';

import { createCKCdnUrl, type CKCdnVersion } from './createCKCdnUrl';
import { waitForWindowEntry } from '../../utils/waitForWindowEntry';
import { injectScriptsInParallel } from '../../utils/injectScript';

import './globals.d';

/**
 * Creates a pack of resources for the base CKEditor bundle.
 *
 * @param config The configuration of the CKEditor Premium Features pack.
 * @returns A pack of resources for  the base CKEditor bundle.
 * @example
 *
 * ```ts
 * const { Paragraph } = await loadCKCdnResourcesPack(
 * 	createCKCdnBaseBundlePack( {
 * 		version: '43.0.0',
 * 		translations: [ 'en', 'de' ]
 * 	} )
 * );
 * ```
 */
export function createCKCdnBaseBundlePack(
	{
		version,
		translations
	}: CKCdnBaseBundlePackConfig
): CKCdnResourcesAdvancedPack<Window['CKEDITOR']> {
	const urls = {
		scripts: [
			// Load the main script of the base features.
			createCKCdnUrl( 'ckeditor5', 'ckeditor5.umd.js', version ),

			// Load all JavaScript files from the base features.
			...( translations || [] ).map( translation =>
				createCKCdnUrl( 'ckeditor5', `translations/${ translation }.umd.js`, version )
			)
		],

		stylesheets: [
			createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', version )
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
			async () => injectScriptsInParallel( urls.scripts )
		],

		// Load all stylesheets of the base features.
		stylesheets: urls.stylesheets,

		// Pick the exported global variables from the window object.
		checkPluginLoaded: async () =>
			waitForWindowEntry( [ 'CKEDITOR' ] )
	};
}

/**
 * Configuration of the base CKEditor bundle pack.
 */
export type CKCdnBaseBundlePackConfig = {

	/**
	 * The version of  the base CKEditor bundle.
	 */
	version: CKCdnVersion;

	/**
	 * The list of translations to load.
	 */
	translations?: Array<string>;
};
