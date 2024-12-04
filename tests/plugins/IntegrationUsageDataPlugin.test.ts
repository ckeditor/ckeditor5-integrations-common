/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, beforeEach, it, expect, vi } from 'vitest';
import type { Editor } from 'ckeditor5';

import { createIntegrationUsageDataPlugin } from '@/plugins/IntegrationUsageDataPlugin.js';

describe( 'createIntegrationUsageDataPlugin', () => {
	beforeEach( () => {
		window.CKEDITOR_VERSION = '';
	} );

	it( 'should create a plugin that collects usage data', () => {
		const integrationName = 'react';
		const usageData = {
			version: '1.0.0',
			frameworkVersion: '17.0.0'
		};

		const mockEditor = {
			on: vi.fn(),
			config: mockConfigForLicenseKey( 'some-key' )
		} as unknown as Editor;

		const plugin = createIntegrationUsageDataPlugin( integrationName, usageData );

		plugin( mockEditor );

		expect( mockEditor.on ).toHaveBeenCalledWith(
			'collectUsageData',
			expect.any( Function )
		);
	} );

	it( 'should not collect usage data when using a free CKEditor license V3', () => {
		mockEditorVersion( '44.0.0' );

		const integrationName = 'react';
		const usageData = {
			version: '1.0.0',
			frameworkVersion: '17.0.0'
		};

		const mockEditor = {
			config: mockConfigForLicenseKey( 'GPL' ),
			on: vi.fn()
		} as unknown as Editor;

		const plugin = createIntegrationUsageDataPlugin( integrationName, usageData );

		plugin( mockEditor );
		expect( mockEditor.on ).not.toHaveBeenCalled;
	} );

	it( 'should not collect usage data when using a free CKEditor license V2', () => {
		mockEditorVersion( '42.0.0' );

		const integrationName = 'react';
		const usageData = {
			version: '1.0.0',
			frameworkVersion: '17.0.0'
		};

		const mockEditor = {
			config: mockConfigForLicenseKey( undefined ),
			on: vi.fn()
		} as unknown as Editor;

		const plugin = createIntegrationUsageDataPlugin( integrationName, usageData );

		plugin( mockEditor );
		expect( mockEditor.on ).not.toHaveBeenCalled;
	} );

	it( 'should set usage data correctly when collectUsageData event is fired', () => {
		const integrationName = 'react';
		const usageData = {
			version: '1.0.0',
			frameworkVersion: '17.0.0'
		};

		const mockSetUsageData = vi.fn();
		const mockEditor = {
			config: mockConfigForLicenseKey( 'some-key' ),
			on: ( eventName: string, callback: Function ) => {
				if ( eventName === 'collectUsageData' ) {
					callback( null, { setUsageData: mockSetUsageData } );
				}
			}
		} as unknown as Editor;

		const plugin = createIntegrationUsageDataPlugin( integrationName, usageData );
		plugin( mockEditor );

		expect( mockSetUsageData ).toHaveBeenCalledWith(
			'integration.react',
			usageData
		);
	} );
} );

function mockConfigForLicenseKey( mockedKey: string | undefined ) {
	return {
		get: vi.fn( key => key === 'licenseKey' ? mockedKey : undefined )
	};
}

function mockEditorVersion( version: string ): void {
	window.CKEDITOR_VERSION = version;
}
