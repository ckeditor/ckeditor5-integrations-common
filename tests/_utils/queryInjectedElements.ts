/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export function queryAllInjectedScripts(): Array<HTMLScriptElement> {
	return [
		...document.querySelectorAll( 'script[data-injected-by="ckeditor-integration"]' )
	] as Array<HTMLScriptElement>;
}

export function queryAllInjectedLinks(): Array<HTMLLinkElement> {
	return [
		...document.querySelectorAll( 'link[data-injected-by="ckeditor-integration"]' )
	] as Array<HTMLLinkElement>;
}
