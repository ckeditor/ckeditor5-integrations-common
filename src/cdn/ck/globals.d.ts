/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type * as CKEditorPremiumFeatures from 'ckeditor5-premium-features';
import type * as CKEditor from 'ckeditor5';

/**
 * Exported global variables of the CKEditor and CKEditor Premium Features.
 */
declare global {
	interface Window {
		CKEDITOR_VERSION?: string;
		CKEDITOR?: typeof CKEditor;
		CKEDITOR_PREMIUM_FEATURES?: typeof CKEditorPremiumFeatures;
	}
}

// Expose CKBox to the global scope, avoid using `export declare` because it's not supported by the older TypeScript compilers.
// Although it's supported by the TypeScript language service.
export {};
