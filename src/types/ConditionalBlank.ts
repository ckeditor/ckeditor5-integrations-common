/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * A type that allows to set a value or leave it blank conditionally.
 * It's useful when we provide config, and depending on the config, we want to set a value or leave it blank.
 */
export type ConditionalBlank<Condition, Value> =
	Condition extends true | object ? NonNullable<Value> :
		Condition extends boolean ? NonNullable<Value> | undefined :
			undefined;
