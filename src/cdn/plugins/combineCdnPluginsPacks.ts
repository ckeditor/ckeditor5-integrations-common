/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { mapObjectValues } from '../../utils/mapObjectValues.js';
import { waitForWindowEntry } from '../../utils/waitForWindowEntry.js';

import {
	normalizeCKCdnResourcesPack,
	type InferCKCdnResourcesPackExportsType,
	type CKCdnResourcesAdvancedPack
} from '../utils/loadCKCdnResourcesPack.js';

import {
	combineCKCdnBundlesPacks,
	type CKCdnBundlesPacks
} from '../utils/combineCKCdnBundlesPacks.js';

/**
 * This function is similar to `combineCKCdnBundlesPacks` but it provides global scope
 * fallback for the plugins that do not define the type of the exported entries. In other
 * words if the plugin `Reader` does not define the type of the exported entries, the type
 * will be picked from the `Window[ 'Reader' ]` object.
 *
 * @param pluginsPacks A map of CKEditor plugins packs.
 * @returns A combined pack of resources for multiple CKEditor plugins.
 * @example
 *
 * ```ts
 * const { ScreenReader, AccessibilityChecker } = await loadCKCdnResourcesPack(
 * 	combineCdnPluginsPacks( {
 * 		ScreenReader: [ 'https://example.org/screen-reader.js' ],
 * 		AccessibilityChecker: [ 'https://example.org/accessibility-checker.js' ]
 * 	} )
 * );
 * ```
 *
 * In example above, `ScreenReader` and `AccessibilityChecker` are the plugins names and
 * the type of the exported entries will be picked from the global (Window) scope.
 */
export function combineCdnPluginsPacks<Plugins extends CdnPluginsPacks>(
	pluginsPacks: Plugins
): CombinedPluginsPackWithFallbackScope<Plugins> {
	const normalizedPluginsPacks = mapObjectValues( pluginsPacks, ( pluginPack, pluginName ) => {
		if ( !pluginPack ) {
			return undefined;
		}

		const normalizedPluginPack = normalizeCKCdnResourcesPack( pluginPack );

		return {
			// Provide default window accessor object if the plugin pack does not define it.
			checkPluginLoaded: async (): Promise<unknown> =>
				waitForWindowEntry( [ pluginName as any ] ),

			// Transform the plugin pack to a normalized advanced pack.
			...normalizedPluginPack
		};
	} );

	// Merge all scripts, stylesheets and preload resources from all packs.
	return combineCKCdnBundlesPacks(
		normalizedPluginsPacks
	) as CombinedPluginsPackWithFallbackScope<Plugins>;
}

/**
 * A map of CKEditor plugins packs.
 */
export type CdnPluginsPacks = CKCdnBundlesPacks;

/**
 * A combined pack of plugins. It picks the type of the plugin from the global scope if
 * `CKCdnCombinedBundlePack` does not define it in the `checkPluginLoaded` method.
 */
export type CombinedPluginsPackWithFallbackScope<P extends CdnPluginsPacks> = CKCdnResourcesAdvancedPack<{
	[ K in keyof P ]: FallbackIfUnknown<
		InferCKCdnResourcesPackExportsType<P[K]>,
		K extends keyof Window ? Window[ K ] : unknown
	>;
}>;

/**
 * Returns the fallback type if the provided type is unknown.
 */
type FallbackIfUnknown<T, Fallback> = unknown extends T ? Fallback : T;
