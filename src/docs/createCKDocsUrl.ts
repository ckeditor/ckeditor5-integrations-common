/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { SemanticVersion } from '../utils/isSemanticVersion.js';

export const CK_DOCS_URL = 'https://ckeditor.com/docs/ckeditor5';

/**
 * Creates a URL to a file on the CKEditor documentation.
 */
export function createCKDocsUrl( path: string, version: SemanticVersion | 'latest' = 'latest' ): string {
	return `${ CK_DOCS_URL }/${ version }/${ path }`;
}
