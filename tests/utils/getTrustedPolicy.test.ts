/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	getTrustedPolicy,
	toTrustedScriptURL,
	TrustedTypesPolicyCreationError,
	TRUSTED_TYPES_POLICY_NAME,
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

	it( 'should return null if creating the policy throws but trusted types are not enforced', () => {
		stubFailingTrustedTypes();

		expect( getTrustedPolicy() ).toBeNull();
	} );

	it( 'should throw TrustedTypesPolicyCreationError if creating the policy throws and trusted types are enforced', () => {
		const cause = stubFailingTrustedTypes();

		enforceTrustedTypes();

		expect( () => getTrustedPolicy() ).toThrow( TrustedTypesPolicyCreationError );
		expect( () => getTrustedPolicy() ).toThrow( expect.objectContaining( { cause } ) );
	} );

	it( 'should cache the creation error (no retries until reset)', () => {
		stubFailingTrustedTypes();
		enforceTrustedTypes();

		expect( () => getTrustedPolicy() ).toThrow( TrustedTypesPolicyCreationError );
		expect( () => getTrustedPolicy() ).toThrow( TrustedTypesPolicyCreationError );
		expect( ( globalThis as any ).trustedTypes.createPolicy ).toHaveBeenCalledOnce();
	} );

	it( 'should not check if trusted types are enforced when the policy is created', () => {
		stubTrustedTypes();
		const innerHTMLSetter = vi.spyOn( Element.prototype, 'innerHTML', 'set' );

		getTrustedPolicy();

		expect( innerHTMLSetter ).not.toHaveBeenCalled();
	} );

	it( 'should retry creating the policy after reset', () => {
		stubFailingTrustedTypes();
		enforceTrustedTypes();
		expect( () => getTrustedPolicy() ).toThrow( TrustedTypesPolicyCreationError );

		getTrustedPolicy.reset();
		stubTrustedTypes();

		expect( getTrustedPolicy() ).not.toBeNull();
	} );

	describe( 'createScriptURL', () => {
		let policy: TrustedTypePolicyLike;

		beforeEach( () => {
			stubTrustedTypes();
			policy = getTrustedPolicy()!;
		} );

		it.each( [
			'https://cdn.ckeditor.com/ckeditor5/latest/ckeditor5.umd.js',
			'http://localhost:8080/script.js',
			'/assets/script.js',
			'script.js',
			'//cdn.ckeditor.com/script.js',
			'data:text/javascript,void 0',
			'blob:https://example.com/0a1b2c3d'
		] )( 'should return "%s" unchanged', url => {
			expect( policy.createScriptURL( url ) ).toBe( url );
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

	it( 'should return the URL unchanged if the internal policy cannot be created but trusted types are not enforced', () => {
		stubFailingTrustedTypes();

		expect( toTrustedScriptURL( 'https://example.com/script.js' ) ).toBe( 'https://example.com/script.js' );
	} );

	it( 'should throw TrustedTypesPolicyCreationError if the internal policy cannot be created and trusted types are enforced', () => {
		stubFailingTrustedTypes();
		enforceTrustedTypes();

		expect( () => toTrustedScriptURL( 'https://example.com/script.js' ) ).toThrow( TrustedTypesPolicyCreationError );
	} );
} );

function stubTrustedTypes() {
	const createPolicy = vi.fn( ( _name: string, options: {
		createScriptURL: ( url: string ) => string;
	} ) => options );

	vi.stubGlobal( 'trustedTypes', { createPolicy } );

	return createPolicy;
}

function stubFailingTrustedTypes() {
	const error = new TypeError( `Policy "${ TRUSTED_TYPES_POLICY_NAME }" disallowed.` );

	vi.stubGlobal( 'trustedTypes', {
		createPolicy: vi.fn( () => {
			throw error;
		} )
	} );

	return error;
}

/**
 * Simulates a browser that enforces trusted types (`require-trusted-types-for 'script'`).
 */
function enforceTrustedTypes() {
	vi.spyOn( Element.prototype, 'innerHTML', 'set' ).mockImplementation( () => {
		throw new TypeError( 'This document requires \'TrustedHTML\' assignment.' );
	} );
}
