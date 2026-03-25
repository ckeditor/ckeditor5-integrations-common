/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { beforeEach, it, describe, expect } from 'vitest';
import { removeAllCkCdnResources } from '@/src/test-utils/index.js';
import { getSupportedCKBaseFeatures } from '@/src/installation-info/getSupportedCKBaseFeatures.js';

describe( 'getCKBaseFeaturesInstallationInfo', () => {
	beforeEach( () => {
		removeAllCkCdnResources();
	} );

	it( 'should not crash if editor is not installed', () => {
		expect( getSupportedCKBaseFeatures() ).toMatchObject( {
			rootsConfigEntry: false,
			elementConfigAttachment: false
		} );
	} );

	describe( '`rootsMap` flag', () => {
		it( 'should be `false` on CKEditor <= 47', () => {
			window.CKEDITOR_VERSION = '47.0.0';
			expect( getSupportedCKBaseFeatures().rootsConfigEntry ).to.be.false;

			window.CKEDITOR_VERSION = '46.0.0';
			expect( getSupportedCKBaseFeatures().rootsConfigEntry ).to.be.false;
		} );

		it( 'should be `true` on CKEditor >= 48', () => {
			window.CKEDITOR_VERSION = '48.0.0';
			expect( getSupportedCKBaseFeatures().rootsConfigEntry ).to.be.true;

			window.CKEDITOR_VERSION = '49.0.0';
			expect( getSupportedCKBaseFeatures().rootsConfigEntry ).to.be.true;
		} );

		it( 'should be `true` on CKEditor nightly version', () => {
			window.CKEDITOR_VERSION = '0.0.0-nightly-20260324.0';
			expect( getSupportedCKBaseFeatures().rootsConfigEntry ).to.be.true;

			window.CKEDITOR_VERSION = '0.0.0-nightly-next-20260310.0';
			expect( getSupportedCKBaseFeatures().rootsConfigEntry ).to.be.true;
		} );
	} );

	describe( '`elementAttachment` flag', () => {
		it( 'should be `false` on CKEditor <= 47', () => {
			window.CKEDITOR_VERSION = '47.0.0';
			expect( getSupportedCKBaseFeatures().elementConfigAttachment ).to.be.false;

			window.CKEDITOR_VERSION = '46.0.0';
			expect( getSupportedCKBaseFeatures().elementConfigAttachment ).to.be.false;
		} );

		it( 'should be `true` on CKEditor >= 48', () => {
			window.CKEDITOR_VERSION = '48.0.0';
			expect( getSupportedCKBaseFeatures().elementConfigAttachment ).to.be.true;

			window.CKEDITOR_VERSION = '49.0.0';
			expect( getSupportedCKBaseFeatures().elementConfigAttachment ).to.be.true;
		} );

		it( 'should be `true` on CKEditor nightly version', () => {
			window.CKEDITOR_VERSION = '0.0.0-nightly-20260324.0';
			expect( getSupportedCKBaseFeatures().elementConfigAttachment ).to.be.true;

			window.CKEDITOR_VERSION = '0.0.0-nightly-next-20260310.0';
			expect( getSupportedCKBaseFeatures().elementConfigAttachment ).to.be.true;
		} );
	} );
} );
