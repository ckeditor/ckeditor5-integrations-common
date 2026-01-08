/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * Ensures that passed function will be executed only once.
 */
export function once<A extends Array<any>, R = void>( fn: ( ...args: A ) => R ): ( ...args: A ) => R {
	let lastResult: { current: R } | null = null;

	return ( ...args: A ): R => {
		if ( !lastResult ) {
			lastResult = {
				current: fn( ...args )
			};
		}

		return lastResult.current;
	};
}
