/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * Removes items from an array by values.
 *
 * @param itemsToRemove Items to remove.
 * @param items Array to remove items from.
 * @returns Array without removed items.
 */
export function without<A>( itemsToRemove: Array<A>, items: Array<A> ): Array<A> {
	return items.filter( item => !itemsToRemove.includes( item ) );
}
