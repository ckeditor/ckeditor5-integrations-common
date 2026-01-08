/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { INJECTED_SCRIPTS } from '../../utils/injectScript.js';
import { INJECTED_STYLESHEETS } from '../../utils/injectStylesheet.js';
import { CKBOX_CDN_URL } from '../../cdn/ckbox/createCKBoxCdnUrl.js';

/**
 * Removes all CKBox resources from the DOM.
 */
export function removeCkBoxResources(): void {
	removeCkBoxCdnScripts();
	removeCkBoxCdnLinks();
}

/**
 * Removes all CKBox scripts from the DOM.
 */
function removeCkBoxCdnScripts(): void {
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
function removeCkBoxCdnLinks(): void {
	[ ...document.querySelectorAll( 'link' ) ]
		.filter( link => link.href.startsWith( CKBOX_CDN_URL ) )
		.forEach( link => {
			INJECTED_STYLESHEETS.delete( link.href );
			link.remove();
		} );
}
