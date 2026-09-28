/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { injectScript, injectScriptsInParallel } from '@/utils/injectScript.js';
import { getTrustedPolicy } from '@/utils/getTrustedPolicy.js';
import { queryScript } from '@/utils/queryHeadElement.js';
import { createDefer } from '@/utils/defer.js';

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

		it( 'should sign the script URL with the provided trusted type policy', async () => {
			const trustedTypePolicy = {
				createScriptURL: vi.fn( ( url: string ) => url )
			};

			await injectScript( CDN_MOCK_SCRIPT_URL, { trustedTypePolicy } );

			expect( trustedTypePolicy.createScriptURL ).toHaveBeenCalledOnce();
			expect( trustedTypePolicy.createScriptURL ).toHaveBeenCalledWith( CDN_MOCK_SCRIPT_URL );
			expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).not.toBeNull();

			await waitForExecuteMockScript();
		} );

		it( 'should not create the internal policy if a custom one is provided', async () => {
			const createPolicy = vi.fn();

			vi.stubGlobal( 'trustedTypes', { createPolicy } );

			await injectScript( CDN_MOCK_SCRIPT_URL, {
				trustedTypePolicy: { createScriptURL: url => url }
			} );

			expect( createPolicy ).not.toHaveBeenCalled();
			await waitForExecuteMockScript();
		} );

		it( 'should use the internal policy if trusted types are available and no policy is provided', async () => {
			const createPolicy = vi.fn( ( _name: string, options: unknown ) => options );

			vi.stubGlobal( 'trustedTypes', { createPolicy } );

			await injectScript( CDN_MOCK_SCRIPT_URL );

			expect( createPolicy ).toHaveBeenCalledWith( 'ckeditor5-integrations', expect.any( Object ) );
			expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).not.toBeNull();

			await waitForExecuteMockScript();
		} );

		it( 'should inject the script with a plain URL if trusted types are not available', async () => {
			vi.stubGlobal( 'trustedTypes', undefined );

			await injectScript( CDN_MOCK_SCRIPT_URL );

			expect( queryScript( CDN_MOCK_SCRIPT_URL )?.src ).toBe( CDN_MOCK_SCRIPT_URL );
			await waitForExecuteMockScript();
		} );

		it( 'should refuse to inject a non-http(s) script when the internal policy is used', () => {
			const src = 'javascript:alert(1)';

			vi.stubGlobal( 'trustedTypes', {
				createPolicy: ( _name: string, options: unknown ) => options
			} );

			expect( () => injectScript( src ) ).toThrow( `CKEditor: refusing to load a script from "${ src }".` );
			expect( document.querySelector( `script[src="${ src }"]` ) ).toBeNull();
		} );

		it( 'should not append the script if the provided policy throws', () => {
			const error = new TypeError( 'Blocked by policy.' );
			const appendChildSpy = vi.spyOn( document.head, 'appendChild' );

			expect( () => injectScript( CDN_MOCK_SCRIPT_URL, {
				trustedTypePolicy: {
					createScriptURL: () => {
						throw error;
					}
				}
			} ) ).toThrow( error );

			expect( appendChildSpy ).not.toHaveBeenCalled();
			expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).toBeNull();
		} );

		it( 'should not call the policy again when the same script is injected twice', async () => {
			const trustedTypePolicy = {
				createScriptURL: vi.fn( ( url: string ) => url )
			};

			const promise1 = injectScript( CDN_MOCK_SCRIPT_URL, { trustedTypePolicy } );
			const promise2 = injectScript( CDN_MOCK_SCRIPT_URL, { trustedTypePolicy } );

			expect( promise1 ).toBe( promise2 );
			expect( trustedTypePolicy.createScriptURL ).toHaveBeenCalledOnce();

			await promise1;
			await waitForExecuteMockScript();
		} );

		it( 'should pass the policy to every script injected in parallel', async () => {
			const trustedTypePolicy = {
				createScriptURL: vi.fn( ( url: string ) => url )
			};

			const promise = injectScriptsInParallel( [ CDN_MOCK_SCRIPT_URL, BROKEN_SCRIPT_URL ], { trustedTypePolicy } );

			expect( trustedTypePolicy.createScriptURL ).toHaveBeenCalledTimes( 2 );
			expect( trustedTypePolicy.createScriptURL ).toHaveBeenCalledWith( CDN_MOCK_SCRIPT_URL );
			expect( trustedTypePolicy.createScriptURL ).toHaveBeenCalledWith( BROKEN_SCRIPT_URL );

			// Settle the broken script manually so the test does not depend on the network.
			document.querySelector( `script[src="${ BROKEN_SCRIPT_URL }"]` )!.dispatchEvent( new Event( 'error' ) );
			await expect( promise ).rejects.toBeInstanceOf( Event );

			await waitForExecuteMockScript();
		} );
	} );
} );

async function waitForExecuteMockScript() {
	await vi.waitFor( () => {
		expect( window.CKEDITOR ).toBeDefined();
	}, { timeout: 500 } );
}
