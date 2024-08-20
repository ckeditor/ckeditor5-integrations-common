/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type * as CKEditorPremiumFeatures from 'ckeditor5-premium-features';
import type * as CKEditor from 'ckeditor5';

/**
 * Exported global variables of the CKEditor and CKEditor Premium Features.
 */
export declare global {
	interface Window {
		CKEDITOR_VERSION?: string;
		CKEDITOR?: typeof CKEditor;
		CKEDITOR_PREMIUM_FEATURES?: typeof CKEditorPremiumFeatures;
	}
}
