/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * Map of injected stylesheets, grouped by the node they have been injected into. It's used to prevent
 * injecting the same stylesheet into the same node multiple times. It happens quite often in React
 * Strict mode when the component is rendered twice.
 */
export const INJECTED_STYLESHEETS = new WeakMap<InjectStylesheetTargetNode, Map<string, Promise<void>>>();

/**
 * Injects a stylesheet into the document.
 *
 * @param props.href The URL of the stylesheet to be injected.
 * @param props.placementInHead The placement of the stylesheet in the head. Deprecated.
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
		placementInHead = 'start',
		placement = placementInHead,
		attributes = {}
	}: InjectStylesheetProps
): Promise<void> {
	const injectedStylesheets = getInjectedStylesheets( targetNode );

	// Return the promise if the stylesheet is already injected into this node by this function.
	if ( injectedStylesheets.has( href ) ) {
		return injectedStylesheets.get( href )!;
	}

	// Return the promise if the stylesheet is already present in the target node but not injected by this
	// function. We are not sure if the stylesheet is loaded or not, so we have to show a warning in this case.
	const maybePrevStylesheet = targetNode.querySelector( `link[href="${ href }"][rel="stylesheet"]` );

	if ( maybePrevStylesheet ) {
		console.warn( `Stylesheet with "${ href }" href is already present in DOM!` );
		maybePrevStylesheet.remove();
	}

	// Append the link tag to the target node.
	const appendLinkTagToTargetNode = ( link: HTMLLinkElement ) => {
		// Inject styles after the stylesheets that are already present in the target node.
		// Do not specify the `rel` attribute because we want to inject the stylesheet even after
		// preloading link tags.
		const previouslyInjectedLinks = Array.from(
			targetNode.querySelectorAll( 'link[data-injected-by="ckeditor-integration"]' )
		);

		switch ( placement ) {
			// It'll append styles *before* the stylesheets that are already present in the target node
			// but after the ones that are injected by this function.
			case 'start':
				if ( previouslyInjectedLinks.length ) {
					previouslyInjectedLinks.slice( -1 )[ 0 ].after( link );
				} else {
					targetNode.insertBefore( link, targetNode.firstChild );
				}
				break;

			// It'll append styles *after* the stylesheets already in the target node.
			case 'end':
				targetNode.appendChild( link );
				break;
		}
	};

	// Inject the stylesheet and return the promise.
	const promise = new Promise<void>( ( resolve, reject ) => {
		const link = targetNode.ownerDocument!.createElement( 'link' );

		// Set additional attributes if provided.
		for ( const [ key, value ] of Object.entries( attributes || {} ) ) {
			link.setAttribute( key, value );
		}

		link.setAttribute( 'data-injected-by', 'ckeditor-integration' );

		link.rel = 'stylesheet';
		link.href = href;

		link.onerror = reject;
		link.onload = () => {
			resolve();
		};

		appendLinkTagToTargetNode( link );

		// It should remove stylesheet if stylesheet is being removed from the DOM.
		const observer = new MutationObserver( mutations => {
			const removedNodes = mutations.flatMap( mutation => Array.from( mutation.removedNodes ) );

			if ( removedNodes.includes( link ) ) {
				injectedStylesheets.delete( href );
				observer.disconnect();
			}
		} );

		observer.observe( targetNode, {
			childList: true,
			subtree: true
		} );
	} );

	injectedStylesheets.set( href, promise );

	return promise;
}

/**
 * Returns the map of stylesheets injected into the given node, creating it if necessary.
 *
 * @param targetNode The node to get the injected stylesheets for.
 * @returns The map of promises of the stylesheets injected into the given node.
 */
function getInjectedStylesheets( targetNode: InjectStylesheetTargetNode ): Map<string, Promise<void>> {
	let injectedStylesheets = INJECTED_STYLESHEETS.get( targetNode );

	if ( !injectedStylesheets ) {
		injectedStylesheets = new Map();
		INJECTED_STYLESHEETS.set( targetNode, injectedStylesheets );
	}

	return injectedStylesheets;
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
export type InjectStylesheetLocation =
	| InjectStylesheetHeadLocation
	| InjectStylesheetCustomLocation;

type InjectStylesheetHeadLocation = {
	targetNode?: never;
	placement?: never;

	/**
	 * The placement of the stylesheet in the head. It can be either at the start or at the end
	 * of the head.
	 *
	 * @default 'start'
	 * @deprecated Use `targetNode` and `placement` instead.
	 */
	placementInHead?: InjectStylesheetPlacement;
};

type InjectStylesheetCustomLocation = {
	placementInHead?: never;

	/**
	 * The node to which the stylesheet element should be added. Besides regular elements, it accepts
	 * shadow roots, so the stylesheet can be scoped to a web component.
	 */
	targetNode: InjectStylesheetTargetNode;

	/**
	 * The placement of the stylesheet in the target node. It can be either at the start or at the end
	 * of the target node.
	 *
	 * @default 'start'
	 */
	placement?: InjectStylesheetPlacement;
};

/**
 * The node that can host injected stylesheets.
 */
type InjectStylesheetTargetNode = HTMLElement | ShadowRoot;

type InjectStylesheetPlacement = 'start' | 'end';
