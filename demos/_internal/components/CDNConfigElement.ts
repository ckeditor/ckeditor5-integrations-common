/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { CKVersion } from '@/utils/version/isCKVersion.js';
import type { CKBoxCdnVersion } from '@/cdn/ckbox/createCKBoxCdnUrl.js';

import { readCdnConfig, writeCdnConfig } from '../cdnConfig.js';

/**
 * ```html
 * <cdn-config></cdn-config>
 * ```
 */
export class CdnConfigElement extends HTMLElement {
	public connectedCallback(): void {
		const root = this.shadowRoot ?? this.attachShadow( { mode: 'open' } );
		const { version, ckboxVersion, premium, ckbox } = readCdnConfig();

		root.innerHTML = `
			<style>
				fieldset { display: flex; flex-wrap: wrap; gap: 1em; align-items: center; border-radius: 6px; }
				input[type="text"] { width: 7em; }
			</style>
			<form>
				<fieldset>
					<legend>CDN</legend>
					<label>Editor <input type="text" name="version"></label>
					<label>CKBox <input type="text" name="ckboxVersion"></label>
					<label><input type="checkbox" name="premium"> Premium</label>
					<label><input type="checkbox" name="ckbox"> CKBox</label>
					<button type="submit">Refresh</button>
				</fieldset>
			</form>
		`;

		const field = ( name: string ) => root.querySelector<HTMLInputElement>( `[name="${ name }"]` )!;

		field( 'version' ).value = version;
		field( 'ckboxVersion' ).value = ckboxVersion;
		field( 'premium' ).checked = premium;
		field( 'ckbox' ).checked = ckbox;

		root.querySelector( 'form' )!.addEventListener( 'submit', event => {
			event.preventDefault();

			writeCdnConfig( {
				version: field( 'version' ).value as CKVersion,
				ckboxVersion: field( 'ckboxVersion' ).value as CKBoxCdnVersion,
				premium: field( 'premium' ).checked,
				ckbox: field( 'ckbox' ).checked
			} );
		} );
	}
}
