/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { injectScript, INJECTED_SCRIPTS } from '@/utils/injectScript.js';
import { queryScript } from '@/utils/queryHeadElement.js';
import { createDefer } from '@/utils/defer.js';

import { CDN_MOCK_SCRIPT_URL } from '@/test-utils/cdn/mocks.js';
import { removeAllCkCdnResources } from '@/test-utils/cdn/removeAllCkCdnResources.js';

describe( 'injectScript', () => {
	beforeEach( () => {
		removeAllCkCdnResources();

		vi.spyOn( console, 'warn' ).mockImplementation( () => undefined );
		vi.spyOn( console, 'error' ).mockImplementation( () => undefined );
	} );

	afterEach( () => {
		vi.restoreAllMocks();
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

		// Spy on appendChild to make sure that the script is not appended again.
		const appendChildSpy = vi
			.spyOn( document.head, 'appendChild' )
			.mockImplementation( () => document.createElement( 'script' ) );

		injectScript( CDN_MOCK_SCRIPT_URL );

		// Verify that the warning was shown
		expect( console.warn ).toHaveBeenCalledWith(
			`Script with "${ CDN_MOCK_SCRIPT_URL }" src is already present in DOM!`
		);

		appendChildSpy.mockRestore();
		script.remove();
		INJECTED_SCRIPTS.clear();
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
} );

async function waitForExecuteMockScript() {
	await vi.waitFor( () => {
		expect( window.CKEDITOR ).toBeDefined();
	}, { timeout: 500 } );
}
