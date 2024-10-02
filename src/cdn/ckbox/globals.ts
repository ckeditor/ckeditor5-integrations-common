/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * Exported global variables of the CKBox.
 */
declare global {
	interface Window {
		CKBox?: any;
	}
}

// Expose CKBox to the global scope, avoid using `export declare` because it's not supported by the older TypeScript compilers.
// Although it's supported by the TypeScript language service.
export {};
