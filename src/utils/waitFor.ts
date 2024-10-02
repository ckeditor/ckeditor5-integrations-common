/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { Awaitable } from '../types/Awaitable.js';

/**
 * Waits for the provided callback to succeed. The callback is executed multiple times until it succeeds or the timeout is reached.
 * It's executed immediately and then with a delay defined by the `retry` option.
 *
 * @param callback The callback to execute.
 * @param config Configuration for the function.
 * @returns A promise that resolves when the callback succeeds.
 *
 * @example
 * ```ts
 * await waitFor( async () => {
 * 	const element = document.querySelector( '.my-element' );
 * 	if ( !element ) {
 * 		throw new Error( 'Element not found.' );
 * 	}
 * } );
 * ```
 */
export function waitFor<R>(
	callback: () => Awaitable<R>,
	{
		timeOutAfter = 500,
		retryAfter = 100
	}: WaitForConfig = {}
): Promise<R> {
	// Retry the callback until it succeeds or the timeout is reached.
	return new Promise<R>( ( resolve, reject ) => {
		const startTime = Date.now();
		let lastError: Error | null = null;

		const timeoutTimerId = setTimeout( () => {
			reject( lastError ?? new Error( 'Timeout' ) );
		}, timeOutAfter );

		const tick = async () => {
			try {
				const result = await callback();
				clearTimeout( timeoutTimerId );
				resolve( result );
			} catch ( err: any ) {
				lastError = err;

				if ( Date.now() - startTime > timeOutAfter ) {
					reject( err );
				} else {
					setTimeout( tick, retryAfter );
				}
			}
		};

		tick();
	} );
}

/**
 * Configuration for the `waitFor` function.
 */
export type WaitForConfig = {
	// The time in milliseconds after which the function will stop retrying and reject the promise.
	timeOutAfter?: number;

	// The time in milliseconds between retries.
	retryAfter?: number;
};
