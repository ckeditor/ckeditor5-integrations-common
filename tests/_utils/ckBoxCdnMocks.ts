/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { CKBOX_CDN_URL, createCKBoxCdnUrl } from '@/cdn/ckbox/createCKBoxCdnUrl';

import { INJECTED_SCRIPTS } from '@/utils/injectScript';
import { INJECTED_STYLESHEETS } from '@/utils/injectStylesheet';

/**
 * The URL of the CKBox CDN.
 */
export const CKBOX_CDN_MOCK_SCRIPT_URL = createCKBoxCdnUrl( 'ckbox', 'ckbox.js', '2.5.1' );

/**
 * The URL of the CKBox CDN.
 */
export const CKBOX_CDN_MOCK_STYLESHEET_URL = createCKBoxCdnUrl( 'ckbox', 'styles/themes/lark.css', '2.5.1' );

/**
 * Removes all CKBox scripts from the DOM.
 */
export function removeCkBoxCdnScripts(): void {
	[ ...document.querySelectorAll( 'script' ) ]
		.filter( script => script.src.startsWith( CKBOX_CDN_URL ) )
		.forEach( script => {
			INJECTED_SCRIPTS.delete( script.src );
			script.remove();
		} );

	delete ( window as any ).CKBox;
}

/**
 * Removes all CKBox stylesheets and preloads from the DOM.
 */
export function removeCkBoxCdnLinks(): void {
	[ ...document.querySelectorAll( 'link' ) ]
		.filter( link => link.href.startsWith( CKBOX_CDN_URL ) )
		.forEach( link => {
			INJECTED_STYLESHEETS.delete( link.href );
			link.remove();
		} );
}
