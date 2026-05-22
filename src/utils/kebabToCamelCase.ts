/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * Converts a kebab-case string to camelCase.
 * @param str - The kebab-case string (e.g., "font-size").
 * @returns The camelCase string (e.g., "fontSize").
 */
export function kebabToCamelCase( str: string ): string {
	return str.replace( /-([a-z])/g, ( match: string, letter: string ) => letter.toUpperCase() );
}
