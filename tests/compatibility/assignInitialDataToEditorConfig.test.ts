/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { assignInitialDataToEditorConfig } from '@/compatibility/assignInitialDataToEditorConfig.js';

describe( 'assignInitialDataToEditorConfig', () => {
	let consoleWarnSpy: any;

	beforeEach( () => {
		consoleWarnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );
	} );

	afterEach( () => {
		consoleWarnSpy.mockRestore();
		vi.unstubAllGlobals();
	} );

	describe( 'legacy path (CKEditor 47.x)', () => {
		beforeEach( () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '47.0.0' );
		} );

		it( 'should assign data to initialData field', () => {
			const result = assignInitialDataToEditorConfig( {}, 'hello' );

			expect( result ).toMatchObject( { initialData: 'hello' } );
		} );

		it( 'should preserve existing config fields', () => {
			const result = assignInitialDataToEditorConfig( { toolbar: [ 'bold' ] }, 'hello' );

			expect( result ).toMatchObject( { toolbar: [ 'bold' ], initialData: 'hello' } );
		} );

		it( 'should use config.initialData when data is empty', () => {
			const result = assignInitialDataToEditorConfig( { initialData: 'from config' }, '' );

			expect( result ).toMatchObject( { initialData: 'from config' } );
		} );

		it( 'should set initialData to empty string when neither data nor config.initialData is provided', () => {
			const result = assignInitialDataToEditorConfig( {}, '' );

			expect( result ).toMatchObject( { initialData: '' } );
		} );

		it( 'should warn when both data and config.initialData are provided', () => {
			assignInitialDataToEditorConfig( { initialData: 'from config' }, 'from prop' );

			expect( consoleWarnSpy ).toHaveBeenCalledWith(
				'Editor data should be provided either via the config ' +
				'(`config.initialData`) or the component\'s `data` ' +
				'property, but not both. The configuration value takes precedence.'
			);
		} );

		it( 'should prioritize config.initialData over data property when both are provided', () => {
			const result = assignInitialDataToEditorConfig( { initialData: 'from config' }, 'from prop' );

			expect( result ).toMatchObject( { initialData: 'from config' } );
		} );

		it( 'should override config.initialData with data property and not warn when `ignoreConfigInitialData` is true', () => {
			const result = assignInitialDataToEditorConfig( { initialData: 'from config' }, 'from prop', true );

			expect( result ).toMatchObject( { initialData: 'from prop' } );
			expect( consoleWarnSpy ).not.toHaveBeenCalled();
		} );

		it( 'should not add roots field to the result', () => {
			const result = assignInitialDataToEditorConfig( {}, 'hello' ) as any;

			expect( result.roots ).toBeUndefined();
		} );
	} );

	describe( 'roots-map path (CKEditor 48.x+)', () => {
		beforeEach( () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '48.0.0' );
		} );

		it( 'should assign data to roots.main.initialData', () => {
			const result = assignInitialDataToEditorConfig( {}, 'hello' ) as any;

			expect( result.roots?.main?.initialData ).toBe( 'hello' );
		} );

		it( 'should assign data if roots.main.initialData is blank string', () => {
			const result = assignInitialDataToEditorConfig( { initialData: '' }, 'hello' ) as any;

			expect( result.roots?.main?.initialData ).toBe( 'hello' );
		} );

		it( 'should preserve existing config.root properties under roots.main', () => {
			const result = assignInitialDataToEditorConfig(
				{ root: { someRootOption: true } },
				'hello'
			) as any;

			expect( result.roots.main ).toMatchObject( {
				someRootOption: true,
				initialData: 'hello'
			} );
		} );

		it( 'should merge with existing config.roots.main, with config taking precedence', () => {
			const result = assignInitialDataToEditorConfig(
				{ roots: { main: { initialData: 'old', someOption: 42 } } },
				'new'
			) as any;

			expect( result.roots.main ).toMatchObject( {
				someOption: 42,
				initialData: 'old'
			} );
		} );

		it( 'should merge with existing config.root, with config taking precedence', () => {
			const result = assignInitialDataToEditorConfig(
				{ root: { initialData: 'old', someRootOption: true } },
				'new'
			) as any;

			expect( result.roots.main ).toMatchObject( {
				someRootOption: true,
				initialData: 'old'
			} );
		} );

		it( 'should remove root and initialData top-level fields from the result', () => {
			const result = assignInitialDataToEditorConfig(
				{ root: { someRootOption: true }, initialData: 'ignored' },
				'hello'
			) as any;

			expect( result.root ).toBeUndefined();
			expect( result.initialData ).toBeUndefined();
		} );

		it( 'should preserve other top-level config fields', () => {
			const result = assignInitialDataToEditorConfig(
				{ toolbar: [ 'bold' ] },
				'hello'
			) as any;

			expect( result.toolbar ).toEqual( [ 'bold' ] );
		} );

		it( 'should warn when both data and config are provided for roots', () => {
			assignInitialDataToEditorConfig( { root: { initialData: 'from config' } }, 'from prop' );

			expect( consoleWarnSpy ).toHaveBeenCalledWith(
				'Editor data should be provided either via the config ' +
				'(`config.root.initialData`) or the component\'s `data` ' +
				'property, but not both. The configuration value takes precedence.'
			);
		} );

		it( 'should override config data with data property and not warn when `ignoreConfigInitialData` is true', () => {
			const result = assignInitialDataToEditorConfig(
				{ root: { initialData: 'from config' } },
				'from prop',
				true
			) as any;

			expect( result.roots.main.initialData ).toBe( 'from prop' );
			expect( consoleWarnSpy ).not.toHaveBeenCalled();
		} );

		it( 'should override legacy initialData field with data property when `ignoreConfigInitialData` is true', () => {
			const result = assignInitialDataToEditorConfig(
				{ initialData: 'from config' },
				'from prop',
				true
			) as any;

			expect( result.roots.main.initialData ).toBe( 'from prop' );
			expect( consoleWarnSpy ).not.toHaveBeenCalled();
		} );

		it( 'should preserve non-main roots', () => {
			const result = assignInitialDataToEditorConfig(
				{ roots: { secondary: { initialData: 'secondary data' } } },
				'hello'
			) as any;

			expect( result.roots.secondary ).toMatchObject( { initialData: 'secondary data' } );
		} );

		it( 'should set roots.main.initialData to empty string when neither data nor config initialData is provided', () => {
			const result = assignInitialDataToEditorConfig( {}, '' ) as any;

			expect( result.roots.main.initialData ).toBe( '' );
		} );
	} );
} );
