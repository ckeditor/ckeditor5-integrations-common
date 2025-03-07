/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * Filters object values using the provided filter function.
 *
 * @param obj Object to filter.
 * @param filter Function that filters the object values.
 * @returns Object with filtered values.
 *
 * @example
 * ```ts
 * const obj = {
 * 	a: 1,
 * 	b: 2
 * };
 *
 * const filteredObj = filterObjectValues( value => value > 1, obj );
 * // filteredObj is { b: 2 }
 * ```
 */
export function filterObjectValues<T>(
	obj: Record<string, T>,
	filter: ( value: T, key: string ) => boolean
): Record<string, T> {
	const filteredEntries = Object
		.entries( obj )
		.filter( ( [ key, value ] ) => filter( value, key ) );

	return Object.fromEntries( filteredEntries );
}
