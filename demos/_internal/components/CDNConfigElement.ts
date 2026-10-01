/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { CKVersion } from '@/utils/version/isCKVersion.js';
import type { CKBoxCdnVersion } from '@/cdn/ckbox/createCKBoxCdnUrl.js';

import { readCdnConfig, writeCdnConfig } from '../cdnConfig.js';

const STYLES = `
	fieldset { display: flex; flex-wrap: wrap; gap: 1em; align-items: center; border-radius: 6px; }
	input[type="text"] { width: 7em; }
`;

/**
 * ```html
 * <cdn-config></cdn-config>
 * ```
 */
export class CdnConfigElement extends HTMLElement {
	public connectedCallback(): void {
		const root = this.shadowRoot ?? this.attachShadow( { mode: 'open' } );
		const { version, ckboxVersion, premium, ckbox } = readCdnConfig();

		const fields = {
			version: createInput( 'text', 'version' ),
			ckboxVersion: createInput( 'text', 'ckboxVersion' ),
			premium: createInput( 'checkbox', 'premium' ),
			ckbox: createInput( 'checkbox', 'ckbox' )
		};

		fields.version.value = version;
		fields.ckboxVersion.value = ckboxVersion;
		fields.premium.checked = premium;
		fields.ckbox.checked = ckbox;

		const style = document.createElement( 'style' );
		const form = document.createElement( 'form' );
		const fieldset = document.createElement( 'fieldset' );
		const legend = document.createElement( 'legend' );
		const submit = document.createElement( 'button' );

		style.textContent = STYLES;
		legend.textContent = 'CDN';
		submit.type = 'submit';
		submit.textContent = 'Refresh';

		fieldset.append(
			legend,
			createLabel( 'Editor ', fields.version ),
			createLabel( 'CKBox ', fields.ckboxVersion ),
			createLabel( fields.premium, ' Premium' ),
			createLabel( fields.ckbox, ' CKBox' ),
			submit
		);

		form.append( fieldset );
		root.replaceChildren( style, form );

		form.addEventListener( 'submit', event => {
			event.preventDefault();

			writeCdnConfig( {
				version: fields.version.value as CKVersion,
				ckboxVersion: fields.ckboxVersion.value as CKBoxCdnVersion,
				premium: fields.premium.checked,
				ckbox: fields.ckbox.checked
			} );
		} );
	}
}

function createInput( type: string, name: string ): HTMLInputElement {
	return Object.assign( document.createElement( 'input' ), { type, name } );
}

function createLabel( ...children: Array<Node | string> ): HTMLLabelElement {
	const label = document.createElement( 'label' );

	label.append( ...children );

	return label;
}
