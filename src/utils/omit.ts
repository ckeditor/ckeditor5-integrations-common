/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

export function omit<
	O extends Record<string | symbol | number, any>,
	K extends Array<keyof O>
>( keys: K, obj: O ): Omit<O, K[number]> {
	const clone = { ...obj };

	for ( const key of keys ) {
		if ( Object.hasOwn( obj, key ) ) {
			delete clone[ key ];
		}
	}

	return clone;
}
