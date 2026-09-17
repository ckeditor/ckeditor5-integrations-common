/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { getLoadPromise, trackElementLoad } from './_internal/trackElementLoad.js';

/**
 * Injects a script into the document.
 *
 * Injecting the same `src` twice is a no-op – the promise of the first injection is returned. This
 * happens quite often in React Strict mode when the component is rendered twice.
 *
 * @param src The URL of the script to be injected.
 * @param props Additional properties used to decide how the script should be injected.
 * @param props.attributes Additional attributes to be set on the script element.
 * @returns A promise that resolves when the script is loaded.
 */
export function injectScript(
	src: string,
	{ attributes }: InjectScriptProps = {}
): Promise<void> {
	const prevScript = document.querySelector( `script[src="${ src }"]` );
	const prevPromise = getLoadPromise( prevScript );

	if ( prevPromise ) {
		return prevPromise;
	}

	if ( prevScript ) {
		console.warn( `Script with "${ src }" src is already present in DOM!` );
		prevScript.remove();
	}

	const script = document.createElement( 'script' );

	for ( const [ key, value ] of Object.entries( attributes || {} ) ) {
		script.setAttribute( key, value );
	}

	script.setAttribute( 'data-injected-by', 'ckeditor-integration' );

	script.type = 'text/javascript';
	script.async = true;

	const promise = trackElementLoad( script );

	script.src = src;
	document.head.appendChild( script );

	return promise;
}

/**
 * Props for the `injectScript` function.
 */
export type InjectScriptProps = {
	attributes?: Record<string, any>;
};

/**
 * Injects multiple scripts into the document in parallel.
 *
 * @param sources The URLs of the scripts to be injected.
 * @param props Additional properties used to decide how the script should be injected.
 * @returns A promise that resolves when all scripts are loaded.
 */
export async function injectScriptsInParallel( sources: Array<string>, props?: InjectScriptProps ): Promise<void> {
	await Promise.all(
		sources.map( src => injectScript( src, props ) )
	);
}
