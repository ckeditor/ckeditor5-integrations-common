/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { removeCkBoxCdnLinks, removeCkBoxCdnScripts } from './ckBoxCdnMocks';
import { removeCkCdnLinks, removeCkCdnScripts } from './ckCdnMocks';

/**
 * Removes all CKEditor CDN resources from the DOM.
 */
export function removeAllCkCdnResources(): void {
	// Remove CKBox resources.
	removeCkBoxCdnScripts();
	removeCkBoxCdnLinks();

	// Remove CKEditor resources.
	removeCkCdnScripts();
	removeCkCdnLinks();
}
