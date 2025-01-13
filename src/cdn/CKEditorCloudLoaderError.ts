/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { BundleInstallationInfo } from '../installation-info/types.js';

/**
 * Base class for all CKEditor cloud loader errors.
 */
export class CKEditorCloudLoaderError<T extends CKEditorCloudLoaderErrorTag> extends Error {
	/**
	 * Error tag used for identifying the error type.
	 */
	public readonly tag: T;

	/**
	 * Additional context information about the error.
	 */
	public readonly context: CKEditorCloudLoaderErrorContext[T];

	/**
	 * Creates a new CKEditorCloudLoaderError instance.
	 *
	 * @param message The error message.
	 * @param tag Error tag.
	 * @param context Additional context information about the error.
	 */
	constructor( message: string, tag: T, context: CKEditorCloudLoaderErrorContext[T] ) {
		super( message );

		this.name = 'CKEditorCloudLoaderError';
		this.tag = tag;
		this.context = context;

		/**
		 * When extending built-in classes like Error in TypeScript/JavaScript, we need to manually fix the prototype chain.
		 * This is because the Error constructor resets the prototype chain when it's called, breaking inheritance.
		 * Without this line, instanceof checks would fail and custom properties would not be preserved in some environments.
		 *
		 * @see {@link https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work}
		 */
		Object.setPrototypeOf( this, CKEditorCloudLoaderError.prototype );
	}

	/**
	 * Prints a formatted error message to the console for debugging purposes.
	 * The output includes the error message, tag, and context information in a grouped format.
	 */
	public dump(): void {
		console.group(
			'%c🚨 CKEditor Cloud Loader Error',
			'background-color: #d93025; color: white; padding: 2px 5px; border-radius: 3px; font-size: 14px; font-weight: bold;'
		);

		console.error(
			'%cMessage: %c%s\n%cTag: %c%s\n%cContext: %c%s',
			'font-weight: bold', '', this.message,
			'font-weight: bold', '', this.tag,
			'font-weight: bold', '', JSON.stringify( this.context )
		);

		console.groupEnd();
	}
}

/**
 * Checks if the given error is an instance of CKEditorCloudLoaderError.
 *
 * @param error The error to check.
 * @returns True if the error is an instance of CKEditorCloudLoaderError, false otherwise.
 */
export function isCKEditorCloudLoaderError( error: unknown ): error is CKEditorCloudLoaderError<CKEditorCloudLoaderErrorTag> {
	return error instanceof CKEditorCloudLoaderError;
}

/**
 * Maps error tags to their context types.
 */
export type CKEditorCloudLoaderErrorContext = {
	'resource-load-error': {
		url: string;
		type: 'script' | 'stylesheet';
	};
	'version-not-supported': {
		currentVersion: string;
		minimumVersion: string;
	};
	'editor-already-loaded': BundleInstallationInfo<string>;
	'ckbox-already-loaded': BundleInstallationInfo<string>;
};

/**
 * Available error tags for CKEditor cloud loader errors.
 */
export type CKEditorCloudLoaderErrorTag = keyof CKEditorCloudLoaderErrorContext;
