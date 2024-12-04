/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { isSemanticVersion, type SemanticVersion } from './isSemanticVersion.js';

type DestructuredSemanticVersion = {
	major: number;
	minor: number;
	patch: number;
};

/**
 * Destructure a semantic version string into its major, minor, and patch components.
 *
 * @param version - The semantic version string to destructure.
 * @returns An object containing the major, minor, and patch numbers.
 * @throws Will throw an error if the provided version is not a valid semantic version.
 */
export function destructureSemanticVersion( version: SemanticVersion ): DestructuredSemanticVersion {
	if ( !isSemanticVersion( version ) ) {
		throw new Error( `Invalid semantic version: ${ version || '<blank>' }.` );
	}

	const [ major, minor, patch ] = version.split( '.' );

	return {
		major: Number.parseInt( major, 10 ),
		minor: Number.parseInt( minor, 10 ),
		patch: Number.parseInt( patch, 10 )
	};
}
