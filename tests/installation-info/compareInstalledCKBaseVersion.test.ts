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

	it.each<[string, string, VersionCompareResult]>( [
		[ '45.0.0', '44.0.0', 1 ],
		[ '44.0.0', '45.0.0', -1 ],
		[ '45.1.0', '45.0.0', 1 ],
		[ '45.0.0', '45.1.0', -1 ],
		[ '45.1.1', '45.1.0', 1 ],
		[ '45.1.0', '45.1.1', -1 ],
		[ '47.7.0-alpha.2', '48.0.0', -1 ],
		[ '48.0.0', '47.7.0-alpha.2', 1 ],
		[ '47.7.0-alpha.2', '48.1.2-alpha.3', -1 ],
		[ '49.7.0-alpha.2', '48.1.2-alpha.3', 1 ],
		[ '0.0.0-internal-20260224.0', '48.0.0', 1 ],
		[ '48.0.0', '0.0.0-internal-20260224.0', -1 ],
		[ '0.0.0-nightly-20260224.0', '48.0.0', 1 ],
		[ '48.0.0', '0.0.0-nightly-20260224.0', -1 ]
	] )( 'should properly compare installed %s version with %s', ( installedVersion, comparedVersion, result ) => {
		window.CKEDITOR_VERSION = installedVersion;

		expect( compareInstalledCKBaseVersion( comparedVersion as SemanticVersion ) ).to.be.equal( result );
	} );
} );
