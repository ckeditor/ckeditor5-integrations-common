/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { loadCKEditorCloud } from '@/cdn/loadCKEditorCloud.js';

import { defineDemoComponents, readCdnConfig, type CKEditorElement } from '../_internal/index.js';

defineDemoComponents();

main();

async function main(): Promise<void> {
	const layout = document.querySelector( 'demo-layout' )!;
	const { version, ckboxVersion, premium, ckbox } = readCdnConfig();

	const element = document.createElement( 'ck-editor' ) as CKEditorElement;

	element.toggleAttribute( 'shadow', true );
	element.setAttribute( 'preset', [ 'base', premium && 'premium', ckbox && 'ckbox' ].filter( Boolean ).join( ' ' ) );

	try {
		await loadCKEditorCloud( {
			version,
			premium,
			...ckbox && {
				ckbox: {
					version: ckboxVersion
				}
			},

			injectedStylesheetsLocation: {
				targetNode: element.root as ShadowRoot,
				placement: 'end'
			}
		} );

		layout.append( element );
	} catch ( error ) {
		layout.append( Object.assign( document.createElement( 'p' ), {
			textContent: `Failed to load the bundles: ${ ( error as Error ).message }`
		} ) );

		throw error;
	}
}
