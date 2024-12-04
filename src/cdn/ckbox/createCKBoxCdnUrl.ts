/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { SemanticVersion } from '../../utils/version/isSemanticVersion.js';

/**
 * The URL of the CKBox CDN.
 */
export const CKBOX_CDN_URL = 'https://cdn.ckbox.io';

/**
 * A version of a file on the CKBox CDN.
 */
export type CKBoxCdnVersion = SemanticVersion;

/**
 * Creates a URL to a file on the CKBox CDN.
 *
 * @param bundle The name of the bundle.
 * @param file The name of the file.
 * @param version The version of the file.
 * @returns A function that accepts the version of the file and returns the URL.
 *
 * ```ts
 * const url = createCKBoxCdnUrl( 'ckbox', 'ckbox.js', '2.5.1' );
 *
 * expect( url ).to.be.equal( 'https://cdn.ckbox.io/ckbox/2.5.1/ckbox.js' );
 * ```
 */
export function createCKBoxCdnUrl( bundle: string, file: string, version: CKBoxCdnVersion ): string {
	return `${ CKBOX_CDN_URL }/${ bundle }/${ version }/${ file }`;
}
