/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { mapObjectValues } from '../../utils/mapObjectValues';
import { waitForWindowEntry } from '../../utils/waitForWindowEntry';

import {
	normalizeCKCdnResourcesPack,
	type InferCKCdnResourcesPackExportsType,
	type CKCdnResourcesAdvancedPack
} from '../loadCKCdnResourcesPack';

import {
	combineCKCdnBundlesPacks,
	type CKCdnBundlesPacks
} from '../combineCKCdnBundlesPacks';

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
export function combineCdnPluginsPacks<Plugins extends CKCdnBundlesPacks>(
	pluginsPacks: Plugins
): CombinedPluginsPackWithFallbackScope<Plugins> {
	const normalizedPluginsPacks = mapObjectValues( pluginsPacks, ( pluginPack, pluginName ) => {
		if ( !pluginPack ) {
			return undefined;
		}

		const normalizedPluginPack = normalizeCKCdnResourcesPack( pluginPack );

		return {
			// Provide default window accessor object if the plugin pack does not define it.
			getExportedEntries: async (): Promise<unknown> =>
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
 * A combined pack of plugins. It picks the type of the plugin from the global scope if
 * `CKCdnCombinedBundlePack` does not define it in the `getExportedEntries` method.
 */
export type CombinedPluginsPackWithFallbackScope<P extends CKCdnBundlesPacks> = CKCdnResourcesAdvancedPack<{
	[ K in keyof P ]: FallbackIfUnknown<
		InferCKCdnResourcesPackExportsType<P[K]>,
		K extends keyof Window ? Window[ K ] : unknown
	>;
}>;

/**
 * Returns the fallback type if the provided type is unknown.
 */
type FallbackIfUnknown<T, Fallback> = unknown extends T ? Fallback : T;
