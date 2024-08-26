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
 * @param href The URL of the stylesheet to be injected.
 * @returns A promise that resolves when the stylesheet is loaded.
 */
export function injectStylesheet( href: string ): Promise<void> {
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

		document.head.appendChild( link );

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
