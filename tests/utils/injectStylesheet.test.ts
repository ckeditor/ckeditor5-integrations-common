/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { injectStylesheet } from '@/utils/injectStylesheet.js';
import { preloadResource } from '@/utils/preloadResource.js';
import { createCKCdnUrl } from '@/cdn/ck/createCKCdnUrl.js';
import { queryStylesheet } from '@/utils/queryHeadElement.js';

import { removeAllCkCdnResources } from '@/test-utils/cdn/removeAllCkCdnResources.js';
import { CDN_MOCK_STYLESHEET_URL } from '@/test-utils/cdn/mocks.js';

const BROKEN_STYLESHEET_URL = 'https://localhost/broken-stylesheet.css';

describe( 'injectStylesheet', () => {
	beforeEach( () => {
		vi.spyOn( console, 'warn' ).mockImplementation( () => undefined );
		vi.spyOn( console, 'error' ).mockImplementation( () => undefined );
	} );

	afterEach( () => {
		vi.restoreAllMocks();
		removeAllCkCdnResources();
	} );

	it( 'should inject a stylesheet into the head by default', async () => {
		const createElementSpy = vi.spyOn( document, 'createElement' );
		const firstHeadChild = document.head.firstChild;

		const promise = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL } );

		// Verify that the stylesheet element is created and placed at the start of the head.
		expect( createElementSpy ).toHaveBeenCalledWith( 'link' );
		expect( document.head.firstChild ).toBeInstanceOf( HTMLLinkElement );
		expect( document.head.firstChild ).not.toBe( firstHeadChild );

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

		// The manually added link carries no load promise, so it is dropped and injected again.
		await expect( injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL } ) ).resolves.toBeUndefined();

		expect( console.warn ).toHaveBeenCalledWith(
			`Stylesheet with "${ CDN_MOCK_STYLESHEET_URL }" href is already present in DOM!`
		);

		expect( document.head.querySelectorAll( `link[href="${ CDN_MOCK_STYLESHEET_URL }"]` ) ).toHaveLength( 1 );
		expect( stylesheet.isConnected ).toBe( false );
	} );

	it( 'should inject the stylesheet again if the previously injected one was removed', async () => {
		const promise1 = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL } );

		await promise1;

		// Removing the element drops the cached promise along with it, synchronously.
		queryStylesheet( CDN_MOCK_STYLESHEET_URL )!.remove();

		const promise2 = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL } );

		expect( promise2 ).not.toBe( promise1 );
		await expect( promise2 ).resolves.toBeUndefined();

		expect( console.warn ).not.toHaveBeenCalled();
		expect( document.head.querySelectorAll( `link[href="${ CDN_MOCK_STYLESHEET_URL }"]` ) ).toHaveLength( 1 );
	} );

	it( 'should not cache a failed injection, so the next call retries', async () => {
		const promise1 = injectStylesheet( { href: BROKEN_STYLESHEET_URL } );
		const firstLink = document.querySelector( `link[href="${ BROKEN_STYLESHEET_URL }"]` )!;

		firstLink.dispatchEvent( new Event( 'error' ) );

		// The promise is rejected with the original `error` event, not with a synthetic `Error`.
		const reason = await promise1.catch( error => error );

		expect( reason ).toBeInstanceOf( Event );
		expect( reason.type ).toBe( 'error' );

		// The broken link is removed from the DOM, so nothing stale is left behind.
		expect( document.querySelector( `link[href="${ BROKEN_STYLESHEET_URL }"]` ) ).toBeNull();

		const promise2 = injectStylesheet( { href: BROKEN_STYLESHEET_URL } );
		const secondLink = document.querySelector( `link[href="${ BROKEN_STYLESHEET_URL }"]` )!;

		expect( promise2 ).not.toBe( promise1 );
		expect( secondLink ).not.toBe( firstLink );
		expect( console.warn ).not.toHaveBeenCalled();

		secondLink.dispatchEvent( new Event( 'error' ) );
		await expect( promise2 ).rejects.toBeInstanceOf( Event );
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

	describe( 'placement in the head', () => {
		it( 'should inject the stylesheet at the end of the head if placement = \'end\'', async () => {
			const appendChildSpy = vi.spyOn( document.head, 'appendChild' );

			const promise = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, placement: 'end' } );

			expect( appendChildSpy ).toHaveBeenCalledWith( expect.any( HTMLLinkElement ) );
			expect( document.head.lastChild ).toBeInstanceOf( HTMLLinkElement );

			await expect( promise ).resolves.toBeUndefined();
		} );

		it( 'should inject the stylesheet after previously injected stylesheets if placement = \'start\'', async () => {
			// Manually inject the stylesheet into the document.
			const stylesheet1 = document.createElement( 'link' );
			stylesheet1.rel = 'stylesheet';
			stylesheet1.href = createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.0' );
			document.head.appendChild( stylesheet1 );

			await injectStylesheet( {
				href: CDN_MOCK_STYLESHEET_URL,
				placement: 'start'
			} );

			await injectStylesheet( {
				href: createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.1' ),
				placement: 'start'
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
				placement: 'start'
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
			const promise1 = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, targetNode } );

			await promise1;

			targetNode.querySelector( 'link[rel="stylesheet"]' )!.remove();

			// The promise lives on the element, so removing it forgets the stylesheet immediately.
			const promise2 = injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, targetNode } );

			expect( promise2 ).not.toBe( promise1 );
			await expect( promise2 ).resolves.toBeUndefined();

			expect( targetNode.querySelectorAll( 'link[rel="stylesheet"]' ) ).toHaveLength( 1 );
			expect( console.warn ).not.toHaveBeenCalled();
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

		it( 'should ignore injected links nested deeper in the target node if placement = \'start\'', async () => {
			const wrapper = targetNode.appendChild( document.createElement( 'div' ) );

			await injectStylesheet( {
				href: createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.0' ),
				targetNode: wrapper
			} );

			await injectStylesheet( {
				href: CDN_MOCK_STYLESHEET_URL,
				targetNode,
				placement: 'start'
			} );

			expect( targetNode.firstChild ).toBeInstanceOf( HTMLLinkElement );
			expect( ( targetNode.firstChild as HTMLLinkElement ).href ).toBe( CDN_MOCK_STYLESHEET_URL );

			expect( targetNode.firstChild!.nextSibling ).toBe( wrapper );
			expect( wrapper.querySelectorAll( 'link' ) ).toHaveLength( 1 );
		} );

		it( 'should inject the stylesheet after previously injected ones inside the shadow root', async () => {
			const shadowRoot = targetNode.attachShadow( { mode: 'open' } );

			const stylesheet1 = document.createElement( 'link' );
			stylesheet1.rel = 'stylesheet';
			stylesheet1.href = createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.0' );
			shadowRoot.appendChild( stylesheet1 );

			await injectStylesheet( { href: CDN_MOCK_STYLESHEET_URL, targetNode: shadowRoot, placement: 'start' } );
			await injectStylesheet( {
				href: createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.1' ),
				targetNode: shadowRoot,
				placement: 'start'
			} );

			const injectedStylesheets = [ ...shadowRoot.querySelectorAll( 'link[rel="stylesheet"]' ) ].map(
				link => link.getAttribute( 'href' )!
			);

			expect( injectedStylesheets ).toEqual( [
				CDN_MOCK_STYLESHEET_URL,
				createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.1' ),
				createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.0' )
			] );
		} );
	} );
} );
