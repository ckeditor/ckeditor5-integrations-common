/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { filterObjectValues } from './filterObjectValues.js';

/**
 * Removes null and undefined values from an object.
 *
 * @param obj Object to filter.
 * @returns Object with filtered values.
 * @example
 * ```ts
 * const obj = {
 * 	a: 1,
 * 	b: null,
 * 	c: undefined
 * };
 *
 * const filteredObj = filterBlankObjectValues( obj );
 * // filteredObj is { a: 1 }
 * ```
 */
export function filterBlankObjectValues<T>( obj: Record<string, T> ): FilterBlankRecordProperties<T> {
	return filterObjectValues(
		obj,
		value => value !== null && value !== undefined
	) as FilterBlankRecordProperties<T>;
}

/**
 * Removes null and undefined values from an object.
 */
type FilterBlankRecordProperties<T> = Record<string, Exclude<T, null | undefined>>;
