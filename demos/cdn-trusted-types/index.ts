/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { loadCKEditorCloud } from '@/cdn/loadCKEditorCloud.js';

import { defineDemoComponents, readCdnConfig } from '../_internal/index.js';

showTrustedTypesStatus();
watchViolations();
defineDemoComponents();

main();

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
 * Tells whether the CSP is actually enforced. Browsers without Trusted Types ignore it, so the demo proves nothing there.
 */
function showTrustedTypesStatus(): void {
	const status = document.getElementById( 'tt-status' )!;

	status.textContent = 'trustedTypes' in window ?
		'✅ Trusted Types are enforced. Only the "ckeditor5" and "ckeditor5-integrations" policies are allowed.' :
		'⚠️ This browser does not support Trusted Types – the CSP is ignored. Open the demo in Chromium.';
}

/**
 * Lists every Trusted Types violation on the page, so a missing signature is visible without opening the console.
 */
function watchViolations(): void {
	const details = document.getElementById( 'tt-violations' ) as HTMLDetailsElement;
	const counter = details.querySelector( 'strong' )!;
	const list = details.querySelector( 'ul' )!;

	document.addEventListener( 'securitypolicyviolation', event => {
		if ( !event.violatedDirective.includes( 'trusted-types' ) ) {
			return;
		}

		const item = document.createElement( 'li' );

		item.textContent = `${ event.violatedDirective }: ${ event.sample || '(no sample)' } – ${ event.sourceFile }:${ event.lineNumber }`;
		list.append( item );

		details.hidden = false;
		details.open = true;
		counter.textContent = String( list.childElementCount );
	} );
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
