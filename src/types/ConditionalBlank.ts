/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * A type that allows to conditionally set a value or leave it blank.
 * It's useful in case when we provided config and depending on the config we want to set a value or leave it blank.
 */
export type ConditionalBlank<Condition, Value> =
	Condition extends true | object ? NonNullable<Value> :
	Condition extends boolean ? NonNullable<Value> | undefined :
	undefined;
