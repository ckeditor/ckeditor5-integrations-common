/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * Ensures that passed function will be executed only once.
 */
export function once<A extends Array<any>, R = void>( fn: ( ...args: A ) => R ): OnceFn<( ...args: A ) => R> {
	let outcome: OnceOutcome<R> | null = null;

	const wrappedFn = ( ...args: A ): R => {
		if ( !outcome ) {
			try {
				outcome = { value: fn( ...args ) };
			} catch ( error ) {
				outcome = { error };
			}
		}

		if ( 'error' in outcome ) {
			throw outcome.error;
		}

		return outcome.value;
	};

	wrappedFn.reset = () => {
		outcome = null;
	};

	return wrappedFn as unknown as OnceFn<typeof fn>;
}

type OnceOutcome<R> = { value: R } | { error: unknown };

type OnceFn<F extends Function> = F & {
	reset: () => void;
};
