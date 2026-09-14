/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { INJECTED_STYLESHEETS, injectStylesheet } from '@/utils/injectStylesheet.js';
import { preloadResource } from '@/utils/preloadResource.js';
import { createCKCdnUrl } from '@/cdn/ck/createCKCdnUrl.js';
import { queryStylesheet } from '@/utils/queryHeadElement.js';

import { removeAllCkCdnResources } from '@/test-utils/cdn/removeAllCkCdnResources.js';
import { CDN_MOCK_STYLESHEET_URL } from '@/test-utils/cdn/mocks.js';

describe( 'injectStylesheet', () => {
	beforeEach( () => {
		vi.spyOn( console, 'warn' ).mockImplementation( () => undefined );
		vi.spyOn( console, 'error' ).mockImplementation( () => undefined );
	} );

	afterEach( () => {
		vi.restoreAllMocks();
		removeAllCkCdnResources();
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

	describe( '`targetNode` and `placement`', () => {
		let targetNode: HTMLDivElement;
		let otherTargetNode: HTMLDivElement;

		beforeEach( () => {
			targetNode = document.body.appendChild( document.createElement( 'div' ) );
			otherTargetNode = document.body.appendChild( document.createElement( 'div' ) );
		} );

		afterEach( () => {
			targetNode.remove();
			otherTargetNode.remove();
		} );

		it( 'should inject the stylesheet into the target node instead of the head', async () => {
			await injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, targetNode } );

			expect( targetNode.querySelector( `link[href="${ CDN_MOCK_STYLESHEET_URL }"]` ) ).not.toBeNull();
			expect( queryStylesheet( CDN_MOCK_STYLESHEET_URL ) ).toBeNull();
		} );

		it( 'should inject the stylesheet at the start of the target node if placement = \'start\'', async () => {
			const otherChild = targetNode.appendChild( document.createElement( 'span' ) );

			await injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, targetNode, placement: 'start' } );

			expect( targetNode.firstChild ).toBeInstanceOf( HTMLLinkElement );
			expect( targetNode.lastChild ).toBe( otherChild );
		} );

		it( 'should inject the stylesheet at the end of the target node if placement = \'end\'', async () => {
			const otherChild = targetNode.appendChild( document.createElement( 'span' ) );

			await injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, targetNode, placement: 'end' } );

			expect( targetNode.firstChild ).toBe( otherChild );
			expect( targetNode.lastChild ).toBeInstanceOf( HTMLLinkElement );
		} );

		it( 'should inject the stylesheet after previously injected ones if placement = \'start\'', async () => {
			// Manually inject the stylesheet into the target node.
			const stylesheet1 = document.createElement( 'link' );
			stylesheet1.rel = 'stylesheet';
			stylesheet1.href = createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.0' );
			targetNode.appendChild( stylesheet1 );

			await injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, targetNode, placement: 'start' } );
			await injectStylesheet( {
				href: createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.1' ),
				targetNode,
				placement: 'start'
			} );

			const injectedStylesheets = [ ...targetNode.querySelectorAll( 'link[rel="stylesheet"]' ) ].map(
				link => link.getAttribute( 'href' )!
			);

			expect( injectedStylesheets ).toEqual( [
				CDN_MOCK_STYLESHEET_URL,
				createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.1' ),
				createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.0' )
			] );
		} );

		it( 'should inject the same stylesheet into every target node separately', async () => {
			const promise1 = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, targetNode } );
			const promise2 = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, targetNode: otherTargetNode } );

			expect( promise1 ).not.toBe( promise2 );

			await Promise.all( [ promise1, promise2 ] );

			for ( const node of [ targetNode, otherTargetNode ] ) {
				expect( node.querySelector( `link[href="${ CDN_MOCK_STYLESHEET_URL }"]` ) ).not.toBeNull();
			}

			expect( console.warn ).not.toHaveBeenCalled();
		} );

		it( 'should forget the stylesheet if the injected link is removed from the target node', async () => {
			await injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, targetNode } );

			expect( INJECTED_STYLESHEETS.get( targetNode )?.has( CDN_MOCK_STYLESHEET_URL ) ).toBe( true );

			targetNode.querySelector( 'link[rel="stylesheet"]' )!.remove();

			await vi.waitFor( () => {
				expect( INJECTED_STYLESHEETS.get( targetNode )?.has( CDN_MOCK_STYLESHEET_URL ) ).toBe( false );
			} );
		} );

		it( 'should inject the stylesheet into the shadow root', async () => {
			const shadowRoot = targetNode.attachShadow( { mode: 'open' } );

			await injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, targetNode: shadowRoot } );

			expect( shadowRoot.querySelector( `link[href="${ CDN_MOCK_STYLESHEET_URL }"]` ) ).not.toBeNull();
			expect( queryStylesheet( CDN_MOCK_STYLESHEET_URL ) ).toBeNull();
		} );

		it( 'should respect the placement inside the shadow root', async () => {
			const shadowRoot = targetNode.attachShadow( { mode: 'open' } );
			const otherChild = shadowRoot.appendChild( document.createElement( 'span' ) );

			await injectStylesheet( {
				href: CDN_MOCK_STYLESHEET_URL,
				targetNode: shadowRoot,
				placement: 'end'
			} );

			expect( shadowRoot.firstChild ).toBe( otherChild );
			expect( shadowRoot.lastChild ).toBeInstanceOf( HTMLLinkElement );
		} );

		it( 'should keep the stylesheet if the shadow root host is detached and attached again', async () => {
			const shadowRoot = targetNode.attachShadow( { mode: 'open' } );
			const promise1 = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, targetNode: shadowRoot } );

			await promise1;

			// Detach the host and attach it again. The link never leaves the shadow root,
			// so it should still be tracked and should not be duplicated.
			targetNode.remove();
			document.body.appendChild( targetNode );

			const promise2 = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, targetNode: shadowRoot } );

			expect( promise2 ).toBe( promise1 );
			expect( shadowRoot.querySelectorAll( 'link[rel="stylesheet"]' ) ).toHaveLength( 1 );
			expect( console.warn ).not.toHaveBeenCalled();
		} );
	} );

	describe( '`placementInHead` (deprecated)', () => {
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
	} );
} );
