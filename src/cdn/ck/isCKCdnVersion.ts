/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { isSemanticVersion, type SemanticVersion } from '../../utils/version/isSemanticVersion.js';

/**
 * A version of the CKEditor that is used for testing purposes.
 */
export type CKCdnTestingVersion =
	| 'nightly'
	| 'alpha'
	| 'internal';

/**
 * A version of a file on the CKEditor CDN.
 */
export type CKCdnVersion =
	| SemanticVersion
	| CKCdnTestingVersion;

/**
 * Checks if the given string is a version of a file on the CKEditor CDN.
 *
 * @param version - The string to check.
 * @returns `true` if the string is a version of a file on the CKEditor CDN, `false` otherwise.
 * @example
 * ```ts
 * isCKCdnTestingVersion( '1.2.3-nightly-abc' ); // -> true
 * isCKCdnTestingVersion( '1.2.3-internal-abc' ); // -> true
 * isCKCdnTestingVersion( '1.2.3-alpha.1' ); // -> true
 * isCKCdnTestingVersion( '1.2.3' ); // -> false
 * isCKCdnTestingVersion( 'nightly' ); // -> true
 * ```
 */
export function isCKCdnTestingVersion( version: string | undefined ): version is CKCdnTestingVersion {
	if ( !version ) {
		return false;
	}

	return [ 'nightly', 'alpha', 'internal' ].some( testVersion => version.includes( testVersion ) );
}

/**
 * Checks if the given string is a version of a file on the CKEditor CDN.
 *
 * @param version - The string to check.
 * @returns `true` if the string is a version of a file on the CKEditor CDN, `false` otherwise.
 * @example
 * ```ts
 * isCKCdnVersion( 'nightly' ); // -> true
 * isCKCdnVersion( 'alpha' ); // -> true
 * isCKCdnVersion( 'rc-1.2.3' ); // -> true
 * isCKCdnVersion( '1.2.3' ); // -> true
 * ```
 */
export function isCKCdnVersion( version: string | undefined ): version is CKCdnVersion {
	return isSemanticVersion( version ) || isCKCdnTestingVersion( version );
}
