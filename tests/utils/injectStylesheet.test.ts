/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CDN_MOCK_STYLESHEET_URL, removeCkCdnLinks } from 'tests/_utils/ckCdnMocks';
import { injectStylesheet } from '@/utils/injectStylesheet';

describe( 'injectStylesheet', () => {
	beforeEach( () => {
		removeCkCdnLinks();

		vi.spyOn( console, 'warn' ).mockImplementation( () => undefined );
		vi.spyOn( console, 'error' ).mockImplementation( () => undefined );
	} );

	afterEach( () => {
		vi.restoreAllMocks();
	} );

	it( 'should inject a stylesheet into the document', async () => {
		// Mock the document and stylesheet element
		const createElementSpy = vi.spyOn( document, 'createElement' );
		const appendChildSpy = vi.spyOn( document.head, 'appendChild' );

		// Call the injectStylesheet function
		const promise = injectStylesheet( CDN_MOCK_STYLESHEET_URL );

		// Verify that the stylesheet element is created and appended to the document
		expect( createElementSpy ).toHaveBeenCalledWith( 'link' );
		expect( appendChildSpy ).toHaveBeenCalledWith( expect.any( HTMLLinkElement ) );

		// Wait for the promise to resolve
		await expect( promise ).resolves.toBeUndefined();
	} );

	it( 'should return the same promise if the stylesheet is already injected', async () => {
		// Call the injectStylesheet function twice with the same source
		const promise1 = injectStylesheet( CDN_MOCK_STYLESHEET_URL );
		const promise2 = injectStylesheet( CDN_MOCK_STYLESHEET_URL );

		// Verify that the promises are the same
		expect( promise1 ).toBe( promise2 );

		// Wait for the promises to resolve
		await expect( promise1 ).resolves.toBeUndefined();
		await expect( promise2 ).resolves.toBeUndefined();
	} );

	it( 'should show a warning if the stylesheet is already present in the document', async () => {
		// Manually inject the stylesheet into the document.
		const stylesheet = document.createElement( 'link' );
		stylesheet.rel = 'stylesheet';
		stylesheet.href = CDN_MOCK_STYLESHEET_URL;

		document.head.appendChild( stylesheet );

		// Call the injectStylesheet function
		const promise = injectStylesheet( CDN_MOCK_STYLESHEET_URL );

		// Wait for the promise to resolve
		await expect( promise ).resolves.toBeUndefined();

		// Verify that the warning was shown
		expect( console.warn ).toHaveBeenCalledWith(
			`Stylesheet with "${ CDN_MOCK_STYLESHEET_URL }" href is already present in DOM!`
		);
	} );
} );
