/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import type { EditorConfig } from 'ckeditor5';

import { appendExtraPluginsToEditorConfig } from '@/plugins/appendExtraPluginsToEditorConfig.js';

describe( 'appendExtraPluginsToEditorConfig', () => {
	const ExistingPlugin = function() {};
	const Plugin1 = function() {};
	const Plugin2 = function() {};

	it( 'should append plugins to an empty editor configuration', () => {
		const config: EditorConfig = {};
		const plugins = [ Plugin1, Plugin2 ];

		const updatedConfig = appendExtraPluginsToEditorConfig( config, plugins );

		expect( updatedConfig.extraPlugins ).toEqual( plugins );
	} );

	it( 'should append plugins to an existing editor configuration', () => {
		const config: EditorConfig = {
			extraPlugins: [ ExistingPlugin ]
		};

		const plugins = [ Plugin1, Plugin2 ];

		const updatedConfig = appendExtraPluginsToEditorConfig( config, plugins );

		expect( updatedConfig.extraPlugins ).toEqual( [ ExistingPlugin, ...plugins ] );
	} );

	it( 'should handle an empty plugins array', () => {
		const config: EditorConfig = {
			extraPlugins: [ ExistingPlugin ]
		};

		const updatedConfig = appendExtraPluginsToEditorConfig( config, [] );

		expect( updatedConfig.extraPlugins ).toEqual( [ ExistingPlugin ] );
	} );

	it( 'should handle undefined plugins in the config', () => {
		const config: EditorConfig = {};
		const plugins = [ Plugin1 ];

		const updatedConfig = appendExtraPluginsToEditorConfig( config, plugins );

		expect( updatedConfig.extraPlugins ).toEqual( plugins );
	} );

	it( 'should not modify the original config object', () => {
		const config: EditorConfig = {
			extraPlugins: [ ExistingPlugin ]
		};

		const plugins = [ Plugin1 ];

		const updatedConfig = appendExtraPluginsToEditorConfig( config, plugins );

		expect( updatedConfig ).not.toBe( config );
		expect( config.extraPlugins ).toEqual( [ ExistingPlugin ] );
	} );

	it( 'should reject duplicate plugins', () => {
		const config: EditorConfig = {
			extraPlugins: [ ExistingPlugin ]
		};

		const plugins = [ ExistingPlugin ];
		const updatedConfig = appendExtraPluginsToEditorConfig( config, plugins );

		expect( updatedConfig.extraPlugins ).toEqual( [ ExistingPlugin ] );
	} );
} );
