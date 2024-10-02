/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { filterBlankObjectValues } from '../../utils/filterBlankObjectValues.js';
import { mapObjectValues } from '../../utils/mapObjectValues.js';

import {
	normalizeCKCdnResourcesPack,
	type CKCdnResourcesPack,
	type InferCKCdnResourcesPackExportsType,
	type CKCdnResourcesAdvancedPack
} from './loadCKCdnResourcesPack.js';

/**
 * Combines multiple CKEditor CDN bundles packs into a single pack.
 *
 * @param packs A map of CKEditor CDN bundles packs.
 * @returns A combined pack of resources for multiple CKEditor CDN bundles.
 * @example
 *
 * ```ts
 * const { Base, Premium } = await loadCKCdnResourcesPack(
 * 	combineCKCdnBundlesPacks( {
 * 		Base: createCKCdnBaseBundlePack( {
 * 			version: '43.0.0',
 * 			translations: [ 'es', 'de' ]
 * 		} ),
 * 		Premium: createCKCdnPremiumBundlePack( {
 * 			version: '43.0.0',
 * 			translations: [ 'es', 'de' ]
 * 		} )
 * 	} )
 * );
 * ```
 */
export function combineCKCdnBundlesPacks<P extends CKCdnBundlesPacks>( packs: P ): CKCdnCombinedBundlePack<P> {
	const normalizedPacks = mapObjectValues(
		filterBlankObjectValues( packs ),
		normalizeCKCdnResourcesPack
	);

	// Merge all scripts, stylesheets and preload resources from all packs.
	const mergedPacks = Object
		.values( normalizedPacks )
		.reduce(
			( acc, pack ) => {
				acc.scripts!.push( ...( pack.scripts ?? [] ) );
				acc.stylesheets!.push( ...( pack.stylesheets ?? [] ) );
				acc.preload!.push( ...( pack.preload ?? [] ) );

				return acc;
			},
			{
				preload: [],
				scripts: [],
				stylesheets: []
			}
		);

	// Get exported entries from all packs.
	const checkPluginLoaded = async () => {
		// Use Object.create() to create an object without a prototype to avoid prototype pollution.
		const exportedGlobalVariables: Record<string, unknown> = Object.create( null );

		// It can be done sequentially because scripts *should* be loaded at this point and the whole execution should be quite fast.
		for ( const [ name, pack ] of Object.entries( normalizedPacks ) ) {
			exportedGlobalVariables[ name ] = await pack?.checkPluginLoaded?.();
		}

		return exportedGlobalVariables as any;
	};

	// Call beforeInject method of all packs.
	const beforeInject = () => {
		for ( const pack of Object.values( normalizedPacks ) ) {
			pack.beforeInject?.();
		}
	};

	return {
		...mergedPacks,
		beforeInject,
		checkPluginLoaded
	};
}

/**
 * A map of CKEditor CDN bundles packs.
 */
export type CKCdnBundlesPacks = Record<string, CKCdnResourcesPack<any> | undefined>;

/**
 * A combined pack of resources for multiple CKEditor CDN bundles.
 */
export type CKCdnCombinedBundlePack<P extends CKCdnBundlesPacks> = CKCdnResourcesAdvancedPack<{
	[ K in keyof P ]: InferCKCdnResourcesPackExportsType<P[K]>
}>;
