/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export type SemanticVersion = `${ number }.${ number }.${ number }`;

/**
 * Checks if the given string is a semantic version number.
 *
 * @param version - The string to check.
 * @returns `true` if the string is a semantic version, `false` otherwise.
 */
export function isSemanticVersion( version: string | undefined | null ): version is SemanticVersion {
	return !!version && /^\d+\.\d+\.\d+/.test( version );
}