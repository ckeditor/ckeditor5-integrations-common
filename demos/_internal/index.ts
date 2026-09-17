/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { CdnConfigElement } from './components/CDNConfigElement.js';
import { CKEditorElement } from './components/CKEditorElement.js';
import { DemoLayoutElement } from './components/DemoLayoutElement.js';

export { CKEditorElement, DemoLayoutElement };

export * from './cdnConfig.js';
export * from './presets.js';

/**
 * Registers the demo components. Safe to call more than once.
 */
export function defineDemoComponents(): void {
	const components = {
		'demo-layout': DemoLayoutElement,
		'cdn-config': CdnConfigElement,
		'ck-editor': CKEditorElement
	};

	for ( const [ name, constructor ] of Object.entries( components ) ) {
		if ( !customElements.get( name ) ) {
			customElements.define( name, constructor );
		}
	}
}
