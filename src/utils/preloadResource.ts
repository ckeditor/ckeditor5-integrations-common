/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * Appends a `<link>` element to the `<head>` to preload a resource.
 *
 * 	* It should detect if the resource is already preloaded.
 * 	* It should detect type of the resource and set the `as` attribute accordingly.
 *
 * @param url The URL of the resource to preload.
 * @param props Additional properties for the preload.
 * @param props.attributes Additional attributes to be set on the `<link>` element.
 */
export function preloadResource(
	url: string,
	{ attributes }: PreloadResourceProps = {}
): void {
	if ( document.head.querySelector( `link[href="${ url }"][rel="preload"]` ) ) {
		return;
	}

	const link = document.createElement( 'link' );

	// Set additional attributes if provided.
	for ( const [ key, value ] of Object.entries( attributes || {} ) ) {
		link.setAttribute( key, value );
	}

	link.setAttribute( 'data-injected-by', 'ckeditor-integration' );

	link.rel = 'preload';
	link.as = detectTypeOfResource( url );
	link.href = url;

	document.head.insertBefore( link, document.head.firstChild );
}

/**
 * Properties for the `preloadResource` function.
 */
type PreloadResourceProps = {
	attributes?: Record<string, any>;
};

/**
 * Detects the type of the resource based on its URL.
 */
function detectTypeOfResource( url: string ): string {
	switch ( true ) {
		case /\.css$/.test( url ):
			return 'style';

		case /\.js$/.test( url ):
			return 'script';

		default:
			return 'fetch';
	}
}
