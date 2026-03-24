/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { destructureSemanticVersion } from './destructureSemanticVersion.js';
import type { SemanticVersion } from './isSemanticVersion.js';

/**
 * Compares two semantic versions.
 *
 * - `1` if a > b
 * - `0` if a == b
 * - `-1` if a < b
 *
 * @param a	First semantic version to compare.
 * @param b Second semantic version to compare.
 * @returns Comparison result.
 */
export function compareSemanticVersions( a: SemanticVersion, b: SemanticVersion ): VersionCompareResult {
	const parsedA = destructureSemanticVersion( a );
	const parsedB = destructureSemanticVersion( b );

	return Math.sign(
		parsedA.major - parsedB.major ||
		parsedA.minor - parsedB.minor ||
		parsedA.patch - parsedB.patch
	) as VersionCompareResult;
}

/**
 * Result of the versions comparison.
 */
export type VersionCompareResult = 0 | 1 | -1;
