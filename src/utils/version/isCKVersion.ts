/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { isSemanticVersion, type SemanticVersion } from './isSemanticVersion.js';

/**
 * A version of the CKEditor that is used for testing purposes.
 */
export type CKTestingVersion =
	| 'nightly'
	| `nightly-${ string }`
	| 'alpha'
	| 'staging'
	| 'internal';

/**
 * A version of the CKEditor.
 */
export type CKVersion =
	| SemanticVersion
	| CKTestingVersion;

/**
 * Checks if the given string is a version of a file on the CKEditor.
 *
 * @param version - The string to check.
 * @returns `true` if the string is a version of a file on the CKEditor, `false` otherwise.
 * @example
 * ```ts
 * isCKTestingVersion( '1.2.3-nightly-abc' ); // -> true
 * isCKTestingVersion( '1.2.3-internal-abc' ); // -> true
 * isCKTestingVersion( '1.2.3-alpha.1' ); // -> true
 * isCKTestingVersion( '1.2.3' ); // -> false
 * isCKTestingVersion( 'nightly' ); // -> true
 * isCKTestingVersion( 'nightly-abc' ); // -> true
 * isCKTestingVersion( 'staging' ); // -> true
 * ```
 */
export function isCKTestingVersion( version: string | undefined ): version is CKTestingVersion {
	if ( !version ) {
		return false;
	}

	return [ 'nightly', 'alpha', 'internal', 'nightly-', 'staging' ].some( testVersion => version.includes( testVersion ) );
}

/**
 * Checks if given version is nightly like version with `0.0.0` versioning.
 *
 * @param version - The version to check.
 * @returns `true` if it's nightly-like version.
 */
export function isCKZeroBaseVersion( version: string | undefined ): version is SemanticVersion {
	return !!version?.startsWith( '0.0.0-' );
}

/**
 * Checks if the given string is a version of a file on the CKEditor CDN.
 *
 * @param version - The string to check.
 * @returns `true` if the string is a version of a file on the CKEditor, `false` otherwise.
 * @example
 * ```ts
 * isCKVersion( 'nightly' ); // -> true
 * isCKVersion( 'alpha' ); // -> true
 * isCKVersion( 'rc-1.2.3' ); // -> true
 * isCKVersion( '1.2.3' ); // -> true
 * isCKVersion( 'nightly-abc' ); // -> true
 * isCKVersion( 'staging' ); // -> true
 * ```
 */
export function isCKVersion( version: string | undefined ): version is CKVersion {
	return isSemanticVersion( version ) || isCKTestingVersion( version );
}
