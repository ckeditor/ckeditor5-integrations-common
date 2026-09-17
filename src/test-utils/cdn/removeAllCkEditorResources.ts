/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

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
		.forEach( script => script.remove() );

	delete window.CKEDITOR;
	delete window.CKEDITOR_PREMIUM_FEATURES;
	window.CKEDITOR_VERSION = '';
}

function removeCkCdnLinks(): void {
	[ ...document.querySelectorAll( 'link' ) ]
		.filter( link => link.href.startsWith( CK_CDN_URL ) )
		.forEach( link => link.remove() );
}
