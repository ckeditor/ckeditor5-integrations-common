/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { removeCKEditorResources } from './removeAllCkEditorResources.js';
import { removeCkBoxResources } from './removeAllCkBoxResources.js';

/**
 * Removes all CKEditor CDN resources from the DOM.
 */
export function removeAllCkCdnResources(): void {
	removeCKEditorResources();
	removeCkBoxResources();
}
