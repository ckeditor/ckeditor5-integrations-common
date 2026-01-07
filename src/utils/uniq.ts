/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * A utility function that removes duplicate elements from an array.
 */
export function uniq<A>( source: Array<A> ): Array<A> {
	return Array.from( new Set( source ) );
}
