/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { assignInitialDataToMultirootEditorConfig } from '@/compatibility/assignInitialDataToMultirootEditorConfig.js';

describe( 'assignInitialDataToMultirootEditorConfig', () => {
	afterEach( () => {
		vi.unstubAllGlobals();
	} );

	describe( 'when roots map configuration is supported (>= 48.x)', () => {
		beforeEach( () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '48.0.0' );
		} );

		it( 'should assign data to roots[rootName].initialData', () => {
			const config = assignInitialDataToMultirootEditorConfig(
				{ intro: 'hello', outro: 'world' },
				{}
			);

			expect( config ).toEqual( {
				roots: {
					intro: { initialData: 'hello' },
					outro: { initialData: 'world' }
				}
			} );
		} );

		it( 'should fallback to empty string for roots without data', () => {
			const config = assignInitialDataToMultirootEditorConfig(
				{ intro: 'hello' },
				{
					roots: { intro: {}, outro: {} }
				}
			);

			expect( config ).toEqual( {
				roots: {
					intro: { initialData: 'hello' },
					outro: { initialData: '' }
				}
			} );
		} );

		it( 'should fallback to config.initialData if passed for roots without data', () => {
			const config = assignInitialDataToMultirootEditorConfig(
				{ intro: '' },
				{
					roots: { intro: {}, outro: {} },
					initialData: {
						intro: 'hello',
						outro: 'world'
					}
				}
			);

			expect( config ).toEqual( {
				roots: {
					intro: { initialData: 'hello' },
					outro: { initialData: 'world' }
				}
			} );
		} );

		it( 'should handle undefined data and fallback to empty string for all config roots', () => {
			const config = assignInitialDataToMultirootEditorConfig( undefined, {
				roots: { intro: {}, outro: {} }
			} );

			expect( config ).toEqual( {
				roots: {
					intro: { initialData: '' },
					outro: { initialData: '' }
				}
			} );
		} );

		it( 'should prefer config.roots[rootName].initialData over data and show a warning', () => {
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			const config = assignInitialDataToMultirootEditorConfig(
				{ intro: 'data-value' },
				{ roots: { intro: { initialData: 'config-value' } } }
			);

			expect( config ).toEqual( {
				roots: {
					intro: { initialData: 'config-value' }
				}
			} );

			expect( warnSpy ).toHaveBeenCalledOnce();
			expect( warnSpy ).toHaveBeenCalledWith(
				'Editor data should be provided either using `config.roots[\'intro\'].initialData` ' +
				'or the bound component property. The config value takes precedence ' +
				'over the bound component property and will be used when both are specified.'
			);
		} );

		it( 'should warn once per conflicting root, not once globally', () => {
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			assignInitialDataToMultirootEditorConfig(
				{ intro: 'a', outro: 'b' },
				{
					roots: {
						intro: { initialData: 'config-intro' },
						outro: { initialData: 'config-outro' }
					}
				}
			);

			expect( warnSpy ).toHaveBeenCalledTimes( 2 );
			expect( warnSpy ).toHaveBeenNthCalledWith( 1,
				'Editor data should be provided either using `config.roots[\'intro\'].initialData` ' +
				'or the bound component property. The config value takes precedence ' +
				'over the bound component property and will be used when both are specified.'
			);
			expect( warnSpy ).toHaveBeenNthCalledWith( 2,
				'Editor data should be provided either using `config.roots[\'outro\'].initialData` ' +
				'or the bound component property. The config value takes precedence ' +
				'over the bound component property and will be used when both are specified.'
			);
		} );

		it( 'should not warn when only data is provided (no conflict)', () => {
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			assignInitialDataToMultirootEditorConfig( { intro: 'hello' }, {} );

			expect( warnSpy ).not.toHaveBeenCalled();
		} );

		it( 'should not warn when only config.roots[rootName].initialData is provided (no conflict)', () => {
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			assignInitialDataToMultirootEditorConfig( undefined, {
				roots: { intro: { initialData: 'config-value' } }
			} );

			expect( warnSpy ).not.toHaveBeenCalled();
		} );

		it( 'should merge roots from data and config.roots', () => {
			const config = assignInitialDataToMultirootEditorConfig(
				{ intro: 'hello' },
				{ roots: { outro: {} } }
			) as any;

			expect( config.roots ).toHaveProperty( 'intro' );
			expect( config.roots ).toHaveProperty( 'outro' );
		} );

		it( 'should preserve existing config.roots properties alongside initialData', () => {
			const config = assignInitialDataToMultirootEditorConfig(
				{ intro: 'hello' },
				{ roots: { intro: { modelAttributes: { order: 1 } } } }
			);

			expect( config ).toEqual( {
				roots: {
					intro: { modelAttributes: { order: 1 }, initialData: 'hello' }
				}
			} );
		} );

		it( 'should preserve other top-level config properties', () => {
			const config = assignInitialDataToMultirootEditorConfig(
				{ intro: 'hello' },
				{ language: 'pl', roots: { intro: {} } }
			) as any;

			expect( config.language ).toBe( 'pl' );
		} );

		it( 'should return empty roots when both data and config are empty', () => {
			const config = assignInitialDataToMultirootEditorConfig( undefined, {} );

			expect( config ).toEqual( { roots: {} } );
		} );
	} );

	describe( 'when roots map configuration is not supported (<= 47.x)', () => {
		beforeEach( () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '47.0.0' );
		} );

		it( 'should assign data to initialData', () => {
			const data = { intro: 'hello', outro: 'world' };

			expect( assignInitialDataToMultirootEditorConfig( data, {} ) ).toEqual( {
				initialData: data
			} );
		} );

		it( 'should assign undefined to initialData when no data is provided', () => {
			expect( assignInitialDataToMultirootEditorConfig( undefined, {} ) ).toEqual( {
				initialData: undefined
			} );
		} );

		it( 'should prefer config.initialData over data and show a warning', () => {
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			const existingInitialData = { intro: 'config-data' };
			const config = assignInitialDataToMultirootEditorConfig(
				{ intro: 'data-value' },
				{ initialData: existingInitialData as any }
			);

			expect( config ).toEqual( {
				initialData: existingInitialData
			} );

			expect( warnSpy ).toHaveBeenCalledOnce();
			expect( warnSpy ).toHaveBeenCalledWith(
				'Editor data should be provided either using `config.initialData` ' +
				'or the bound component property. The config value takes precedence ' +
				'over the bound component property and will be used when both are specified.'
			);
		} );

		it( 'should not warn when only data is provided (no conflict)', () => {
			const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			assignInitialDataToMultirootEditorConfig( { intro: 'hello' }, {} );

			expect( warnSpy ).not.toHaveBeenCalled();
		} );

		it( 'should preserve other config properties alongside initialData', () => {
			const config = assignInitialDataToMultirootEditorConfig(
				{ intro: 'hello' },
				{ language: 'pl' }
			) as any;

			expect( config.language ).toBe( 'pl' );
			expect( config.initialData ).toEqual( { intro: 'hello' } );
		} );
	} );
} );
