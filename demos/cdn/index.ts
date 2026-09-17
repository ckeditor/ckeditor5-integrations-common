/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { loadCKEditorCloud } from '@/cdn/loadCKEditorCloud.js';

import { defineDemoComponents, readCdnConfig } from '../_internal/index.js';

defineDemoComponents();

main();

/**
 * Loads the bundles selected in the query string, then mounts the editor. The element reads the
 * exports off `window`, so nothing from the loader has to be passed to it.
 */
async function main(): Promise<void> {
	const layout = document.querySelector( 'demo-layout' )!;
	const { version, ckboxVersion, premium, ckbox } = readCdnConfig();

	try {
		await loadCKEditorCloud( {
			version,
			premium,
			...ckbox && { ckbox: { version: ckboxVersion } }
		} );

		layout.append( createEditorElement( { premium, ckbox } ) );
	} catch ( error ) {
		layout.append( Object.assign( document.createElement( 'p' ), {
			textContent: `Failed to load the bundles: ${ ( error as Error ).message }`
		} ) );

		throw error;
	}
}

/**
 * Builds the editor element with the presets matching the loaded bundles.
 *
 * @param flags Which optional bundles were loaded.
 */
function createEditorElement( { premium, ckbox }: { premium: boolean; ckbox: boolean } ): HTMLElement {
	const element = document.createElement( 'ck-editor' );

	element.setAttribute( 'preset', [ 'base', premium && 'premium', ckbox && 'ckbox' ].filter( Boolean ).join( ' ' ) );

	return element;
}
