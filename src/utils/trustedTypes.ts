/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * @module utils/dom/trustedtypes
 */

import { once } from './once.js';

/**
 * Creates instance of trusted types policy and returns `null` if it's not possible.
 */
const getTrustedPolicy = once( (): TrustedTypePolicyLike | null => {
	const trustedTypes = ( globalThis as { trustedTypes?: TrustedTypePolicyFactoryLike } ).trustedTypes;

	if ( !trustedTypes ) {
		return null;
	}

	try {
		return trustedTypes.createPolicy( 'ckeditor5-integrations', {
			createScriptURL: ( url: string ) => {
				const { protocol } = new URL( url, globalThis.document?.baseURI );

				if ( protocol !== 'https:' && protocol !== 'http:' ) {
					throw new TypeError( `CKEditor: refusing to load a script from "${ url }".` );
				}

				return url;
			}
		} );
	} catch { /* NOP */ }

	return null;
} );

/**
 * Signs provided url with provided policy. If no policy is provided (or it's null) then internal one will be used.
 */
export function toTrustedScriptURL( url: string, policy?: TrustedTypePolicyLike ): string {
	const resolvedPolicy = policy ?? getTrustedPolicy();

	return ( resolvedPolicy ? resolvedPolicy.createScriptURL( url ) : url ) as string;
}

type TrustedTypePolicyFactoryLike = {
	createPolicy: ( policyName: string, policyOptions: unknown ) => TrustedTypePolicyLike;
};

export type TrustedTypePolicyLike = {
	createScriptURL: ( input: string ) => unknown;
};
