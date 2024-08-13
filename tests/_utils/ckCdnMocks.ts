/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { CK_CDN_URL, createCKCdnUrl } from '@/cdn/ck/createCKCdnUrl';

import { INJECTED_SCRIPTS } from '@/utils/injectScript';
import { INJECTED_STYLESHEETS } from '@/utils/injectStylesheet';

/**
 * The URL of the CKEditor CDN.
 */
export const CDN_MOCK_SCRIPT_URL = createCKCdnUrl( 'ckeditor5', 'ckeditor5.umd.js', '43.0.0' );

/**
 * The URL of the CKEditor CDN.
 */
export const CDN_MOCK_STYLESHEET_URL = createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '43.0.0' );

/**
 * Removes all CKEditor scripts from the DOM.
 */
export function removeCkCdnScripts(): void {
	[ ...document.querySelectorAll( 'script' ) ]
		.filter( script => script.src.startsWith( CK_CDN_URL ) )
		.forEach( script => {
			INJECTED_SCRIPTS.delete( script.src );
			script.remove();
		} );

	// Clear the CKEditor global variables
	delete window.CKEDITOR;
	delete window.CKEDITOR_PREMIUM_FEATURES;
	window.CKEDITOR_VERSION = '';
}

/**
 * Removes all CKEditor stylesheets and preloads from the DOM.
 */
export function removeCkCdnLinks(): void {
	[ ...document.querySelectorAll( 'link' ) ]
		.filter( link => link.href.startsWith( CK_CDN_URL ) )
		.forEach( link => {
			INJECTED_STYLESHEETS.delete( link.href );
			link.remove();
		} );
}
