/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { once } from './once.js';

/**
 * Name of the Trusted Types policy created by the integrations.
 */
export const TRUSTED_TYPES_POLICY_NAME = 'ckeditor5-integrations';

/**
 * Thrown when the browser refuses to create the internal Trusted Types policy.
 */
export class TrustedTypesPolicyCreationError extends Error {
	public constructor( cause: unknown ) {
		super(
			`CKEditor: could not create the "${ TRUSTED_TYPES_POLICY_NAME }" Trusted Types policy, which is required ` +
			'to load scripts when Trusted Types are enforced. Add ' +
			`"${ TRUSTED_TYPES_POLICY_NAME }" to the "trusted-types" directive of your Content Security Policy. ` +
			'If more than one copy of this package is loaded, make sure only one is used, or add "\'allow-duplicates\'" ' +
			'to that directive.',
			{ cause }
		);

		this.name = 'TrustedTypesPolicyCreationError';
	}
}

/**
 * Checks if the application enforces trusted types (`require-trusted-types-for 'script'`). `window.trustedTypes`
 * exists in every Chromium browser regardless of that, so the only reliable check is assigning a plain string
 * to a sink. When enforced, the browser also logs a CSP violation for it, which is expected.
 */
const isTrustedTypesEnforced = once( (): boolean => {
	try {
		document.createElement( 'div' ).innerHTML = '';

		return false;
	} catch {
		return typeof global.document.createElement === 'function';
	}
} );

/**
 * Creates instance of trusted types policy and returns `null` if trusted types are not supported.
 */
export const getTrustedPolicy = once( (): TrustedTypePolicyLike | null => {
	const trustedTypes = ( globalThis as { trustedTypes?: TrustedTypePolicyFactoryLike } ).trustedTypes;

	if ( !trustedTypes ) {
		return null;
	}

	try {
		return trustedTypes.createPolicy( TRUSTED_TYPES_POLICY_NAME, {
			createScriptURL: ( url: string ) => url
		} );
	} catch ( error ) {
		// The CSP can limit policy names without enforcing trusted types. Plain strings still work then.
		if ( !isTrustedTypesEnforced() ) {
			return null;
		}

		throw new TrustedTypesPolicyCreationError( error );
	}
} );

/**
 * Signs the URL with the internal policy, or returns it unchanged if there is no policy.
 */
export function toTrustedScriptURL( url: string ): string {
	return ( getTrustedPolicy()?.createScriptURL( url ) ?? url ) as string;
}

type TrustedTypePolicyFactoryLike = {
	createPolicy: ( policyName: string, policyOptions: unknown ) => TrustedTypePolicyLike;
};

export type TrustedTypePolicyLike = {
	createScriptURL: ( input: string ) => unknown;
};
