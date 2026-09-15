/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { EDITOR_PRESETS } from '../presets.js';

/**
 * ```html
 * <ck-editor preset="base premium"></ck-editor>
 * <ck-editor shadow preset="base"></ck-editor>
 * ```
 */
export class CKEditorElement extends HTMLElement {
	private editor: any = null;

	private pending: Promise<void> | null = null;

	private container: HTMLElement | null = null;

	/**
	 * The node the editor is rendered into: this element, or its shadow root when the `shadow`
	 * attribute is set. Available as soon as the element is upgraded, before it is connected.
	 */
	public get root(): HTMLElement | ShadowRoot {
		if ( !this.hasAttribute( 'shadow' ) ) {
			return this;
		}

		return this.shadowRoot ?? this.attachShadow( { mode: 'open' } );
	}

	public connectedCallback(): void {
		this.pending ??= this.create();
	}

	public async disconnectedCallback(): Promise<void> {
		await this.pending?.catch( () => undefined );
		await this.editor?.destroy();

		this.container?.remove();

		this.editor = null;
		this.pending = null;
		this.container = null;
	}

	/**
	 * Builds the config out of the named presets and starts the editor.
	 */
	private async create(): Promise<void> {
		this.container = this.root.appendChild( document.createElement( 'div' ) );
		this.container.textContent = 'Loading the bundles from the CDN…';

		try {
			this.container.textContent = '';

			const scope = {
				...window.CKEDITOR,
				...window.CKEDITOR_PREMIUM_FEATURES
			};

			const { editor = 'ClassicEditor', plugins = [], ...config } = this.readPreset();

			this.editor = await resolve( scope, editor ).create( {
				...config,
				plugins: plugins.map( ( name: string ) => resolve( scope, name ) ),
				attachTo: this.container
			} );
		} catch ( error ) {
			this.container.textContent = `Failed to start the editor: ${ ( error as Error ).message }`;

			throw error;
		}
	}

	/**
	 * Merges the presets named in the `preset` attribute. Arrays are concatenated, everything else is
	 * overwritten by the later preset.
	 */
	private readPreset(): Record<string, any> {
		const names = ( this.getAttribute( 'preset' ) || 'base' ).split( /\s+/ ).filter( Boolean );

		return names.reduce<Record<string, any>>( ( result, name ) => {
			const preset = EDITOR_PRESETS[ name ];

			if ( !preset ) {
				throw new Error( `There is no "${ name }" editor preset.` );
			}

			for ( const [ key, value ] of Object.entries( preset ) ) {
				result[ key ] = Array.isArray( value ) ? [ ...result[ key ] || [], ...value ] : value;
			}

			return result;
		}, {} );
	}
}

/**
 * Looks a name up in the exports the bundles left on `window`.
 *
 * @param scope The exports to look in.
 * @param name The name to resolve.
 */
function resolve( scope: Record<string, any>, name: string ): any {
	if ( !scope[ name ] ) {
		throw new Error( `"${ name }" is missing from the loaded bundles.` );
	}

	return scope[ name ];
}
