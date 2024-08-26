/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, expect, it, beforeEach } from 'vitest';
import { preloadResource } from '@/utils/preloadResource';
import {
	CDN_MOCK_SCRIPT_URL,
	CDN_MOCK_STYLESHEET_URL
} from 'tests/_utils/ckCdnMocks';

describe( 'preloadResource', () => {
	beforeEach( () => {
		// Reset the document head before each test
		document.head.innerHTML = '';
	} );

	it( 'should append a link element to the head with the correct attributes', () => {
		preloadResource( CDN_MOCK_STYLESHEET_URL );

		const linkElement = document.head.querySelector( `link[href="${ CDN_MOCK_STYLESHEET_URL }"][rel="preload"]` );

		expect( linkElement ).toBeTruthy();
		expect( linkElement!.getAttribute( 'data-injected-by' ) ).toBe( 'ckeditor-integration' );
		expect( linkElement!.getAttribute( 'as' ) ).toBe( 'style' );
		expect( linkElement!.getAttribute( 'href' ) ).toBe( CDN_MOCK_STYLESHEET_URL );
	} );

	it( 'should not append a link element if the resource is already preloaded', () => {
		// Simulate an existing link element with the same URL and rel="preload"
		const existingLink = document.createElement( 'link' );
		existingLink.href = CDN_MOCK_SCRIPT_URL;
		existingLink.rel = 'preload';
		document.head.appendChild( existingLink );

		preloadResource( CDN_MOCK_SCRIPT_URL );

		const linkElements = document.head.querySelectorAll( `link[href="${ CDN_MOCK_SCRIPT_URL }"][rel="preload"]` );

		expect( linkElements.length ).toBe( 1 );
	} );

	it( 'should assign the correct "as" attribute based on the resource type', () => {
		const url = CDN_MOCK_SCRIPT_URL.replace( '.js', '.txt' );

		preloadResource( url );

		const otherLinkElement = document.head.querySelector( `link[href="${ url }"][rel="preload"]` );

		expect( otherLinkElement!.getAttribute( 'as' ) ).toBe( 'fetch' );
	} );
} );
