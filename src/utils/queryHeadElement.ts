/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * Queries a link element with the given `href` attribute.
 */
export function queryStylesheet( href: string ): HTMLLinkElement | null {
	return document.querySelector( `head > link[rel="stylesheet"][href="${ href }"]` );
}

/**
 * Queries a preload link element with the given `href` attribute.
 */
export function queryPreload( href: string ): HTMLLinkElement | null {
	return document.querySelector( `head > link[rel="preload"][href="${ href }"]` );
}

/**
 * Queries a script element with the given `src` attribute.
 */
export function queryScript( src: string ): HTMLScriptElement | null {
	return document.querySelector( `head > script[src="${ src }"]` );
}
