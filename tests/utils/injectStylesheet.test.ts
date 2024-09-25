/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { injectStylesheet } from '@/utils/injectStylesheet.js';
import { preloadResource } from '@/utils/preloadResource.js';
import { createCKCdnUrl } from '@/cdn/ck/createCKCdnUrl.js';
import { queryStylesheet } from '@/utils/queryHeadElement.js';

import { removeAllCkCdnResources } from '@/test-utils/cdn/removeAllCkCdnResources.js';
import { CDN_MOCK_STYLESHEET_URL } from '@/test-utils/cdn/mocks.js';

describe( 'injectStylesheet', () => {
	beforeEach( () => {
		removeAllCkCdnResources();

		vi.spyOn( console, 'warn' ).mockImplementation( () => undefined );
		vi.spyOn( console, 'error' ).mockImplementation( () => undefined );
	} );

	afterEach( () => {
		vi.restoreAllMocks();
	} );

	it( 'should inject a stylesheet into the document', async () => {
		// Mock the document and stylesheet element
		const createElementSpy = vi.spyOn( document, 'createElement' );
		const insertBeforeSpy = vi.spyOn( document.head, 'insertBefore' );

		// Call the injectStylesheet function
		const firstHeadChild = document.head.firstChild;
		const promise = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL } );

		// Verify that the stylesheet element is created and appended to the document
		expect( createElementSpy ).toHaveBeenCalledWith( 'link' );
		expect( insertBeforeSpy ).toHaveBeenCalledWith(
			expect.any( HTMLLinkElement ),
			firstHeadChild
		);

		// Wait for the promise to resolve
		await expect( promise ).resolves.toBeUndefined();
	} );

	it( 'should return the same promise if the stylesheet is already injected', async () => {
		// Call the injectStylesheet function twice with the same source
		const promise1 = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL } );
		const promise2 = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL } );

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
		const promise = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL } );

		// Wait for the promise to resolve
		await expect( promise ).resolves.toBeUndefined();

		// Verify that the warning was shown
		expect( console.warn ).toHaveBeenCalledWith(
			`Stylesheet with "${ CDN_MOCK_STYLESHEET_URL }" href is already present in DOM!`
		);
	} );

	it( 'should inject the stylesheet at the end of the head if headPlacement = \'end\'', async () => {
		// Mock the document and stylesheet element
		const createElementSpy = vi.spyOn( document, 'createElement' );
		const appendChildSpy = vi.spyOn( document.head, 'appendChild' );

		// Call the injectStylesheet function with headPlacement = 'end'
		const promise = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, placementInHead: 'end' } );

		// Verify that the stylesheet element is created and appended to the document
		expect( createElementSpy ).toHaveBeenCalledWith( 'link' );
		expect( appendChildSpy ).toHaveBeenCalled();

		// Wait for the promise to resolve
		await expect( promise ).resolves.toBeUndefined();
	} );

	it( 'should inject the stylesheet at the start of the head if headPlacement = \'start\'', async () => {
		// Mock the document and stylesheet element
		const createElementSpy = vi.spyOn( document, 'createElement' );
		const insertBeforeSpy = vi.spyOn( document.head, 'insertBefore' );

		// Call the injectStylesheet function with headPlacement = 'start'
		const promise = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, placementInHead: 'start' } );

		// Verify that the stylesheet element is created and appended to the document
		expect( createElementSpy ).toHaveBeenCalledWith( 'link' );
		expect( insertBeforeSpy ).toHaveBeenCalled();

		// Wait for the promise to resolve
		await expect( promise ).resolves.toBeUndefined();
	} );

	it( 'should inject the stylesheet after previously injected stylesheets if headPlacement = \'start\'', async () => {
		// Manually inject the stylesheet into the document.
		const stylesheet1 = document.createElement( 'link' );
		stylesheet1.rel = 'stylesheet';
		stylesheet1.href = createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.0' );
		document.head.appendChild( stylesheet1 );

		// Call the injectStylesheet function with headPlacement = 'start'
		await injectStylesheet( {
			href: CDN_MOCK_STYLESHEET_URL,
			placementInHead: 'start'
		} );

		await injectStylesheet( {
			href: createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.1' ),
			placementInHead: 'start'
		} );

		// Verify that the stylesheet is injected after the previously injected stylesheet
		const injectedStylesheets = [ ...document.head.querySelectorAll( 'link[rel="stylesheet"]' ) ].map(
			link => link.getAttribute( 'href' )!
		);

		expect( injectedStylesheets ).toEqual( [
			CDN_MOCK_STYLESHEET_URL,
			createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.1' ),
			createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.0' )
		] );
	} );

	it( 'should inject the stylesheet after preload tags', async () => {
		preloadResource( CDN_MOCK_STYLESHEET_URL );

		await injectStylesheet( {
			href: CDN_MOCK_STYLESHEET_URL,
			placementInHead: 'start'
		} );

		const injectedLinks = [ ...document.head.querySelectorAll( 'link[rel="stylesheet"], link[rel="preload"]' ) ].map(
			link => [ link.getAttribute( 'rel' ), link.getAttribute( 'href' ) ]
		);

		expect( injectedLinks ).toEqual( [
			[ 'preload', CDN_MOCK_STYLESHEET_URL ],
			[ 'stylesheet', CDN_MOCK_STYLESHEET_URL ]
		] );
	} );

	it( 'should be possible to define custom attributes for the stylesheet element', async () => {
		await injectStylesheet( {
			href: CDN_MOCK_STYLESHEET_URL,
			attributes: {
				'data-custom-attribute': 'custom-value'
			}
		} );

		const element = queryStylesheet( CDN_MOCK_STYLESHEET_URL )?.getAttribute( 'data-custom-attribute' );

		expect( element ).toEqual( 'custom-value' );
	} );

	it( 'should not set crossorigin attribute by default', async () => {
		await injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL } );

		expect( queryStylesheet( CDN_MOCK_STYLESHEET_URL )?.hasAttribute( 'crossorigin' ) ).toEqual( false );
	} );

	it( 'should not crash if attributes object is null', async () => {
		await injectStylesheet( {
			href: CDN_MOCK_STYLESHEET_URL,
			attributes: null as any
		} );

		expect( queryStylesheet( CDN_MOCK_STYLESHEET_URL ) ).not.toBeNull();
	} );
} );
