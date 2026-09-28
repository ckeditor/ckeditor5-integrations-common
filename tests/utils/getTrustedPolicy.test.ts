/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	getTrustedPolicy,
	toTrustedScriptURL,
	type TrustedTypePolicyLike
} from '@/utils/getTrustedPolicy.js';

describe( 'getTrustedPolicy', () => {
	beforeEach( () => {
		getTrustedPolicy.reset();
	} );

	afterEach( () => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
		getTrustedPolicy.reset();
	} );

	it( 'should return null if trusted types are not supported', () => {
		vi.stubGlobal( 'trustedTypes', undefined );

		expect( getTrustedPolicy() ).toBeNull();
	} );

	it( 'should create a policy named "ckeditor5-integrations"', () => {
		const createPolicy = stubTrustedTypes();
		const policy = getTrustedPolicy();

		expect( createPolicy ).toHaveBeenCalledOnce();
		expect( createPolicy ).toHaveBeenCalledWith( 'ckeditor5-integrations', {
			createScriptURL: expect.any( Function )
		} );
		expect( policy ).not.toBeNull();
	} );

	it( 'should create the policy only once and return the cached instance', () => {
		const createPolicy = stubTrustedTypes();

		const first = getTrustedPolicy();
		const second = getTrustedPolicy();

		expect( first ).toBe( second );
		expect( createPolicy ).toHaveBeenCalledOnce();
	} );

	it( 'should cache null as well (no retries after the first call)', () => {
		vi.stubGlobal( 'trustedTypes', undefined );
		expect( getTrustedPolicy() ).toBeNull();

		const createPolicy = stubTrustedTypes();

		expect( getTrustedPolicy() ).toBeNull();
		expect( createPolicy ).not.toHaveBeenCalled();
	} );

	it( 'should create a new policy after reset', () => {
		const createPolicy = stubTrustedTypes();

		getTrustedPolicy();
		getTrustedPolicy.reset();
		getTrustedPolicy();

		expect( createPolicy ).toHaveBeenCalledTimes( 2 );
	} );

	it( 'should return null if creating the policy throws (e.g. blocked by CSP)', () => {
		vi.stubGlobal( 'trustedTypes', {
			createPolicy: () => {
				throw new TypeError( 'Policy "ckeditor5-integrations" disallowed.' );
			}
		} );

		expect( getTrustedPolicy() ).toBeNull();
	} );

	describe( 'createScriptURL', () => {
		let policy: TrustedTypePolicyLike;

		beforeEach( () => {
			stubTrustedTypes();
			policy = getTrustedPolicy()!;
		} );

		it( 'should allow https URLs', () => {
			const url = 'https://cdn.ckeditor.com/ckeditor5/latest/ckeditor5.umd.js';

			expect( policy.createScriptURL( url ) ).toBe( url );
		} );

		it( 'should allow http URLs', () => {
			const url = 'http://localhost:8080/script.js';

			expect( policy.createScriptURL( url ) ).toBe( url );
		} );

		it( 'should allow relative URLs resolved against the document base URI', () => {
			expect( policy.createScriptURL( '/assets/script.js' ) ).toBe( '/assets/script.js' );
			expect( policy.createScriptURL( 'script.js' ) ).toBe( 'script.js' );
		} );

		it( 'should allow protocol-relative URLs', () => {
			expect( policy.createScriptURL( '//cdn.ckeditor.com/script.js' ) ).toBe( '//cdn.ckeditor.com/script.js' );
		} );

		it.each( [
			'javascript:alert(1)',
			'JavaScript:alert(1)',
			'data:text/javascript,alert(1)',
			'blob:https://example.com/0a1b2c3d',
			'file:///etc/passwd',
			'ftp://example.com/script.js'
		] )( 'should refuse "%s"', url => {
			expect( () => policy.createScriptURL( url ) ).toThrow( TypeError );
			expect( () => policy.createScriptURL( url ) ).toThrow( `CKEditor: refusing to load a script from "${ url }".` );
		} );
	} );
} );

describe( 'toTrustedScriptURL', () => {
	beforeEach( () => {
		getTrustedPolicy.reset();
	} );

	afterEach( () => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
		getTrustedPolicy.reset();
	} );

	it( 'should return the URL unchanged if there is no policy', () => {
		vi.stubGlobal( 'trustedTypes', undefined );

		expect( toTrustedScriptURL( 'https://example.com/script.js' ) ).toBe( 'https://example.com/script.js' );
	} );

	it( 'should sign the URL with the provided policy', () => {
		const policy = {
			createScriptURL: vi.fn( ( url: string ) => `signed:${ url }` )
		};

		expect( toTrustedScriptURL( 'https://example.com/script.js', policy ) ).toBe( 'signed:https://example.com/script.js' );
		expect( policy.createScriptURL ).toHaveBeenCalledWith( 'https://example.com/script.js' );
	} );

	it( 'should not create the internal policy if a custom one is provided', () => {
		const createPolicy = stubTrustedTypes();
		const policy = { createScriptURL: ( url: string ) => url };

		toTrustedScriptURL( 'https://example.com/script.js', policy );

		expect( createPolicy ).not.toHaveBeenCalled();
	} );

	it( 'should let the custom policy decide, bypassing the internal protocol check', () => {
		stubTrustedTypes();
		const policy = { createScriptURL: ( url: string ) => url };

		expect( toTrustedScriptURL( 'data:text/javascript,void 0', policy ) ).toBe( 'data:text/javascript,void 0' );
	} );

	it( 'should fall back to the internal policy if no policy is provided', () => {
		const createPolicy = stubTrustedTypes();

		expect( toTrustedScriptURL( 'https://example.com/script.js' ) ).toBe( 'https://example.com/script.js' );
		expect( createPolicy ).toHaveBeenCalledOnce();
	} );

	it( 'should throw for disallowed URLs when the internal policy is used', () => {
		stubTrustedTypes();

		expect( () => toTrustedScriptURL( 'javascript:alert(1)' ) ).toThrow( TypeError );
	} );
} );

function stubTrustedTypes() {
	const createPolicy = vi.fn( ( _name: string, options: {
		createScriptURL: ( url: string ) => string;
	} ) => options );

	vi.stubGlobal( 'trustedTypes', { createPolicy } );

	return createPolicy;
}
