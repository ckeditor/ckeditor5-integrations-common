/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, vi, expect, vitest, beforeEach, afterEach } from 'vitest';

import { loadCKCdnResourcesPack } from '@/cdn/utils/loadCKCdnResourcesPack.js';
import { createCKCdnUrl } from '@/cdn/ck/createCKCdnUrl.js';
import { getTrustedPolicy } from '@/utils/getTrustedPolicy.js';

import { queryAllInjectedScripts } from '@/utils/queryAllInjectedElements.js';
import {
	queryScript,
	queryStylesheet,
	queryPreload
} from '@/utils/queryHeadElement.js';

import { removeAllCkCdnResources } from '@/test-utils/index.js';
import {
	CDN_MOCK_SCRIPT_URL,
	CDN_MOCK_STYLESHEET_URL
} from '@/test-utils/cdn/mocks.js';

describe( 'loadCKCdnResourcesPack', () => {
	beforeEach( () => {
		removeAllCkCdnResources();

		vi.spyOn( console, 'error' ).mockImplementation( () => undefined );
	} );

	afterEach( () => {
		vi.restoreAllMocks();
	} );

	it( 'should return the exported global variables', async () => {
		const checkPluginLoaded = vitest.fn( () => ( {
			ClassicEditor: {
				version: '30.0.0'
			}
		} ) );

		const result = await loadCKCdnResourcesPack( {
			checkPluginLoaded
		} );

		expect( result ).toEqual( {
			ClassicEditor: {
				version: '30.0.0'
			}
		} );

		expect( checkPluginLoaded ).toHaveBeenCalled();
	} );

	it( 'should not inject any script if the pack does not contain any', async () => {
		const result = {
			ClassicEditor: {
				version: '30.0.0'
			}
		};

		const loaded = await loadCKCdnResourcesPack( {
			checkPluginLoaded: () => result
		} );

		expect( result ).toEqual( loaded );
	} );

	it( 'should execute beforeInject callback before injecting the resources', async () => {
		const beforeInject = vi.fn().mockImplementation( () => {
			expect( window.CKEDITOR ).toBeUndefined();
			expect( queryAllInjectedScripts() ).toHaveLength( 0 );
		} );

		await loadCKCdnResourcesPack( {
			scripts: [ CDN_MOCK_SCRIPT_URL ],
			beforeInject
		} );

		expect( beforeInject ).toHaveBeenCalled();
	} );

	it( 'should inject the script if the pack contains one', async () => {
		const loaded = await loadCKCdnResourcesPack( {
			scripts: [ CDN_MOCK_SCRIPT_URL ],
			checkPluginLoaded: () => window.CKEDITOR!
		} );

		expect( loaded ).toBeDefined();
		expect( loaded ).toEqual( window.CKEDITOR );
	} );

	it( 'should be possible to define pack using plain array of scripts and stylesheets', async () => {
		expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).toBeNull();
		expect( queryStylesheet( CDN_MOCK_STYLESHEET_URL ) ).toBeNull();

		await loadCKCdnResourcesPack( [
			CDN_MOCK_SCRIPT_URL,
			CDN_MOCK_STYLESHEET_URL
		] );

		expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).not.toBeNull();
		expect( queryStylesheet( CDN_MOCK_STYLESHEET_URL ) ).not.toBeNull();
	} );

	it( 'should be possible to define pack using plain async function', async () => {
		const pack = await loadCKCdnResourcesPack( async () => ( { a: 2 } ) );

		expect( pack ).toEqual( { a: 2 } );
	} );

	it( 'should use preload property instead default one if passed', async () => {
		const loaded = await loadCKCdnResourcesPack( {
			preload: [ CDN_MOCK_SCRIPT_URL ],
			checkPluginLoaded: () => ( {
				result: 2
			} )
		} );

		expect( loaded ).toBeDefined();
		expect( queryPreload( CDN_MOCK_SCRIPT_URL ) ).not.toBeNull();
	} );

	it( 'should automatically preload all resources if preload property is not defined', async () => {
		const loaded = await loadCKCdnResourcesPack( {
			scripts: [ CDN_MOCK_SCRIPT_URL ],
			stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
			checkPluginLoaded: () => ( {
				result: 2
			} )
		} );

		expect( loaded ).toBeDefined();

		for ( const link of [ CDN_MOCK_SCRIPT_URL, CDN_MOCK_STYLESHEET_URL ] ) {
			expect( queryPreload( link ) ).not.toBeNull();
		}
	} );

	it( 'should be possible to pass custom function as an script', async () => {
		const customFunction = vitest.fn( () => Promise.resolve() );

		await loadCKCdnResourcesPack( {
			scripts: [ customFunction ],
			checkPluginLoaded: () => ( {
				result: 2
			} )
		} );

		expect( customFunction ).toHaveBeenCalled();
	} );

	it( 'should inject the stylesheet at the start of the head', async () => {
		// Manually inject the stylesheet into the document.
		const stylesheet1 = document.createElement( 'link' );
		stylesheet1.rel = 'stylesheet';
		stylesheet1.href = createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.0' );
		document.head.appendChild( stylesheet1 );

		// Inject the stylesheet using the loadCKCdnResourcesPack function.
		await loadCKCdnResourcesPack( {
			stylesheets: [ CDN_MOCK_STYLESHEET_URL ]
		} );

		// Verify that the stylesheet are injected at the start of the head.
		const injectedStylesheets = [ ...document.head.querySelectorAll( 'link[rel="stylesheet"]' ) ].map(
			link => link.getAttribute( 'href' )!
		);

		expect( injectedStylesheets ).toEqual( [
			CDN_MOCK_STYLESHEET_URL,
			createCKCdnUrl( 'ckeditor5', 'ckeditor5.css', '42.0.0' )
		] );
	} );

	describe( '`stylesheetsLocation`', () => {
		let targetNode: HTMLDivElement;

		beforeEach( () => {
			targetNode = document.body.appendChild( document.createElement( 'div' ) );
		} );

		afterEach( () => {
			targetNode.remove();
		} );

		it( 'should inject the stylesheet into the target node instead of the head', async () => {
			await loadCKCdnResourcesPack( {
				stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
				stylesheetsLocation: { targetNode }
			} );

			expect( targetNode.querySelector( `link[href="${ CDN_MOCK_STYLESHEET_URL }"]` ) ).not.toBeNull();
			expect( queryStylesheet( CDN_MOCK_STYLESHEET_URL ) ).toBeNull();

			// Preload tags are always injected into the head.
			expect( queryPreload( CDN_MOCK_STYLESHEET_URL ) ).not.toBeNull();
		} );

		it( 'should inject the stylesheet at the start of the target node by default', async () => {
			const otherChild = targetNode.appendChild( document.createElement( 'span' ) );

			await loadCKCdnResourcesPack( {
				stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
				stylesheetsLocation: { targetNode }
			} );

			expect( targetNode.firstChild ).toBeInstanceOf( HTMLLinkElement );
			expect( targetNode.lastChild ).toBe( otherChild );
		} );

		it( 'should inject the stylesheet at the end of the target node if placement = \'end\'', async () => {
			const otherChild = targetNode.appendChild( document.createElement( 'span' ) );

			await loadCKCdnResourcesPack( {
				stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
				stylesheetsLocation: { targetNode, placement: 'end' }
			} );

			expect( targetNode.firstChild ).toBe( otherChild );
			expect( targetNode.lastChild ).toBeInstanceOf( HTMLLinkElement );
		} );

		it( 'should inject the stylesheet into the shadow root', async () => {
			const shadowRoot = targetNode.attachShadow( { mode: 'open' } );

			await loadCKCdnResourcesPack( {
				stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
				stylesheetsLocation: { targetNode: shadowRoot }
			} );

			expect( shadowRoot.querySelector( `link[href="${ CDN_MOCK_STYLESHEET_URL }"]` ) ).not.toBeNull();
			expect( queryStylesheet( CDN_MOCK_STYLESHEET_URL ) ).toBeNull();
		} );

		it( 'should inject the script into the head even if the stylesheets are injected elsewhere', async () => {
			await loadCKCdnResourcesPack( {
				scripts: [ CDN_MOCK_SCRIPT_URL ],
				stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
				stylesheetsLocation: { targetNode }
			} );

			expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).not.toBeNull();
			expect( targetNode.querySelector( 'script' ) ).toBeNull();
		} );

		describe( 'disconnected target node', () => {
			let detachedNode: HTMLDivElement;

			beforeEach( () => {
				detachedNode = document.createElement( 'div' );
			} );

			it( 'should not wait for the stylesheets if the target node is not connected', async () => {
				await loadCKCdnResourcesPack( {
					stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
					stylesheetsLocation: { targetNode: detachedNode }
				} );

				expect( detachedNode.querySelector( `link[href="${ CDN_MOCK_STYLESHEET_URL }"]` ) ).not.toBeNull();
			} );

			it( 'should not wait for the stylesheets injected into the shadow root of a detached host', async () => {
				const shadowRoot = detachedNode.attachShadow( { mode: 'open' } );

				await loadCKCdnResourcesPack( {
					stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
					stylesheetsLocation: { targetNode: shadowRoot }
				} );

				expect( shadowRoot.querySelector( `link[href="${ CDN_MOCK_STYLESHEET_URL }"]` ) ).not.toBeNull();
			} );

			it( 'should still load the scripts if the target node is not connected', async () => {
				const loaded = await loadCKCdnResourcesPack( {
					scripts: [ CDN_MOCK_SCRIPT_URL ],
					stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
					stylesheetsLocation: { targetNode: detachedNode },
					checkPluginLoaded: () => window.CKEDITOR!
				} );

				expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).not.toBeNull();
				expect( loaded ).toEqual( window.CKEDITOR );
			} );

			it( 'should report a stylesheet failure even though nothing waits for it', async () => {
				await loadCKCdnResourcesPack( {
					stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
					stylesheetsLocation: { targetNode: detachedNode }
				} );

				detachedNode.querySelector( 'link' )!.dispatchEvent( new Event( 'error' ) );

				await vi.waitFor( () => {
					expect( console.error ).toHaveBeenCalled();
				} );
			} );

			it( 'should wait for the stylesheets once the target node is connected', async () => {
				document.body.appendChild( detachedNode );

				await loadCKCdnResourcesPack( {
					stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
					stylesheetsLocation: { targetNode: detachedNode }
				} );

				expect( detachedNode.querySelector( `link[href="${ CDN_MOCK_STYLESHEET_URL }"]` ) ).not.toBeNull();
				expect( console.error ).not.toHaveBeenCalled();

				detachedNode.remove();
			} );
		} );
	} );

	describe( '`trustedTypePolicy`', () => {
		beforeEach( () => {
			getTrustedPolicy.reset();
		} );

		afterEach( () => {
			vi.unstubAllGlobals();
			getTrustedPolicy.reset();
		} );

		function createPolicy() {
			return {
				createScriptURL: vi.fn( ( url: string ) => url )
			};
		}

		it( 'should sign the script URL with the provided policy', async () => {
			const trustedTypePolicy = createPolicy();

			const loaded = await loadCKCdnResourcesPack( {
				scripts: [ CDN_MOCK_SCRIPT_URL ],
				trustedTypePolicy,
				checkPluginLoaded: () => window.CKEDITOR!
			} );

			expect( trustedTypePolicy.createScriptURL ).toHaveBeenCalledOnce();
			expect( trustedTypePolicy.createScriptURL ).toHaveBeenCalledWith( CDN_MOCK_SCRIPT_URL );
			expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).not.toBeNull();
			expect( loaded ).toEqual( window.CKEDITOR );
		} );

		it( 'should sign duplicated scripts only once', async () => {
			const trustedTypePolicy = createPolicy();

			await loadCKCdnResourcesPack( {
				scripts: [ CDN_MOCK_SCRIPT_URL, CDN_MOCK_SCRIPT_URL ],
				trustedTypePolicy
			} );

			expect( trustedTypePolicy.createScriptURL ).toHaveBeenCalledOnce();
		} );

		it( 'should not use the policy for stylesheets', async () => {
			const trustedTypePolicy = createPolicy();

			await loadCKCdnResourcesPack( {
				stylesheets: [ CDN_MOCK_STYLESHEET_URL ],
				trustedTypePolicy
			} );

			expect( trustedTypePolicy.createScriptURL ).not.toHaveBeenCalled();
			expect( queryStylesheet( CDN_MOCK_STYLESHEET_URL ) ).not.toBeNull();
		} );

		it( 'should pass the policy and html attributes to the custom script injector', async () => {
			const trustedTypePolicy = createPolicy();
			const htmlAttributes = { nonce: 'abc123' };
			const customInjector = vi.fn( () => Promise.resolve() );

			await loadCKCdnResourcesPack( {
				scripts: [ customInjector ],
				htmlAttributes,
				trustedTypePolicy
			} );

			expect( customInjector ).toHaveBeenCalledWith( {
				attributes: htmlAttributes,
				trustedTypePolicy
			} );
		} );

		it( 'should pass undefined policy to the custom script injector if none is provided', async () => {
			const customInjector = vi.fn( () => Promise.resolve() );

			await loadCKCdnResourcesPack( {
				scripts: [ customInjector ]
			} );

			expect( customInjector ).toHaveBeenCalledWith( expect.objectContaining( {
				trustedTypePolicy: undefined
			} ) );
		} );

		it( 'should use the internal policy if trusted types are available and no policy is provided', async () => {
			const createPolicySpy = vi.fn( ( _name: string, options: unknown ) => options );

			vi.stubGlobal( 'trustedTypes', { createPolicy: createPolicySpy } );

			await loadCKCdnResourcesPack( {
				scripts: [ CDN_MOCK_SCRIPT_URL ]
			} );

			expect( createPolicySpy ).toHaveBeenCalledWith( 'ckeditor5-integrations', expect.any( Object ) );
			expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).not.toBeNull();
		} );

		it( 'should reject and skip `checkPluginLoaded` if the internal policy refuses the script', async () => {
			const src = 'javascript:alert(1)';
			const checkPluginLoaded = vi.fn();

			vi.stubGlobal( 'trustedTypes', {
				createPolicy: ( _name: string, options: unknown ) => options
			} );

			await expect( loadCKCdnResourcesPack( {
				scripts: [ src ],
				checkPluginLoaded
			} ) ).rejects.toThrow( `CKEditor: refusing to load a script from "${ src }".` );

			expect( checkPluginLoaded ).not.toHaveBeenCalled();
			expect( document.querySelector( `script[src="${ src }"]` ) ).toBeNull();
		} );

		it( 'should reject and stop loading next scripts if the provided policy throws', async () => {
			const error = new TypeError( 'Blocked by policy.' );
			const nextInjector = vi.fn( () => Promise.resolve() );
			const checkPluginLoaded = vi.fn();

			await expect( loadCKCdnResourcesPack( {
				scripts: [ CDN_MOCK_SCRIPT_URL, nextInjector ],
				trustedTypePolicy: {
					createScriptURL: () => {
						throw error;
					}
				},
				checkPluginLoaded
			} ) ).rejects.toBe( error );

			expect( queryScript( CDN_MOCK_SCRIPT_URL ) ).toBeNull();
			expect( nextInjector ).not.toHaveBeenCalled();
			expect( checkPluginLoaded ).not.toHaveBeenCalled();
		} );
	} );
} );
