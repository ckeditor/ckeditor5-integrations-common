/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/**
 * ```html
 * <demo-layout>…</demo-layout>
 * ```
 */
export class DemoLayoutElement extends HTMLElement {
	public connectedCallback(): void {
		Object.assign( this.style, {
			display: 'grid',
			gap: '1rem',
			alignContent: 'center',
			boxSizing: 'border-box',
			minHeight: '100vh',
			maxWidth: '900px',
			margin: '0 auto',
			padding: '2rem 1rem',
			fontFamily: 'system-ui, sans-serif'
		} );
	}
}
