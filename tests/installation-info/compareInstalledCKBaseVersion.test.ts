/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, beforeEach, expect } from 'vitest';

import { removeAllCkCdnResources } from '@/src/test-utils/index.js';
import { compareInstalledCKBaseVersion } from '@/src/installation-info/compareInstalledCKBaseVersion.js';

import type { SemanticVersion } from '@/src/utils/version/isSemanticVersion.js';
import type { VersionCompareResult } from '@/src/utils/version/compareSemanticVersions.js';

describe( 'compareInstalledCKBaseVersion', () => {
	beforeEach( () => {
		removeAllCkCdnResources();
	} );

	it( 'should return null if ckeditor is not installed', () => {
		expect( compareInstalledCKBaseVersion( '43.0.0' ) ).to.be.null;
	} );

	it( 'should return `1` if nightly version is installed regardless passed version', () => {
		window.CKEDITOR_VERSION = '0.0.0-nightly-20260324.0';

		expect( compareInstalledCKBaseVersion( '123.456.789' ) ).to.be.equal( 1 );
	} );

	it( 'should return `1` if non-semantic version is installed regardless passed version', () => {
		window.CKEDITOR_VERSION = 'internal';

		expect( compareInstalledCKBaseVersion( '123.456.789' ) ).to.be.equal( 1 );
	} );

	it.each<[string, SemanticVersion, VersionCompareResult]>( [
		[ '45.0.0', '44.0.0', 1 ],
		[ '44.0.0', '45.0.0', -1 ],
		[ '45.1.0', '45.0.0', 1 ],
		[ '45.0.0', '45.1.0', -1 ],
		[ '45.1.1', '45.1.0', 1 ],
		[ '45.1.0', '45.1.1', -1 ]
	] )( 'should properly compare installed %s version with %s', ( installedVersion, comparedVersion, result ) => {
		window.CKEDITOR_VERSION = installedVersion;

		expect( compareInstalledCKBaseVersion( comparedVersion ) ).to.be.equal( result );
	} );
} );
