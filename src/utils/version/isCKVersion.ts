/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { isSemanticVersion, type SemanticVersion } from './isSemanticVersion.js';

export const CK_TESTING_CHANNELS = [ 'nightly', 'alpha', 'staging', 'internal' ] as const;

/**
 * A channel of testing version.
 */
export type CKTestingChannel = typeof CK_TESTING_CHANNELS[ number ];

/**
 * A version of the CKEditor that is used for testing purposes.
 */
export type CKTestingVersion =
	| CKTestingChannel
	| `${ CKTestingChannel }-${ string }`
	| `${ SemanticVersion }-${ CKTestingChannel }${ string }`;

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

	return CK_TESTING_CHANNELS.some( channel => version.includes( channel ) );
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

/**
 * Extracts the testing channel from a channel alias or a resolved semantic version.
 *
 * @param version - The version or the channel alias to inspect.
 * @returns The testing channel or `null` if the version does not belong to any.
 * @example
 * ```ts
 * extractCKTestingChannel( 'nightly' ); // -> 'nightly'
 * extractCKTestingChannel( 'nightly-abc' ); // -> 'nightly'
 * extractCKTestingChannel( '0.0.0-nightly-20260917.0' ); // -> 'nightly'
 * extractCKTestingChannel( '1.2.3-alpha.1' ); // -> 'alpha'
 * extractCKTestingChannel( '1.2.3' ); // -> null
 * ```
 */
export function extractCKTestingChannel( version: string ): CKTestingChannel | null {
	return version.split( /[-.]/ ).find( ( segment ): segment is CKTestingChannel =>
		( CK_TESTING_CHANNELS as unknown as Array<string> ).includes( segment )
	) ?? null;
}

/**
 * Checks if the given string is a testing channel alias, such as `nightly` or `nightly-next`.
 *
 * Aliases are resolved by the CDN to concrete semantic versions, so unlike them
 * they cannot be compared by strict equality.
 *
 * @param version - The string to check.
 * @returns `true` if the string is a channel alias, `false` for concrete versions.
 * @example
 * ```ts
 * isCKTestingChannel( 'nightly' ); // -> true
 * isCKTestingChannel( 'nightly-next' ); // -> true
 * isCKTestingChannel( '0.0.0-nightly-20260917.0' ); // -> false
 * isCKTestingChannel( '47.7.0-alpha.2' ); // -> false
 * isCKTestingChannel( '47.7.0' ); // -> false
 * ```
 */
export function isCKTestingChannel( version: string | undefined ): version is CKTestingChannel | `${ CKTestingChannel }-${ string }` {
	if ( !version ) {
		return false;
	}

	return ( CK_TESTING_CHANNELS as unknown as Array<string> ).includes( version.split( '-' )[ 0 ] );
}
