/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { injectScript } from '@/utils/injectScript.js';
import { queryScript } from '@/utils/queryHeadElement.js';
import { createDefer } from '@/utils/defer.js';
import {
	getTrustedPolicy,
	TrustedTypesPolicyCreationError,
	TRUSTED_TYPES_POLICY_NAME,
	type TrustedTypePolicyLike
} from '@/utils/getTrustedPolicy.js';

import { CDN_MOCK_SCRIPT_URL } from '@/test-utils/cdn/mocks.js';
import { removeAllCkCdnResources } from '@/test-utils/cdn/removeAllCkCdnResources.js';

const BROKEN_SCRIPT_URL = 'https://localhost/broken-script.js';

describe( 'injectScript', () => {
	beforeEach( () => {
		vi.spyOn( console, 'warn' ).mockImplementation( () => undefined );
		vi.spyOn( console, 'error' ).mockImplementation( () => undefined );
	} );

	afterEach( () => {
		vi.restoreAllMocks();
		removeAllCkCdnResources();
	} );

	it( 'should inject a script into the document', async () => {
		// Mock the document and script element
		const createElementSpy = vi.spyOn( document, 'createElement' );
		const appendChildSpy = vi.spyOn( document.head, 'appendChild' );

		// Call the injectScript function
		const promise = injectScript( CDN_MOCK_SCRIPT_URL );

		// Verify that the script element is created and appended to the document
		expect( createElementSpy ).toHaveBeenCalledWith( 'script' );
		expect( appendChildSpy ).toHaveBeenCalledWith( expect.any( HTMLScriptElement ) );

		// Wait for the promise to resolve
		await expect( promise ).resolves.toBeUndefined();

		// Verify that the script was injected and then stop the test
		await waitForExecuteMockScript();
	} );

	it( 'should return the same promise if the script is already injected', async () => {
		// Call the injectScript function twice with the same source
		const promise1 = injectScript( CDN_MOCK_SCRIPT_URL );
		const promise2 = injectScript( CDN_MOCK_SCRIPT_URL );

		// Verify that the promises are the same
		expect( promise1 ).toBe( promise2 );

		// Wait for the promises to resolve
		await expect( promise1 ).resolves.toBeUndefined();
		await expect( promise2 ).resolves.toBeUndefined();

		// Verify that the script was injected and then stop the test
		await waitForExecuteMockScript();
	} );

	it( 'should show a warning if the script is already present in the document', async () => {
		// Manually inject the script into the document.
		const onLoadOriginalScript = createDefer();
		const script = document.createElement( 'script' );

		script.type = 'text/javascript';
		script.src = CDN_MOCK_SCRIPT_URL;
		script.onload = () => onLoadOriginalScript.resolve();

		document.head.appendChild( script );

		await onLoadOriginalScript.promise;
		await waitForExecuteMockScript();

		// The manually added script carries no load promise, so it is dropped and injected again.
		await expect( injectScript( CDN_MOCK_SCRIPT_URL ) ).resolves.toBeUndefined();

		expect( console.warn ).toHaveBeenCalledWith(
			`Script with "${ CDN_MOCK_SCRIPT_URL }" src is already present in DOM!`
		);

		// The original script is replaced rather than duplicated.
		expect( document.head.querySelectorAll( `script[src="${ CDN_MOCK_SCRIPT_URL }"]` ) ).toHaveLength( 1 );
		expect( script.isConnected ).toBe( false );
	} );

	it( 'should inject the script again if the previously injected one was removed', async () => {
		const promise1 = injectScript( CDN_MOCK_SCRIPT_URL );

		await promise1;
		await waitForExecuteMockScript();

		// Removing the element drops the cached promise along with it, synchronously.
		queryScript( CDN_MOCK_SCRIPT_URL )!.remove();

		const promise2 = injectScript( CDN_MOCK_SCRIPT_URL );

		expect( promise2 ).not.toBe( promise1 );
		await expect( promise2 ).resolves.toBeUndefined();

		expect( console.warn ).not.toHaveBeenCalled();
		expect( document.head.querySelectorAll( `script[src="${ CDN_MOCK_SCRIPT_URL }"]` ) ).toHaveLength( 1 );
	} );

	it( 'should not cache a failed injection, so the next call retries', async () => {
		const promise1 = injectScript( BROKEN_SCRIPT_URL );
		const firstScript = document.querySelector( `script[src="${ BROKEN_SCRIPT_URL }"]` )!;

		firstScript.dispatchEvent( new Event( 'error' ) );

		// The promise is rejected with the original `error` event, not with a synthetic `Error`.
		const reason = await promise1.catch( error => error );

		expect( reason ).toBeInstanceOf( Event );
		expect( reason.type ).toBe( 'error' );

		// The broken script is removed from the DOM, so nothing stale is left behind.
		expect( document.querySelector( `script[src="${ BROKEN_SCRIPT_URL }"]` ) ).toBeNull();

		const promise2 = injectScript( BROKEN_SCRIPT_URL );
		const secondScript = document.querySelector( `script[src="${ BROKEN_SCRIPT_URL }"]` )!;

		expect( promise2 ).not.toBe( promise1 );
		expect( secondScript ).not.toBe( firstScript );
		expect( console.warn ).not.toHaveBeenCalled();

		secondScript.dispatchEvent( new Event( 'error' ) );
		await expect( promise2 ).rejects.toBeInstanceOf( Event );
	} );

	it( 'should be possible to define custom attributes for the script element', async () => {
		await injectScript( CDN_MOCK_SCRIPT_URL, {
			attributes: {
				'data-custom-attribute': 'custom-value'
			}
		} );

		expect( queryScript( CDN_MOCK_SCRIPT_URL )?.getAttribute( 'data-custom-attribute' ) ).toBe( 'custom-value' );
		await waitForExecuteMockScript();
	} );

	it( 'should not set crossorigin attribute by default', async () => {
		await injectScript( CDN_MOCK_SCRIPT_URL );

		expect( queryScript( CDN_MOCK_SCRIPT_URL )?.hasAttribute( 'crossorigin' ) ).toBe( false );
		await waitForExecuteMockScript();
	} );

	it( 'should not crash if attributes object is null', async () => {
		await injectScript( CDN_MOCK_SCRIPT_URL, { attributes: null as any } );

		expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).not.toBeNull();
		await waitForExecuteMockScript();
	} );

	it( 'should mark the script as injected by the integration', async () => {
		await injectScript( CDN_MOCK_SCRIPT_URL );

		expect( queryScript( CDN_MOCK_SCRIPT_URL )?.getAttribute( 'data-injected-by' ) ).toBe( 'ckeditor-integration' );
		await waitForExecuteMockScript();
	} );

	describe( 'trusted types', () => {
		beforeEach( () => {
			getTrustedPolicy.reset();
		} );

		afterEach( () => {
			vi.unstubAllGlobals();
			getTrustedPolicy.reset();
		} );

		it( 'should sign the script URL with the internal policy', async () => {
			const createScriptURL = vi.fn( ( url: string ) => url );
			const createPolicy = stubTrustedTypes( { createScriptURL } );

			await injectScript( CDN_MOCK_SCRIPT_URL );

			expect( createPolicy ).toHaveBeenCalledWith( TRUSTED_TYPES_POLICY_NAME, expect.any( Object ) );
			expect( createScriptURL ).toHaveBeenCalledWith( CDN_MOCK_SCRIPT_URL );
			await waitForExecuteMockScript();
		} );

		it( 'should assign the value returned by the policy to the `src` property', async () => {
			const signed = createSignedURL( CDN_MOCK_SCRIPT_URL );
			const srcSetter = vi.spyOn( HTMLScriptElement.prototype, 'src', 'set' );

			stubTrustedTypes( { createScriptURL: () => signed } );

			await injectScript( CDN_MOCK_SCRIPT_URL );

			expect( srcSetter ).toHaveBeenCalledWith( signed );
			await waitForExecuteMockScript();
		} );

		it( 'should inject the script with a plain URL if the internal policy cannot ' +
				'be created but trusted types are not enforced', async () => {
			stubFailingTrustedTypes();

			await injectScript( CDN_MOCK_SCRIPT_URL );

			expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).not.toBeNull();
			await waitForExecuteMockScript();
		} );

		it( 'should throw TrustedTypesPolicyCreationError if the internal policy cannot be created ' +
				'and trusted types are enforced', () => {
			stubFailingTrustedTypes();
			vi.spyOn( Element.prototype, 'innerHTML', 'set' ).mockImplementation( () => {
				throw new TypeError( 'This document requires \'TrustedHTML\' assignment.' );
			} );

			expect( () => injectScript( CDN_MOCK_SCRIPT_URL ) ).toThrow( TrustedTypesPolicyCreationError );
			expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).toBeNull();
		} );

		it( 'should rethrow the error if the browser rejects the signed URL', () => {
			const srcError = new TypeError( 'Rejected.' );

			stubTrustedTypes( { createScriptURL: ( url: string ) => url } );
			rejectScriptSrc( srcError );

			expect( () => injectScript( CDN_MOCK_SCRIPT_URL ) ).toThrow( srcError );
			expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).toBeNull();
		} );
	} );
} );

async function waitForExecuteMockScript() {
	await vi.waitFor( () => {
		expect( window.CKEDITOR ).toBeDefined();
	}, { timeout: 500 } );
}

function stubTrustedTypes( policy: TrustedTypePolicyLike ) {
	const createPolicy = vi.fn( () => policy );

	vi.stubGlobal( 'trustedTypes', { createPolicy } );

	return createPolicy;
}

function stubFailingTrustedTypes() {
	const error = new TypeError( `Policy "${ TRUSTED_TYPES_POLICY_NAME }" disallowed.` );

	vi.stubGlobal( 'trustedTypes', {
		createPolicy: () => {
			throw error;
		}
	} );

	return error;
}

/**
 * Simulates a browser that enforces trusted types (`require-trusted-types-for 'script'`).
 */
function rejectScriptSrc( error: Error ) {
	vi.spyOn( HTMLScriptElement.prototype, 'src', 'set' ).mockImplementation( () => {
		throw error;
	} );
}

/**
 * Mimics a `TrustedScriptURL` - a distinct object that is stringified to the URL when assigned.
 */
function createSignedURL( url: string ) {
	return { toString: () => url } as unknown as string;
}
