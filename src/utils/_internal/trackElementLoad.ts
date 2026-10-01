/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * Key under which the load promise is stored directly on the injected element.
 */
const LOAD_PROMISE = Symbol.for( 'ckeditor-integration-load-promise' );

type MaybeInjected = Element & { [ LOAD_PROMISE ]?: Promise<void> };

/**
 * Returns the load promise of an injected elements.
 *
 * @param element The element to read the promise from. `null` is accepted for convenience.
 */
export function getLoadPromise( element: Element | null ): Promise<void> | undefined {
	return ( element as MaybeInjected | null )?.[ LOAD_PROMISE ];
}

/**
 * Creates a promise resolved when the element loads, and stores it on the element itself.
 * Must be called *before* the `src` / `href` attribute is set.
 *
 * @param element The script or link element to observe.
 * @returns A promise that resolves when the element is loaded.
 */
export function trackElementLoad(
	element: HTMLScriptElement | HTMLLinkElement
): Promise<void> {
	const promise = new Promise<void>( ( resolve, reject ) => {
		element.onload = () => resolve();
		element.onerror = reject;
	} ).catch( error => {
		element.remove();

		throw error;
	} );

	( element as MaybeInjected )[ LOAD_PROMISE ] = promise;

	return promise;
}
