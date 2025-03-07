/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * Maps object values using the provided mapper function.
 *
 * @param obj Object to map.
 * @param mapper Function that maps the object values.
 * @returns Object with mapped values.
 *
 * @example
 * ```ts
 * const obj = {
 * 	a: 1,
 * 	b: 2
 * };
 *
 * const mappedObj = mapObjectValues( obj, value => value * 2 );
 * // mappedObj is { a: 2, b: 4 }
 * ```
 */
export function mapObjectValues<T, U>(
	obj: Record<string, T>,
	mapper: ( value: T, key: string ) => U
): Record<string, U> {
	const mappedEntries = Object
		.entries( obj )
		.map( ( [ key, value ] ) => [ key, mapper( value, key ) ] as const );

	return Object.fromEntries( mappedEntries );
}
