/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * Clear whole array while keeping its reference.
 */
export function overwriteArray<A extends Array<any>>( source: A, destination: A ): A {
	destination.length = 0;
	destination.push( ...source );

	return destination;
}
