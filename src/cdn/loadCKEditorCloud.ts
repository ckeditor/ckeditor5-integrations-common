/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { createCKCdnBaseBundlePack } from './ck/createCKCdnBaseBundlePack';
import { createCKCdnPremiumBundlePack } from './ck/createCKCdnPremiumBundlePack';

import { combineCKCdnBundlesPacks } from './combineCKCdnBundlesPacks';
import {
	createCKBoxBundlePack,
	type CKBoxCdnBundlePackConfig
} from './ckbox/createCKBoxCdnBundlePack';

import type { ConditionalBlank } from '../types/ConditionalBlank';
import type { CKCdnVersion } from './ck/createCKCdnUrl';

import {
	loadCKCdnResourcesPack,
	type InferCKCdnResourcesPackExportsType
} from './loadCKCdnResourcesPack';

import {
	combineCdnPluginsPacks,
	type CombinedPluginsPackWithFallbackScope,
	type CdnPluginsPacks
} from './plugins/combineCdnPluginsPacks';

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
 * 	version: '43.0.0',
 * 	languages: [ 'en', 'de' ],
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
 * 	version: '43.0.0',
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
		version, languages, plugins,
		premium, ckbox
	} = config;

	const pack = combineCKCdnBundlesPacks( {
		CKEditor: createCKCdnBaseBundlePack( {
			version,
			languages
		} ),

		...premium && {
			CKEditorPremiumFeatures: createCKCdnPremiumBundlePack( {
				version,
				languages
			} )
		},

		...ckbox && {
			CKBox: createCKBoxBundlePack( ckbox )
		},

		loadedPlugins: combineCdnPluginsPacks( plugins ?? {} )
	} );

	return loadCKCdnResourcesPack( pack ) as Promise<CKEditorCloudResult<Config>>;
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
	 * The languages to load.
	 */
	languages?: Array<string>;

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
};
