/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { compareInstalledCKBaseVersion } from './compareInstalledCKBaseVersion.js';

/**
 * Checks features supported by currently installed version of the editor.
 *
 * @returns Object containing flags that indicate which features are supported.
 */
export function getCKBaseFeaturesInstallationInfo(): CKBaseFeaturesInstallationInfo {
	const installedVersion = compareInstalledCKBaseVersion( '48.0.0' );
	const isV48OrNewer = installedVersion !== null && installedVersion >= 0;

	return {
		rootsMap: isV48OrNewer,
		elementAttachment: isV48OrNewer
	};
}

export type CKBaseFeaturesInstallationInfo = {

	/**
	 * Flag that indicates if editor supports `roots` / `root` config entries.
	 *
	 * Older versions:
	 *
	 * ```ts
	 * MultirootEditor.create( sourceElementOrData, {
	 * 	rootsAttributes: {
	 * 		"custom-root": { ... }
	 * 	}
	 * 	// ...
	 * } )
	 * ```
	 *
	 * Newer versions:
	 *
	 * ```ts
	 * MultirootEditor.create( sourceElementOrData, {
	 * 	roots: {
	 * 		"custom-root": { modelAttributes: { ... } }
	 * 	}
	 * 	// ...
	 * } )
	 * ```
	 *
	 * See more: https://github.com/ckeditor/ckeditor5/issues/19885
	 */
	rootsMap: boolean;

	/**
	 * Flag that indicates if editor no longer supports `sourceElementOrData` as first parameter
	 * in its initializer.
	 *
	 * Older versions:
	 *
	 * ```ts
	 * ClassicEditor.create( document.querySelector( '#editor' ), { ... } )
	 * ```
	 *
	 * Newer versions:
	 *
	 * ```ts
	 * ClassicEditor.create( {
	 * 	attachTo: document.querySelector( '#editor' ),
	 * 	// ...
	 * } )
	 * ```
	 */
	elementAttachment: boolean;
};
