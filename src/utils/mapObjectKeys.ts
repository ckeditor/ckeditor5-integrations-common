/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * Creates a new object with keys mapped using the provided function.
 * @param obj - The input object.
 * @param fn - The mapping function (takes the original key, returns the new one).
 * @returns A new object with the mapped keys.
 */
export function mapObjectKeys<T>(
	obj: Record<string, T>,
	fn: ( key: string ) => string
): Record<string, T> {
	return Object.keys( obj ).reduce( ( acc: Record<string, T>, key: string ) => {
		const newKey = fn( key );
		acc[ newKey ] = obj[ key ];
		return acc;
	}, Object.create( null ) );
}
