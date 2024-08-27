/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * Map of injected stylesheets. It's used to prevent injecting the same stylesheet multiple times.
 * It happens quite often in React Strict mode when the component is rendered twice.
 */
export const INJECTED_STYLESHEETS = new Map<string, Promise<void>>();

/**
 * Injects a stylesheet into the document.
 *
 * @param props.href The URL of the stylesheet to be injected.
 * @param props.headPlacement The placement of the stylesheet in the head.
 * @returns A promise that resolves when the stylesheet is loaded.
 */
export function injectStylesheet( { href, headPlacement = 'start' }: InjectStylesheetProps ): Promise<void> {
	// Return the promise if the stylesheet is already injected by this function.
	if ( INJECTED_STYLESHEETS.has( href ) ) {
		return INJECTED_STYLESHEETS.get( href )!;
	}

	// Return the promise if the stylesheet is already present in the document but not injected by this function.
	// We are not sure if the stylesheet is loaded or not, so we have to show a warning in this case.
	const maybePrevStylesheet = document.querySelector( `link[href="${ href }"][rel="stylesheet"]` );

	if ( maybePrevStylesheet ) {
		console.warn( `Stylesheet with "${ href }" href is already present in DOM!` );
		maybePrevStylesheet.remove();
	}

	// Append the link tag to the head.
	const appendLinkTagToHead = ( link: HTMLLinkElement ) => {
		const previouslyInsertedStylesheets = Array.from(
			document.head.querySelectorAll( 'link[data-injected-by="ckeditor-integration"][rel="stylesheet"]' )
		);

		switch ( headPlacement ) {
			// It'll append styles *before* the stylesheets that are already present in the head
			// but after the ones that are injected by this function.
			case 'start':
				if ( previouslyInsertedStylesheets.length ) {
					previouslyInsertedStylesheets.slice( -1 )[ 0 ].after( link );
				} else {
					document.head.insertBefore( link, document.head.firstChild );
				}
				break;

			// It'll append styles *after* the stylesheets that are already present in the head.
			case 'end':
				document.head.appendChild( link );
				break;
		}
	};

	// Inject the stylesheet and return the promise.
	const promise = new Promise<void>( ( resolve, reject ) => {
		const link = document.createElement( 'link' );

		link.setAttribute( 'data-injected-by', 'ckeditor-integration' );
		link.rel = 'stylesheet';
		link.href = href;

		link.onerror = reject;
		link.onload = () => {
			resolve();
		};

		appendLinkTagToHead( link );

		// It should remove stylesheet if stylesheet is being removed from the DOM.
		const observer = new MutationObserver( mutations => {
			const removedNodes = mutations.flatMap( mutation => Array.from( mutation.removedNodes ) );

			if ( removedNodes.includes( link ) ) {
				INJECTED_STYLESHEETS.delete( href );
				observer.disconnect();
			}
		} );

		observer.observe( document.head, {
			childList: true,
			subtree: true
		} );
	} );

	INJECTED_STYLESHEETS.set( href, promise );

	return promise;
}

/**
 * Props for the `injectStylesheet` function.
 */
type InjectStylesheetProps = {

	/**
	 * The URL of the stylesheet to be injected.
	 */
	href: string;

	/**
	 * The placement of the stylesheet in the head. It can be either at the start or at the end
	 * of the head. Default is 'start' because it allows user to override the styles easily.
	 */
	headPlacement?: 'start' | 'end';
};
