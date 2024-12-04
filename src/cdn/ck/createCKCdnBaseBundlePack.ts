/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { CKCdnResourcesAdvancedPack } from '../../cdn/utils/loadCKCdnResourcesPack.js';

import { waitForWindowEntry } from '../../utils/waitForWindowEntry.js';
import { injectScriptsInParallel } from '../../utils/injectScript.js';
import { without } from '../../utils/without.js';

import { getCKBaseBundleInstallationInfo } from '../../installation-info/getCKBaseBundleInstallationInfo.js';
import { createCKDocsUrl } from '../../docs/createCKDocsUrl.js';

import { createCKCdnUrl, type CKCdnUrlCreator } from './createCKCdnUrl.js';
import type { CKCdnVersion } from './isCKCdnVersion.js';

import './globals.js';

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
 * 		version: '44.0.0',
 * 		translations: [ 'es', 'de' ]
 * 	} )
 * );
 * ```
 */
export function createCKCdnBaseBundlePack(
	{
		version,
		translations,
		createCustomCdnUrl = createCKCdnUrl
	}: CKCdnBaseBundlePackConfig
): CKCdnResourcesAdvancedPack<Window['CKEDITOR']> {
	const urls = {
		scripts: [
			// Load the main script of the base features.
			createCustomCdnUrl( 'ckeditor5', 'ckeditor5.umd.js', version ),

			// Load all JavaScript files from the base features.
			// EN bundle is prebuilt into the main script, so we don't need to load it separately.
			...without( [ 'en' ], translations || [] ).map( translation =>
				createCustomCdnUrl( 'ckeditor5', `translations/${ translation }.umd.js`, version )
			)
		],

		stylesheets: [
			createCustomCdnUrl( 'ckeditor5', 'ckeditor5.css', version )
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

		// Load all stylesheets of the base features.
		stylesheets: urls.stylesheets,

		// Pick the exported global variables from the window object.
		checkPluginLoaded: async () =>
			waitForWindowEntry( [ 'CKEDITOR' ] ),

		// Check if the CKEditor base bundle is already loaded and throw an error if it is.
		beforeInject: () => {
			const installationInfo = getCKBaseBundleInstallationInfo();

			switch ( installationInfo?.source ) {
				case 'npm':
					throw new Error(
						'CKEditor 5 is already loaded from npm. Check the migration guide for more details: ' +
						createCKDocsUrl( 'updating/migration-to-cdn/vanilla-js.html' )
					);

				case 'cdn':
					if ( installationInfo.version !== version ) {
						throw new Error(
							`CKEditor 5 is already loaded from CDN in version ${ installationInfo.version }. ` +
							`Remove the old <script> and <link> tags loading CKEditor 5 to allow loading the ${ version } version.`
						);
					}

					break;
			}
		}
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

	/**
	 * The function that creates custom CDN URLs.
	 */
	createCustomCdnUrl?: CKCdnUrlCreator;
};
