/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { INJECTED_STYLESHEETS } from '../../utils/injectStylesheet.js';
import { INJECTED_SCRIPTS } from '../../utils/injectScript.js';
import { CK_CDN_URL } from '../../cdn/ck/createCKCdnUrl.js';

/**
 * Removes all CKEditor scripts from the DOM.
 */
export function removeCKEditorResources(): void {
	removeCkCdnScripts();
	removeCkCdnLinks();
}

function removeCkCdnScripts(): void {
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

function removeCkCdnLinks(): void {
	[ ...document.querySelectorAll( 'link' ) ]
		.filter( link => link.href.startsWith( CK_CDN_URL ) )
		.forEach( link => {
			INJECTED_STYLESHEETS.delete( link.href );
			link.remove();
		} );
}
