/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { isSemanticVersion, type SemanticVersion } from '../../utils/isSemanticVersion.js';

/**
 * A version of a file on the CKEditor CDN that is used for testing purposes.
 */
export type CKCdnTestingVersion =
	| 'alpha'
	| `${ SemanticVersion }-nightly-${ string }`
	| `rc-${ string }`;

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
 * isCKCdnVersion( 'nightly' ); // -> true
 * isCKCdnVersion( 'alpha' ); // -> true
 * isCKCdnVersion( 'rc-1.2.3' ); // -> true
 * isCKCdnVersion( '1.2.3' ); // -> false
 * ```
 */
export function isCKCdnTestingVersion( version: string ): version is CKCdnTestingVersion {
	return version === 'alpha' || version === 'nightly' || version.startsWith( 'rc-' );
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
export function isCKCdnVersion( version: string ): version is CKCdnVersion {
	return isSemanticVersion( version ) || isCKCdnTestingVersion( version );
}
