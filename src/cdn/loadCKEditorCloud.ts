/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { createCKCdnBaseBundlePack } from './ck/createCKCdnBaseBundlePack.js';
import { createCKCdnPremiumBundlePack } from './ck/createCKCdnPremiumBundlePack.js';

import { combineCKCdnBundlesPacks } from './utils/combineCKCdnBundlesPacks.js';
import {
	createCKBoxBundlePack,
	type CKBoxCdnBundlePackConfig
} from './ckbox/createCKBoxCdnBundlePack.js';

import type { CKCdnUrlCreator } from './ck/createCKCdnUrl.js';
import type { ConditionalBlank } from '../types/ConditionalBlank.js';

import { isCKCdnSupportedByEditorVersion } from '../license/isCKCdnSupportedByEditorVersion.js';
import { isCKCdnTestingVersion, type CKCdnVersion } from './ck/isCKCdnVersion.js';

import {
	loadCKCdnResourcesPack,
	type InferCKCdnResourcesPackExportsType
} from './utils/loadCKCdnResourcesPack.js';

import {
	combineCdnPluginsPacks,
	type CombinedPluginsPackWithFallbackScope,
	type CdnPluginsPacks
} from './plugins/combineCdnPluginsPacks.js';

/**
 * A composable function that loads CKEditor Cloud Services bundles.
 * It returns the exports of the loaded bundles.
 *
 * @param config The configuration of the CKEditor Cloud Services bundles to load.
 * @returns The result of the loaded CKEditor Cloud Services bundles.
 * @example
 *
 * Example of loading CKEditor Cloud Services with the premium features and CKBox:
 *
 * ```ts
 * const { CKEditor, CKEditorPremiumFeatures } = await loadCKEditorCloud( {
 * 	version: '44.0.0',
 * 	translations: [ 'es', 'de' ],
 * 	premium: true
 * } );
 *
 * const { Paragraph } = CKEditor;
 * const { SlashCommands } = CKEditorPremiumFeatures;
 * ```
 *
 * Example of loading CKEditor Cloud Services with custom plugins:
 *
 * ```ts
 * const { CKEditor, loadedPlugins } = await loadCKEditorCloud( {
 * 	version: '44.0.0',
 * 	plugins: {
 * 		Plugin1: async () => import( './your-local-import.umd.js' ),
 * 		Plugin2: [
 * 			'https://cdn.example.com/plugin2.js',
 * 			'https://cdn.example.com/plugin2.css'
 * 		],
 * 		Plugin3: {
 * 			scripts: [ 'https://cdn.example.com/plugin3.js' ],
 * 			stylesheets: [ 'https://cdn.example.com/plugin3.css' ],
 *
 * 			// Optional, if it's not passed then the type of `Plugin3` will be picked from `Window`
 * 			checkPluginLoaded: () => ( window as any ).Plugin3
 * 		}
 * 	}
 * } );
 * ```
 *
 * Type of plugins can be inferred if `checkPluginLoaded` is not provided: In this case,
 * the type of the plugin will be picked from the global window scope.
 */
export function loadCKEditorCloud<Config extends CKEditorCloudConfig>(
	config: Config
): Promise<CKEditorCloudResult<Config>> {
	const {
		version, translations, plugins,
		premium, ckbox, createCustomCdnUrl,
		injectedHtmlElementsAttributes = {
			crossorigin: 'anonymous'
		}
	} = config;

	validateCKEditorVersion( version );

	const pack = combineCKCdnBundlesPacks( {
		CKEditor: createCKCdnBaseBundlePack( {
			version,
			translations,
			createCustomCdnUrl
		} ),

		...premium && {
			CKEditorPremiumFeatures: createCKCdnPremiumBundlePack( {
				version,
				translations,
				createCustomCdnUrl
			} )
		},

		...ckbox && {
			CKBox: createCKBoxBundlePack( ckbox )
		},

		loadedPlugins: combineCdnPluginsPacks( plugins ?? {} )
	} );

	return loadCKCdnResourcesPack(
		{
			...pack,
			htmlAttributes: injectedHtmlElementsAttributes
		}
	) as Promise<CKEditorCloudResult<Config>>;
}

/**
 * Checks if the given version the CKEditor 5 version is supported by the CKEditor Cloud Services.
 * If it is not supported, an error is thrown.
 *
 * @param version The CKEditor version to validate.
 */
function validateCKEditorVersion( version: CKCdnVersion ) {
	if ( isCKCdnTestingVersion( version ) ) {
		console.warn(
			'You are using a testing version of CKEditor 5. Please remember that it is not suitable for production environments.'
		);
	}

	if ( !isCKCdnSupportedByEditorVersion( version ) ) {
		throw new Error(
			`The CKEditor 5 CDN can't be used with the given editor version: ${ version }. ` +
			'Please make sure you are using at least the CKEditor 5 version 43.'
		);
	}
}

/**
 * The result of the resolved bundles from CKEditor Cloud Services.
 */
export type CKEditorCloudResult<Config extends CKEditorCloudConfig> = {

	/**
	 * The base CKEditor bundle exports.
	 */
	CKEditor: NonNullable<Window['CKEDITOR']>;

	/**
	 * The CKBox bundle exports.
	 * It's available only if the `ckbox` configuration is provided.
	 */
	CKBox: ConditionalBlank<
		Config['ckbox'],
		Window['CKBox']
	>;

	/**
	 * The CKEditor Premium Features bundle exports.
	 * It's available only if the `premium` configuration is provided.
	 */
	CKEditorPremiumFeatures: ConditionalBlank<
		Config['premium'],
		Window['CKEDITOR_PREMIUM_FEATURES']
	>;

	/**
	 * The additional resources exports.
	 */
	loadedPlugins: InferCKCdnResourcesPackExportsType<
		CombinedPluginsPackWithFallbackScope<NonNullable<Config['plugins']>>
	>;
};

/**
 * The configuration of the `useCKEditorCloud` hook.
 */
export type CKEditorCloudConfig<Plugins extends CdnPluginsPacks = CdnPluginsPacks> = {

	/**
	 * The version of CKEditor Cloud Services to use.
	 */
	version: CKCdnVersion;

	/**
	 * The translations to load.
	 */
	translations?: Array<string>;

	/**
	 * If `true` then the premium features will be loaded.
	 */
	premium?: boolean;

	/**
	 * CKBox bundle configuration.
	 */
	ckbox?: CKBoxCdnBundlePackConfig;

	/**
	 * Additional resources to load.
	 */
	plugins?: Plugins;

	/**
	 * Map of attributes to add to the script, stylesheet and link tags that are injected by the loader.
	 */
	injectedHtmlElementsAttributes?: Record<string, any>;

	/**
	 * The function that creates custom CDN URLs.
	 */
	createCustomCdnUrl?: CKCdnUrlCreator;
};
