/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { Awaitable } from '../types/Awaitable';

import { injectScript } from '../utils/injectScript';
import { injectStylesheet } from '../utils/injectStylesheet';
import { preloadResource } from '../utils/preloadResource';
import { uniq } from '../utils/uniq';

/**
 * Loads pack of resources (scripts and stylesheets) and returns the exported global variables (if any).
 *
 * @param pack The pack of resources to load.
 * @returns A promise that resolves with the exported global variables.
 * @example
 *
 * ```ts
 * const ckeditor = await loadCKCdnResourcesPack<ClassicEditor>( {
 * 	scripts: [
 * 		'https://cdn.ckeditor.com/ckeditor5/30.0.0/classic/ckeditor.js'
 * 	],
 * 	checkPluginLoaded: () => ( window as any ).ClassicEditor
 * } );
 * ```
 */
export async function loadCKCdnResourcesPack<P extends CKCdnResourcesPack<any>>( pack: P ): Promise<InferCKCdnResourcesPackExportsType<P>> {
	let {
		scripts = [],
		stylesheets = [],
		preload,
		checkPluginLoaded
	} = normalizeCKCdnResourcesPack( pack );

	// If preload is not defined, use all stylesheets and scripts as preload resources.
	if ( !preload ) {
		preload = uniq( [
			...stylesheets.filter( item => typeof item === 'string' ),
			...scripts.filter( item => typeof item === 'string' )
		] );
	}

	// Preload resources specified in the pack.
	preload.forEach( preloadResource );

	// Load stylesheet tags before scripts to avoid a flash of unstyled content.
	await Promise.all(
		uniq( stylesheets ).map( href => injectStylesheet( {
			href,
			placementInHead: 'start'
		} ) )
	);

	// Load script tags.
	for ( const script of uniq( scripts ) ) {
		if ( typeof script === 'string' ) {
			await injectScript( script );
		} else {
			await script();
		}
	}

	// Wait for execution all injected scripts.
	return checkPluginLoaded?.();
}

/**
 * Normalizes the CKCdnResourcesPack configuration to the advanced format.
 *
 * @param pack The pack of resources to normalize.
 * @returns The normalized pack of resources.
 */
export function normalizeCKCdnResourcesPack<R = any>( pack: CKCdnResourcesPack<R> ): CKCdnResourcesAdvancedPack<R> {
	// Check if it is array of URLs, if so, convert it to the advanced format.
	if ( Array.isArray( pack ) ) {
		return {
			scripts: pack.filter(
				item => typeof item === 'function' || item.endsWith( '.js' )
			),

			stylesheets: pack.filter(
				item => item.endsWith( '.css' )
			)
		};
	}

	// Check if it is a local import function, if so, convert it to the advanced format.
	if ( typeof pack === 'function' ) {
		return {
			checkPluginLoaded: pack
		};
	}

	// Return the pack as it is, because it's already in the advanced format.
	return pack;
}

/**
 * A pack of resources to load (scripts and stylesheets) and the exported global variables.
 */
export type CKCdnResourcesPack<R = any> =
	| CKCdnResourcesAdvancedPack<R>
	| CKCdnResourcesBasicUrlsPack
	| CKCdnResourcesLocalPack<R>;

/**
 * A pack of resources to load as an async function that results with UMD module.
 *
 * @example
 * ```ts
 * const pack = async () => import( './your-module' );
 * ```
 */
type CKCdnResourcesLocalPack<R> = () => Awaitable<R>;

/**
 * A pack of resources to load (scripts and stylesheets). In such configuration, the exported global variable
 * might be available but it's not guaranteed.
 *
 * @example
 * ```ts
 * const pack = [
 * 	'https://cdn.ckeditor.com/ckeditor5/30.0.0/classic/ckeditor.js'
 * ];
 * ```
 */
type CKCdnResourcesBasicUrlsPack = Array<string>;

/**
 * A pack of resources to load (scripts and stylesheets) and the exported global variables.
 *
 * @example
 * ```ts
 * const pack = {
 * 	scripts: [
 * 		'https://cdn.ckeditor.com/ckeditor5/30.0.0/classic/ckeditor.js'
 * 	],
 * 	checkPluginLoaded: () => ( window as any ).ClassicEditor
 * };
 * ```
 */
export type CKCdnResourcesAdvancedPack<R> = {

	/**
	 * List of resources to preload, it should improve the performance of loading the resources.
	 */
	preload?: Array<string>;

	/**
	 * List of scripts to load. Scripts are loaded in the order they are defined.
	 */
	scripts?: Array<string | ( () => Awaitable<unknown> )>;

	/**
	 * List of stylesheets to load. Stylesheets are loaded in the order they are defined.
	 */
	stylesheets?: Array<string>;

	/**
	 * Get JS object with global variables exported by scripts.
	 */
	checkPluginLoaded?: () => Awaitable<R>;
};

/**
 * Extracts the type of the exported global variables from a CKResourcesPack.
 */
export type InferCKCdnResourcesPackExportsType<P> = P extends CKCdnResourcesPack<infer R> ? R : never;
