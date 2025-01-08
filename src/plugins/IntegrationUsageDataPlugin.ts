/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { Editor, PluginConstructor } from 'ckeditor5';
import { isCKEditorFreeLicense } from '../license/isCKEditorFreeLicense.js';

/**
 * Creates a plugin that collects usage data for a specific integration.
 *
 * This part of the code is not executed in open-source implementations using a GPL key.
 * It only runs when a specific license key is provided. If you are uncertain whether
 * this applies to your installation, please contact our support team.
 *
 * @param integrationName The name of the integration.
 * @param usageData The usage data for the integration.
 * @returns The plugin that collects the usage data.
 * @example
 * ```ts
 * import { createUsageDataPlugin } from './usage-data.plugin';
 *
 * const integrationUsageDataPlugin = createUsageDataPlugin( 'react', {
 * 	version: '1.0.0',
 * 	frameworkVersion: '17.0.0'
 * } );
 *
 * const editor = ClassicEditor.create( document.querySelector( '#editor' ), {
 * 	plugins: [ integrationUsageDataPlugin ]
 * } );
 * ```
 */
export function createIntegrationUsageDataPlugin(
	integrationName: string,
	usageData: IntegrationUsageData
): IntegrationUsageDataPlugin {
	return function IntegrationUsageDataPlugin( editor: Editor ) {
		/**
		 * Do not collect usage data for integrations when using a free CKEditor license.
		 */
		if ( isCKEditorFreeLicense( editor.config.get( 'licenseKey' ) ) ) {
			return;
		}

		editor.on<IntegrationCollectUsageDataEvent>( 'collectUsageData', ( source, { setUsageData } ) => {
			setUsageData( `integration.${ integrationName }`, usageData );
		} );
	} satisfies PluginConstructor;
}

/**
 * The plugin collects usage data for an integration.
 */
export type IntegrationUsageDataPlugin = ( editor: Editor ) => void;

/**
 * The usage data for an integration.
 */
type IntegrationUsageData = {

	/**
	 * The version of the integration.
	 */
	version: string;

	/**
	 * The version of the framework that the integration is using.
	 */
	frameworkVersion?: string;
};

/**
 * The event fires when the editor collects usage data for integrations.
 * The editor should fire it after the `ready` event so the integrations can provide their usage data.
 */
type IntegrationCollectUsageDataEvent = {
	name: 'collectUsageData';
	args: [
		{
			setUsageData( path: `integration.${ string }`, value: IntegrationUsageData ): void;
		}
	];
};
