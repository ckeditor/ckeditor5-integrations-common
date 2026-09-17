/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { getLoadPromise, trackElementLoad } from './_internal/trackElementLoad.js';

/**
 * Injects a stylesheet into the document. Injecting the same `href` into the same node twice is a no-op
 * the promise of the first injection is returned.
 *
 * @param props.href The URL of the stylesheet to be injected.
 * @param props.attributes Additional attributes to be set on the link element.
 * @param props.targetNode The node to which the stylesheet element should be added. It can be an element
 * 	or a shadow root.
 * @param props.placement The placement of the stylesheet in the target node.
 * @returns A promise that resolves when the stylesheet is loaded.
 */
export function injectStylesheet(
	{
		href,
		targetNode = document.head,
		placement = 'start',
		attributes = {}
	}: InjectStylesheetProps
): Promise<void> {
	const prevLink = targetNode.querySelector( `link[href="${ href }"][rel="stylesheet"]` );
	const prevPromise = getLoadPromise( prevLink );

	if ( prevPromise ) {
		return prevPromise;
	}

	if ( prevLink ) {
		console.warn( `Stylesheet with "${ href }" href is already present in DOM!` );
		prevLink.remove();
	}

	const link = targetNode.ownerDocument!.createElement( 'link' );

	for ( const [ key, value ] of Object.entries( attributes || {} ) ) {
		link.setAttribute( key, value );
	}

	link.setAttribute( 'data-injected-by', 'ckeditor-integration' );
	link.rel = 'stylesheet';

	const promise = trackElementLoad( link );

	link.href = href;
	appendLink( targetNode, link, placement );

	return promise;
}

/**
 * Appends the link tag to the target node at the requested placement.
 */
function appendLink(
	targetNode: HTMLElement | ShadowRoot,
	link: HTMLLinkElement,
	placement: InjectStylesheetPlacement
): void {
	if ( placement === 'end' ) {
		targetNode.appendChild( link );

		return;
	}

	const injectedLinks = Array.from( targetNode.children ).filter(
		child => child.matches( 'link[data-injected-by="ckeditor-integration"]' )
	);

	const lastInjectedLink = injectedLinks[ injectedLinks.length - 1 ];

	if ( lastInjectedLink ) {
		lastInjectedLink.after( link );
	} else {
		targetNode.prepend( link );
	}
}

/**
 * Props for the `injectStylesheet` function.
 */
type InjectStylesheetProps =
	& {

		/**
		 * The URL of the stylesheet to be injected.
		 */
		href: string;

		/**
		 * Additional attributes to set on the link tag.
		 */
		attributes?: Record<string, any>;
	}
	& InjectStylesheetLocation;

/**
 * The location where the stylesheet is to be injected.
 */
export type InjectStylesheetLocation = {

	/**
	 * The node to which the stylesheet element should be added. Besides regular elements, it accepts
	 * shadow roots, so the stylesheet can be scoped to a web component.
	 *
	 * @default document.head
	 */
	targetNode?: HTMLElement | ShadowRoot;

	/**
	 * The placement of the stylesheet in the target node. It can be either at the start or at the end
	 * of the target node.
	 *
	 * @default 'start'
	 */
	placement?: InjectStylesheetPlacement;
};

type InjectStylesheetPlacement = 'start' | 'end';
